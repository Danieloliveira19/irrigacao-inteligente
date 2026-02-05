// frontend/src/components/ui/toast.tsx
"use client";

import React, { createContext, useCallback, useContext, useState } from "react";

type ToastType = "success" | "error" | "info";

type ToastAction = {
  label: string;
  onClick: () => void;
};

type Toast = {
  id: number;
  message: string;
  type: ToastType;
  action?: ToastAction;
};

type ToastContextType = {
  toast: (message: string, type?: ToastType, action?: ToastAction) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(
    (message: string, type: ToastType = "info", action?: ToastAction) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message, type, action }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      <div className="fixed right-4 top-4 z-50 space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={[
              "flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm shadow-lg ring-1",
              t.type === "success" && "bg-emerald-50 text-emerald-800 ring-emerald-200",
              t.type === "error" && "bg-rose-50 text-rose-800 ring-rose-200",
              t.type === "info" && "bg-zinc-900 text-white ring-zinc-800",
            ].join(" ")}
          >
            <span>{t.message}</span>

            {t.action ? (
              <button
                onClick={t.action.onClick}
                className="rounded-lg bg-white/90 px-2 py-1 text-xs font-medium text-zinc-900 hover:bg-white"
              >
                {t.action.label}
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast deve ser usado dentro de ToastProvider");
  return ctx;
}
