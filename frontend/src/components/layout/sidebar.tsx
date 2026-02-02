import Link from "next/link";

const nav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/plants", label: "Minhas Plantas" },
  { href: "/catalog", label: "Catálogo" },
  { href: "/rules", label: "Regras" },
  { href: "/events", label: "Eventos" },
];

export function Sidebar() {
  return (
    <aside className="hidden w-64 border-r border-neutral-800 bg-neutral-950/60 px-4 py-6 md:block">
      <div className="mb-6">
        <p className="text-sm font-semibold tracking-tight">Irrigação</p>
        <p className="text-xs text-neutral-400">Painel do usuário</p>
      </div>

      <nav className="space-y-1">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-lg px-3 py-2 text-sm text-neutral-200 hover:bg-neutral-900 hover:text-white"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-8 rounded-xl border border-neutral-800 bg-neutral-900/30 p-3">
        <p className="text-xs text-neutral-300">Ambiente</p>
        <p className="mt-1 text-xs text-neutral-400">
          Backend: <span className="font-mono">127.0.0.1:8000</span>
        </p>
      </div>
    </aside>
  );
}
