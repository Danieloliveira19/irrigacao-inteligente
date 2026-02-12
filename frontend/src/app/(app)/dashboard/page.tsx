// frontend/src/app/(app)/dashboard/page.tsx
import { APP_CONFIG } from "@/lib/config";
import { getMockDashboard } from "@/lib/mock/dashboard";
import { getMockEvents } from "@/lib/mock/events";
import { OfflineBanner } from "@/components/common/offline-banner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

function formatDateTimeShort(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

function typeLabel(type: string) {
  if (type === "IRRIGATION") return "Irrigação";
  if (type === "SENSOR") return "Sensor";
  return "Regra";
}

function typePill(type: string) {
  if (type === "IRRIGATION") return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
  if (type === "SENSOR") return "bg-sky-50 text-sky-700 ring-1 ring-sky-200";
  return "bg-zinc-100 text-zinc-700 ring-1 ring-zinc-200";
}

function sumWeeklyLiters(events: any[]) {
  const days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  const values = new Array(7).fill(0);

  for (const ev of events) {
    if (ev.event_type !== "IRRIGATION") continue;

    const dt = new Date(ev.created_at);
    const dow = dt.getDay();
    const idx = dow === 0 ? 6 : dow - 1;

    let liters = 0;
    if (typeof ev.details === "string") {
      const m = ev.details.match(/(\d+([.,]\d+)?)/);
      if (m?.[1]) liters = Number(m[1].replace(",", "."));
    }

    values[idx] += liters;
  }

  return { days, values };
}

export default async function DashboardPage() {
  const userId = APP_CONFIG.userIdDefault;

  const dashboard = await getMockDashboard(userId);
  const events = await getMockEvents(userId);

  // depois: vir do login/back
  const userName = "Usuário";

  const totalPlants = dashboard?.total_plants ?? 0;
  const needsIrrigation = dashboard?.needs_irrigation ?? 0;
  const irrigatedToday = dashboard?.irrigated_today ?? 0;

  const statusToday = needsIrrigation > 0 ? "Atenção" : "Tudo OK";

  const lastIrrigation = events.find((e: any) => e.event_type === "IRRIGATION");
  const lastIrrigationText = lastIrrigation ? formatDateTimeShort(lastIrrigation.created_at) : "—";
  const lastIrrigationSub = lastIrrigation ? "Registrada" : "Nenhuma ainda";

  const weatherMain = "Sem chuva";
  const weatherSub = "Previsão: seco hoje";

  const { days, values } = sumWeeklyLiters(events);

  const recentEvents = events.slice(0, 6);
  const nextActions = dashboard?.next_actions ?? [];

  return (
    <div className="space-y-6">
      {APP_CONFIG.offlineMock ? <OfflineBanner /> : null}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          {getGreeting()}, {userName}! ☀️
        </h1>
        <p className="text-sm text-gray-500">Aqui está o resumo do seu cultivo</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Plantas Cadastradas"
          value={String(totalPlants)}
          subtitle={`${Math.max(totalPlants, 0)} culturas diferentes`}
          emoji="🍃"
        />
        <StatCard
          title="Status de Hoje"
          value={statusToday}
          subtitle={`${Math.max(irrigatedToday, 0)} OK · ${Math.max(needsIrrigation, 0)} atenção`}
          emoji="💧"
        />
        <StatCard
          title="Última Irrigação"
          value={lastIrrigationText}
          subtitle={lastIrrigationSub}
          emoji="🕒"
        />
        <StatCard
          title="Clima"
          value={weatherMain}
          subtitle={weatherSub}
          emoji="☁️"
        />
      </div>

      {/* Gráfico + Suas plantas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 rounded-xl">
          <CardContent className="p-6">
            <h2 className="font-semibold text-gray-900 mb-4">
              Irrigação da Semana (litros)
            </h2>
            <WeeklyBars days={days} values={values} />
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardContent className="p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Suas Plantas</h2>
            {totalPlants === 0 ? (
              <div className="text-sm text-gray-500 text-center py-10">
                Nenhuma planta cadastrada ainda
              </div>
            ) : (
              <div className="text-sm text-gray-700">
                Você tem {totalPlants} planta(s) cadastrada(s).
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Preenche a área de baixo (sem vazio) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="rounded-xl">
          <CardHeader
            title="Próximas ações"
            subtitle="Sugestões do sistema para hoje/amanhã."
          />
          <CardContent>
            {nextActions.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-6 text-center">
                <p className="text-sm text-zinc-500">Sem ações pendentes no momento.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {nextActions.slice(0, 6).map((a: any) => (
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
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardHeader
            title="Eventos recentes"
            subtitle="Últimas atividades registradas."
          />
          <CardContent>
            {recentEvents.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-6 text-center">
                <p className="text-sm text-zinc-500">Nenhum evento recente.</p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-100">
                {recentEvents.map((ev: any) => (
                  <div key={ev.id} className="flex items-start justify-between gap-4 py-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${typePill(ev.event_type)}`}
                        >
                          {typeLabel(ev.event_type)}
                        </span>
                        <span className="text-sm font-semibold text-zinc-900">{ev.plant_name}</span>
                        <span className="text-xs text-zinc-400">#{ev.user_plant_id}</span>
                      </div>
                      {ev.details ? <p className="mt-1 text-sm text-zinc-600">{ev.details}</p> : null}
                    </div>

                    <div className="whitespace-nowrap text-sm text-zinc-500">
                      {formatDateTimeShort(ev.created_at)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  emoji,
}: {
  title: string;
  value: string;
  subtitle: string;
  emoji: string;
}) {
  return (
    <Card className="rounded-xl">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-sm text-gray-500">{title}</div>
            <div className="mt-2 text-2xl font-semibold text-gray-900 truncate">
              {value}
            </div>
            <div className="mt-1 text-xs text-gray-400">{subtitle}</div>
          </div>

          <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
            {emoji}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function WeeklyBars({ days, values }: { days: string[]; values: number[] }) {
  const max = Math.max(1, ...values);

  return (
    <div className="h-56 flex items-end gap-6">
      {values.map((v, i) => {
        const pct = Math.round((v / max) * 100);
        const barH = Math.max(6, pct); // nunca some
        return (
          <div key={days[i]} className="flex flex-col items-center gap-2">
            <div
              className="w-14 rounded-xl bg-[#1f7a4a]"
              style={{ height: `${barH}%` }}
              title={`${v.toFixed(1)} L`}
            />
            <div className="text-xs text-gray-500">{days[i]}</div>
          </div>
        );
      })}
    </div>
  );
}
