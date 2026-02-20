"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

type SelectContextValue = {
  value?: string;
  onValueChange?: (v: string) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
};

const SelectContext = React.createContext<SelectContextValue | null>(null);

export function Select({
  value,
  onValueChange,
  children,
}: {
  value?: string;
  onValueChange?: (v: string) => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);

  // Fecha ao clicar fora
  const ref = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div ref={ref} className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const ctx = React.useContext(SelectContext);
  if (!ctx) throw new Error("SelectTrigger deve ser usado dentro de Select");

  return (
    <button
      type="button"
      onClick={() => ctx.setOpen(!ctx.open)}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
    >
      <div className="text-left">{children}</div>
      <ChevronDown className="h-4 w-4 text-muted-foreground" />
    </button>
  );
}

export function SelectValue({
  placeholder,
}: {
  placeholder?: string;
}) {
  const ctx = React.useContext(SelectContext);
  if (!ctx) throw new Error("SelectValue deve ser usado dentro de Select");

  return (
    <span className={cn(!ctx.value && "text-muted-foreground")}>
      {ctx.value ?? placeholder}
    </span>
  );
}

export function SelectContent({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const ctx = React.useContext(SelectContext);
  if (!ctx) throw new Error("SelectContent deve ser usado dentro de Select");

  if (!ctx.open) return null;

  return (
    <div
      className={cn(
        "absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-border bg-white shadow-lg",
        className
      )}
    >
      <div className="p-1">{children}</div>
    </div>
  );
}

export function SelectItem({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) {
  const ctx = React.useContext(SelectContext);
  if (!ctx) throw new Error("SelectItem deve ser usado dentro de Select");

  const active = ctx.value === value;

  return (
    <button
      type="button"
      onClick={() => {
        ctx.onValueChange?.(value);
        ctx.setOpen(false);
      }}
      className={cn(
        "w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-zinc-50 transition",
        active && "bg-emerald-50"
      )}
    >
      {children}
    </button>
  );
}