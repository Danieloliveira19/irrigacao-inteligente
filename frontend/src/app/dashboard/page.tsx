import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/common/page-header";

export default function DashboardPage() {
  return (
    <AppShell>
      <PageHeader
        title="Dashboard"
        subtitle="Resumo do estado de irrigação e eventos recentes."
      />
      <div className="rounded-xl border border-neutral-800 bg-neutral-950/40 p-6">
        <p className="text-sm text-neutral-300">
          Próximo: conectar <span className="font-mono">/dashboard/user/1</span>
        </p>
      </div>
    </AppShell>
  );
}
