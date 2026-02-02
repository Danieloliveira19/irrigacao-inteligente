import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/common/page-header";

export default function CatalogPage() {
  return (
    <AppShell>
      <PageHeader title="Catálogo" subtitle="Culturas disponíveis no catálogo." />
      <div className="rounded-xl border border-neutral-800 bg-neutral-950/40 p-6">
        <p className="text-sm text-neutral-300">
          Próximo: conectar <span className="font-mono">/plants/catalog</span>
        </p>
      </div>
    </AppShell>
  );
}
