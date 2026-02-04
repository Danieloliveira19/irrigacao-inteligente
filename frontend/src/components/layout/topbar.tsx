export function Topbar() {
  return (
    <header className="border-b border-neutral-800 bg-neutral-950/60">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <div>
          <p className="text-sm font-semibold">Sistema de Irrigação</p>
          <p className="text-xs text-neutral-400">MVP — Next.js + FastAPI</p>
        </div>

        <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 px-3 py-2 text-xs">
          <p className="text-neutral-300">Usuário</p>
          <p className="font-mono text-neutral-400">user_id=1</p>
        </div>
      </div>
    </header>
  );
}
