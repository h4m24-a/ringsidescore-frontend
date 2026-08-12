export default function NotFound() {
  return (
    <main className="bg-canvas text-ink font-body antialiased flex items-center justify-center px-6">
      <div className="relative max-w-xl text-center">
        {/* Background ring effect */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center">
          <div className="h-72 w-72 rounded-full border border-ink/10 animate-pulse" />
          <div className="absolute h-52 w-52 rounded-full border border-ink/10" />
        </div>

        {/* Boxing glove icon */}
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-ink/10 bg-white/5 text-5xl shadow-xl backdrop-blur-xl">
          🥊
        </div>

        {/* Main message */}
        <h1 className="text-7xl font-black tracking-tight">
          404
        </h1>

        <h2 className="mt-4 text-2xl font-bold">
          This fight doesn’t exist
        </h2>

        <p className="mx-auto mt-3 max-w-md text-ink/60">
          The page you’re looking for has stepped out of the ring. It may have
          been removed, moved, or never scheduled.
        </p>

        {/* CTA */}
        <a
          href="/"
          className="mt-8 mb-6 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3 text-sm font-bold text-canvas transition hover:scale-105"
        >
          Return to Corner
          <span>🥊</span>
        </a>

        {/* Decorative boxing ropes */}
        {/* Decorative boxing ropes */}
        <div className="pointer-events-none absolute -bottom-10 left-1/2 flex w-64 -translate-x-1/2 flex-col gap-3">
          <span className="h-1.5 w-full rounded-full bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]" />
          <span className="h-1.5 w-full rounded-full bg-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.4)]" />
          <span className="h-1.5 w-full rounded-full bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.4)]" />
        </div>
      </div>
    </main>
  );
}