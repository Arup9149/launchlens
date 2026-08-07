/** Shared minimal shell for legal/policy pages — no product chrome changes. */
export function LegalShell({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen safe-px py-16 max-w-3xl mx-auto">
      <a
        href="/"
        className="text-[13px] text-zinc-500 hover:text-zinc-300 transition mb-8 inline-block"
      >
        ← LaunchLens
      </a>
      <h1 className="text-3xl font-medium tracking-tight mb-2">{title}</h1>
      <p className="text-[13px] text-zinc-500 mb-10">
        Last updated: 7 August 2026
      </p>
      <div className="prose-legal space-y-6 text-[15px] text-zinc-300 leading-relaxed">
        {children}
      </div>
    </main>
  )
}
