import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/common/page-header";

export default function PlantsPage() {
  return (
    <AppShell>
      <PageHeader title="Minhas Plantas" subtitle="Lista de plantas do usuário." />
      <div className="rounded-xl border border-neutral-800 bg-neutral-950/40 p-6">
        <p className="text-sm text-neutral-300">
          Próximo: conectar <span className="font-mono">/users/1/plants</span>
        </p>
      </div>
    </AppShell>
  );
}
