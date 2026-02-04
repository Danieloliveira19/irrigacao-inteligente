// frontend/src/components/common/offline-banner.tsx
export function OfflineBanner() {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <span className="font-semibold">Modo offline (mock) ativado</span> — você pode continuar o front. Depois trocamos para API real.
    </div>
  );
}
