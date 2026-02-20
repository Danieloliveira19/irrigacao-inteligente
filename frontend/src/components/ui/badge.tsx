// frontend/src/components/ui/badge.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant = "default" | "green" | "blue" | "amber" | "rose";

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

export function Badge({ children, variant = "default", className, ...props }: BadgeProps) {
  const map: Record<BadgeVariant, string> = {
    default: "bg-zinc-100 text-zinc-700 ring-1 ring-zinc-200",
    green: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    blue: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
    amber: "bg-amber-50 text-amber-800 ring-1 ring-amber-200",
    rose: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
  };

  return (
    <span
      className={cn("inline-flex items-center rounded-full px-2 py-1 text-xs font-medium", map[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
}
