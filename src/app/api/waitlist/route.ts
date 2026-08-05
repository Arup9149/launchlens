import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { emailService, renderWaitlistWelcome } from "@/lib/email"
import type { EmailEventType } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
    const name =
      typeof body.name === "string" ? body.name.trim() : undefined
    const source =
      typeof body.source === "string" ? body.source.trim().toLowerCase() : ""

    // notify_me (Builder Pass priority) vs waitlist early access
    const eventType: EmailEventType =
      source === "notify_me" ||
      (typeof name === "string" &&
        name.toLowerCase().includes("builder pass"))
        ? "notify_me"
        : "waitlist_welcome"

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 })
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
    if (!url || !key) {
      return NextResponse.json(
        { error: "Waitlist is temporarily unavailable" },
        { status: 503 }
      )
    }

    const supabase = createClient(url, key)

    // Store first — email must never block registration success
    const { error } = await supabase.from("waitlist").insert([{ email }])

    let alreadyOnList = false
    if (error) {
      const msg = (error.message || "").toLowerCase()
      const isDuplicate =
        error.code === "23505" ||
        msg.includes("duplicate") ||
        msg.includes("unique")

      if (isDuplicate) {
        alreadyOnList = true
        console.info(
          JSON.stringify({
            level: "info",
            msg: "waitlist.duplicate",
            email,
            type: eventType,
          })
        )
      } else {
        console.error(
          JSON.stringify({
            level: "error",
            msg: "waitlist.insert_failed",
            email,
            type: eventType,
            error: error.message,
            code: error.code,
          })
        )
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
    }

    // Confirmation email — new joins only; failures logged, never fail the UX
    let emailSent = false
    let emailSkipped = false
    if (alreadyOnList) {
      emailSkipped = true
      console.info(
        JSON.stringify({
          level: "info",
          msg: "waitlist.email_skipped_duplicate",
          email,
          type: eventType,
          status: "skipped",
        })
      )
    } else {
      try {
        const rendered = renderWaitlistWelcome({ email, name })
        await emailService.send({
          to: email,
          subject: rendered.subject,
          html: rendered.html,
          text: rendered.text,
          idempotencyKey: `${eventType}:${email}`,
          tags: {
            category: eventType,
          },
          type: eventType,
        })
        emailSent = true
      } catch (err) {
        const code =
          err instanceof Error && "code" in err
            ? String((err as { code?: string }).code)
            : undefined
        if (code === "EMAIL_NOT_CONFIGURED") {
          emailSkipped = true
          console.warn(
            JSON.stringify({
              level: "warn",
              msg: "waitlist.email_skipped_not_configured",
              email,
              type: eventType,
              status: "skipped",
              hint: "Set RESEND_API_KEY (and optional EMAIL_FROM_* overrides). MVP From defaults to LaunchLens <onboarding@resend.dev>.",
            })
          )
        } else {
          console.error(
            JSON.stringify({
              level: "error",
              msg: "waitlist.email_failed",
              email,
              type: eventType,
              status: "failed",
              error: err instanceof Error ? err.message : String(err),
            })
          )
        }
        // Do NOT fail UX
      }
    }

    return NextResponse.json({
      success: true,
      alreadyOnList,
      emailSent,
      emailSkipped,
      type: eventType,
    })
  } catch (err) {
    console.error(
      JSON.stringify({
        level: "error",
        msg: "waitlist.unhandled",
        error: err instanceof Error ? err.message : String(err),
      })
    )
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
