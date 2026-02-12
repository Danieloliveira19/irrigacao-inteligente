"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Leaf,
  BookOpen,
  Droplets,
  History,
  Radio,
  Settings,
  LogOut,
} from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Painel", icon: LayoutDashboard },
  { href: "/plants", label: "Minhas Plantas", icon: Leaf },
  { href: "/catalog", label: "Catálogo", icon: BookOpen },
  { href: "/rules", label: "Regras de Irrigação", icon: Droplets },
  { href: "/events", label: "Histórico", icon: History },
  { href: "/sensors", label: "Sensores", icon: Radio },
  { href: "/settings", label: "Configurações", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => pathname === href;

  function handleLogout() {
    // Amanhã: limpar cookie/token aqui
    router.push("/login");
  }

  return (
    <aside className="w-64 h-screen sticky top-0 bg-gradient-to-b from-[#163c2b] to-[#0f2e21] text-white flex flex-col">
      {/* Logo / Marca */}
      <div className="h-20 flex items-center px-6 gap-3">
        <img
          src="/logoverde.png"
          alt="Irriva"
          className="h-11 w-11"
        />
        <div className="leading-tight">
          <p className="text-2xl font-semibold tracking-tight">Irriva</p>
        </div>
      </div>

      {/* Navegação */}
      <nav className="flex-1 px-3 py-2 space-y-2">
        {nav.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex items-center gap-3 px-4 py-2.5 rounded-lg transition",
                active
                  ? "bg-[#1f7a4a] text-white"
                  : "text-white/80 hover:bg-white/10 hover:text-white",
              ].join(" ")}
            >
              <Icon size={18} />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sair no rodapé */}
      <div className="p-4 border-t border-white/10 mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 text-white/80 hover:text-white transition"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Sair</span>
        </button>
      </div>
    </aside>
  );
}
