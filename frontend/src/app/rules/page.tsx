import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/common/page-header";

export default function RulesPage() {
  return (
    <AppShell>
      <PageHeader title="Regras" subtitle="Regras de irrigação por planta." />
      <div className="rounded-xl border border-neutral-800 bg-neutral-950/40 p-6">
        <p className="text-sm text-neutral-300">
          Próximo: listar regras por planta e permitir editar (PATCH).
        </p>
      </div>
    </AppShell>
  );
}
