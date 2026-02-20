"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type SwitchProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

export function Switch({ checked, onCheckedChange, className, disabled, ...props }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => {
        if (disabled) return;
        onCheckedChange(!checked);
      }}
      className={cn(
        "relative inline-flex h-7 w-12 items-center rounded-full transition-colors ring-1 ring-inset",
        checked ? "bg-emerald-600 ring-emerald-600" : "bg-zinc-200 ring-zinc-200",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow",
          checked ? "translate-x-6" : "translate-x-1"
        )}
      />
    </button>
  );
}