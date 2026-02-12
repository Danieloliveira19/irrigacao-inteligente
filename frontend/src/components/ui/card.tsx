// frontend/src/components/ui/card.tsx
import React from "react";
import { cn } from "@/lib/utils";

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: DivProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-zinc-200 bg-white shadow-sm",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({
  title,
  subtitle,
  right,
  className,
  ...props
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
} & DivProps) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 border-b border-zinc-100 p-4",
        className
      )}
      {...props}
    >
      <div>
        <h3 className="text-base font-semibold text-zinc-900">{title}</h3>
        {subtitle ? (
          <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>
        ) : null}
      </div>
      {right}
    </div>
  );
}

export function CardContent({ className, ...props }: DivProps) {
  return <div className={cn("p-4", className)} {...props} />;
}
