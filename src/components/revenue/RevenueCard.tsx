"use client"

export function RevenueCard({
  title,
  children,
  className = "",
}: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={`rounded-xl border border-white/[0.08] bg-white/[0.03] p-3.5 ${className}`}
    >
      <h3 className="text-[11px] uppercase tracking-[0.12em] text-zinc-500 mb-2.5">
        {title}
      </h3>
      {children}
    </section>
  )
}
