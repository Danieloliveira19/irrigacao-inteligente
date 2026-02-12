"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Topbar() {
  // Mock por enquanto — depois vem do login (nome real)
  const user = { name: "Usuário" };

  const initials =
    user.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "U";

  return (
    <header className="h-16 bg-white border-b flex items-center justify-end px-6">
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>

        <span className="text-sm font-medium text-gray-700">{user.name}</span>
      </div>
    </header>
  );
}
