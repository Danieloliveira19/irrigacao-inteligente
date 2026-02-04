// frontend/src/components/ui/toggle.tsx
"use client";

export function Toggle({
  checked,
  onChange,
  labelOn = "Ativa",
  labelOff = "Desativada",
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  labelOn?: string;
  labelOff?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={[
        "inline-flex items-center gap-2 rounded-full border px-2 py-1 text-xs font-medium",
        checked
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-zinc-200 bg-zinc-100 text-zinc-700",
      ].join(" ")}
      aria-pressed={checked}
    >
      <span
        className={[
          "h-4 w-4 rounded-full",
          checked ? "bg-emerald-500" : "bg-zinc-400",
        ].join(" ")}
      />
      {checked ? labelOn : labelOff}
    </button>
  );
}
