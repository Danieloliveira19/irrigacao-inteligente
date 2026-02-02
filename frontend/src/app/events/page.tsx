import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/common/page-header";

export default function EventsPage() {
  return (
    <AppShell>
      <PageHeader title="Eventos" subtitle="Histórico de eventos de irrigação." />
      <div className="rounded-xl border border-neutral-800 bg-neutral-950/40 p-6">
        <p className="text-sm text-neutral-300">
          Próximo: conectar <span className="font-mono">/events/user/1</span>
        </p>
      </div>
    </AppShell>
  );
}
