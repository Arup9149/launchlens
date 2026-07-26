"use client"

export function WaitlistForm() {
  return (
    <form
      className="flex flex-col sm:flex-row gap-2.5"
      onSubmit={async (e) => {
        e.preventDefault()
        const form = e.currentTarget
        const emailInput = form.querySelector("input") as HTMLInputElement
        const button = form.querySelector("button") as HTMLButtonElement

        const email = emailInput.value.trim()

        button.disabled = true
        button.textContent = "Joining..."

        try {
          const res = await fetch("/api/waitlist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          })

          if (res.ok) {
            button.textContent = "You're on the list ✓"
            emailInput.value = ""
          } else {
            button.textContent = "Try again"
            button.disabled = false
          }
        } catch (err) {
          button.textContent = "Try again"
          button.disabled = false
        }
      }}
    >
      <input
        type="email"
        required
        placeholder="you@email.com"
        className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-full px-5 py-3 text-[14px] text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/40 transition"
      />
      <button
        type="submit"
        className="bg-gradient-to-r from-violet-500 to-violet-600 px-7 py-3 rounded-full text-[14px] font-medium text-white whitespace-nowrap hover:from-violet-400 hover:to-violet-500 transition"
      >
        Join waitlist
      </button>
    </form>
  )
}