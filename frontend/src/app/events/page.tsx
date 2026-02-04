// frontend/src/app/events/page.tsx
import { APP_CONFIG } from "@/lib/config";
import { getMockEvents } from "@/lib/mock/events";
import { OfflineBanner } from "@/components/common/offline-banner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

function typeLabel(type: string) {
  if (type === "IRRIGATION") return "Irrigação";
  if (type === "SENSOR") return "Sensor";
  return "Regra aplicada";
}

function typePillClass(type: string) {
  // UX básica: só diferencia levemente por tipo
  if (type === "IRRIGATION") return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
  if (type === "SENSOR") return "bg-sky-50 text-sky-700 ring-1 ring-sky-200";
  return "bg-zinc-100 text-zinc-700 ring-1 ring-zinc-200";
}

export default async function EventsPage() {
  const userId = APP_CONFIG.userIdDefault;

  // Nesta fase: SEMPRE mock (offline)
  const events = await getMockEvents(userId);

  return (
    <div className="space-y-4">
      {APP_CONFIG.offlineMock ? <OfflineBanner /> : null}

      <Card>
        <CardHeader
          title="Eventos"
          subtitle="Histórico de ações, regras aplicadas e registros."
          right={
            <div className="text-sm text-zinc-500">
              Usuário: <span className="font-medium text-zinc-900">#{userId}</span>
            </div>
          }
        />

        <CardContent>
          {events.length === 0 ? (
            <EmptyState
              title="Nenhum evento ainda"
              description="Quando você rodar a engine ou registrar irrigação/sensores, os eventos vão aparecer aqui."
            />
          ) : (
            <div className="divide-y divide-zinc-100">
              {events.map((ev) => (
                <div key={ev.id} className="flex items-start justify-between gap-4 py-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${typePillClass(
                          ev.event_type
                        )}`}
                      >
                        {typeLabel(ev.event_type)}
                      </span>

                      <span className="text-sm font-semibold text-zinc-900">{ev.plant_name}</span>
                      <span className="text-xs text-zinc-400">#{ev.user_plant_id}</span>
                    </div>

                    {ev.details ? (
                      <p className="mt-2 break-words text-sm text-zinc-600">{ev.details}</p>
                    ) : (
                      <p className="mt-2 text-sm text-zinc-500">Sem detalhes.</p>
                    )}
                  </div>

                  <div className="whitespace-nowrap text-sm text-zinc-500">
                    {formatDateTime(ev.created_at)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
