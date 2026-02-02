export function Topbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-neutral-800 bg-neutral-950/70 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <div>
          <p className="text-sm font-medium">Sistema de Irrigação</p>
          <p className="text-xs text-neutral-400">
            MVP — Next.js + FastAPI
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-neutral-800 bg-neutral-900/30 px-3 py-1">
            <p className="text-xs text-neutral-300">Usuário</p>
            <p className="text-xs text-neutral-400">
              <span className="font-mono">user_id=1</span>
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
