// frontend/src/app/dashboard/page.tsx
import { APP_CONFIG } from "@/lib/config";
import { getMockDashboard } from "@/lib/mock/dashboard";
import { getMockEvents } from "@/lib/mock/events";
import { OfflineBanner } from "@/components/common/offline-banner";

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

function typeLabel(type: string) {
  if (type === "IRRIGATION") return "Irrigação";
  if (type === "SENSOR") return "Sensor";
  return "Regra aplicada";
}

function typePill(type: string) {
  if (type === "IRRIGATION") return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
  if (type === "SENSOR") return "bg-sky-50 text-sky-700 ring-1 ring-sky-200";
  return "bg-zinc-100 text-zinc-700 ring-1 ring-zinc-200";
}

export default async function DashboardPage() {
  const userId = APP_CONFIG.userIdDefault;

  const dashboard = await getMockDashboard(userId);
  const events = await getMockEvents(userId);

  const recentEvents = events.slice(0, 5);

  return (
    <div className="space-y-4 text-zinc-900">
      {APP_CONFIG.offlineMock ? <OfflineBanner /> : null}

      {/* Cabeçalho */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Dashboard</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Resumo do estado de irrigação e eventos recentes.
          </p>
        </div>
        <div className="text-sm text-zinc-500">
          Usuário: <span className="font-medium text-zinc-900">#{userId}</span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-zinc-500">Plantas cadastradas</p>
          <p className="mt-2 text-3xl font-semibold text-zinc-900">
            {dashboard?.total_plants ?? 0}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-zinc-500">Precisam de irrigação</p>
          <p className="mt-2 text-3xl font-semibold text-zinc-900">
            {dashboard?.needs_irrigation ?? 0}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-zinc-500">Irrigadas hoje</p>
          <p className="mt-2 text-3xl font-semibold text-zinc-900">
            {dashboard?.irrigated_today ?? 0}
          </p>
        </div>
      </div>

      {/* Próximas ações + Eventos recentes */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Próximas ações */}
        <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-100 p-4">
            <h3 className="text-base font-semibold text-zinc-900">Próximas ações</h3>
            <p className="mt-1 text-sm text-zinc-500">Sugestões do sistema para hoje/amanhã.</p>
          </div>

          <div className="p-4">
            {!dashboard || dashboard.next_actions.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-6 text-center">
                <p className="text-sm text-zinc-500">Sem ações pendentes no momento.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {dashboard.next_actions.map((a) => (
                  <div key={a.user_plant_id} className="rounded-xl border border-zinc-200 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-zinc-900">{a.plant_name}</p>
                        <p className="mt-1 text-sm text-zinc-600">{a.action}</p>
                      </div>
                      <div className="text-sm text-zinc-500">{a.when}</div>
                    </div>
                    <p className="mt-1 text-xs text-zinc-400">Planta #{a.user_plant_id}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Eventos recentes */}
        <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-100 p-4">
            <h3 className="text-base font-semibold text-zinc-900">Eventos recentes</h3>
            <p className="mt-1 text-sm text-zinc-500">Últimas atividades registradas.</p>
          </div>

          <div className="p-4">
            {recentEvents.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-6 text-center">
                <p className="text-sm text-zinc-500">Nenhum evento recente.</p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-100">
                {recentEvents.map((ev) => (
                  <div key={ev.id} className="flex items-start justify-between gap-4 py-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${typePill(ev.event_type)}`}>
                          {typeLabel(ev.event_type)}
                        </span>
                        <span className="text-sm font-semibold text-zinc-900">{ev.plant_name}</span>
                        <span className="text-xs text-zinc-400">#{ev.user_plant_id}</span>
                      </div>
                      {ev.details ? (
                        <p className="mt-1 text-sm text-zinc-600">{ev.details}</p>
                      ) : null}
                    </div>

                    <div className="whitespace-nowrap text-sm text-zinc-500">
                      {formatDateTime(ev.created_at)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
