"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Cpu,
  Hand,
  CloudRain,
  Droplets,
  Sprout,
} from "lucide-react";

type WeeklyPoint = { label: string; liters: number };

type EventKind = "AUTO" | "MANUAL" | "RAIN" | "SENSOR";

type EventRow = {
  id: number;
  plant: string;
  date: string; // "09/02/2026 às 07:30"
  liters?: number; // some events (rain) don't have liters
  kind: EventKind;
};

function kindBadge(kind: EventKind) {
  switch (kind) {
    case "AUTO":
      return {
        label: "Auto",
        icon: Cpu,
        className: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
      };
    case "MANUAL":
      return {
        label: "Manual",
        icon: Hand,
        className: "bg-zinc-100 text-zinc-800 ring-1 ring-zinc-200",
      };
    case "RAIN":
      return {
        label: "Chuva",
        icon: CloudRain,
        className: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
      };
    case "SENSOR":
      return {
        label: "Sensor",
        icon: Droplets,
        className: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
      };
  }
}

function formatLiters(liters?: number) {
  if (liters === undefined) return "";
  // manter igual ao print: "2.5L"
  const v = Math.round(liters * 10) / 10;
  return `${v}L`;
}

/** Gráfico simples (SVG) estilo Lovable */
function WeeklyBarChart({ data }: { data: WeeklyPoint[] }) {
  const max = Math.max(...data.map((d) => d.liters), 1);

  return (
    <div className="w-full">
      <div className="relative h-[220px] w-full">
        {/* grid y labels */}
        <div className="absolute left-0 top-0 h-full w-10 flex flex-col justify-between text-xs text-muted-foreground">
          <span>{max}</span>
          <span>{Math.round((max * 3) / 4)}</span>
          <span>{Math.round(max / 2)}</span>
          <span>{Math.round(max / 4)}</span>
          <span>0</span>
        </div>

        {/* bars area */}
        <div className="absolute left-10 right-0 top-0 bottom-6">
          <svg viewBox="0 0 700 220" className="h-full w-full">
            {/* baseline */}
            <line x1="0" y1="200" x2="700" y2="200" stroke="rgba(0,0,0,0.06)" strokeWidth="2" />
            {/* bars */}
            {data.map((d, idx) => {
              const barW = 80;
              const gap = 20;
              const x = idx * (barW + gap);
              const h = (d.liters / max) * 170; // 170px height range
              const y = 200 - h;
              return (
                <g key={d.label}>
                  <rect
                    x={x}
                    y={y}
                    width={barW}
                    height={h}
                    rx={10}
                    className="fill-sky-500"
                    opacity="0.95"
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {/* x labels */}
        <div className="absolute left-10 right-0 bottom-0 flex items-center justify-between pr-2">
          {data.map((d) => (
            <div key={d.label} className="text-xs text-muted-foreground w-[80px] text-center">
              {d.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function EventsPage() {
  const weekly = useMemo<WeeklyPoint[]>(
    () => [
      { label: "03/02", liters: 8 },
      { label: "04/02", liters: 12 },
      { label: "05/02", liters: 5 },
      { label: "06/02", liters: 9 },
      { label: "07/02", liters: 0 },
      { label: "08/02", liters: 7 },
      { label: "09/02", liters: 4 },
    ],
    []
  );

  const events = useMemo<EventRow[]>(
    () => [
      { id: 201, plant: "Alface Crespa", date: "09/02/2026 às 07:30", liters: 2.5, kind: "AUTO" },
      { id: 202, plant: "Rúcula", date: "09/02/2026 às 07:30", liters: 1.8, kind: "AUTO" },
      { id: 203, plant: "Tomate Cereja", date: "08/02/2026 às 17:00", liters: 4, kind: "MANUAL" },
      { id: 204, plant: "Cenoura Nantes", date: "08/02/2026 às 07:00", liters: 1.2, kind: "AUTO" },
      { id: 205, plant: "Todas", date: "07/02/2026 às —", kind: "RAIN" },
      { id: 206, plant: "Pimentão Verde", date: "06/02/2026 às 06:45", liters: 3, kind: "SENSOR" },
      { id: 207, plant: "Alface Crespa", date: "06/02/2026 às 06:30", liters: 2.3, kind: "AUTO" },
      { id: 208, plant: "Couve Manteiga", date: "05/02/2026 às 08:00", liters: 2.8, kind: "MANUAL" },
    ],
    []
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Histórico de Irrigação 📊
        </h1>
        <p className="text-muted-foreground mt-1">
          Acompanhe todos os eventos de irrigação
        </p>
      </div>

      {/* Chart card */}
      <Card className="card">
        <CardContent className="p-6">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">
            Consumo semanal (litros)
          </h2>
          <WeeklyBarChart data={weekly} />
        </CardContent>
      </Card>

      {/* Events card */}
      <Card className="card">
        <CardContent className="p-6">
          <h2 className="font-display text-lg font-semibold text-foreground mb-6">
            Eventos recentes
          </h2>

          <div className="space-y-4">
            {events.map((ev) => {
              const badge = kindBadge(ev.kind);
              const Icon = badge.icon;

              return (
                <div
                  key={ev.id}
                  className={cn(
                    "flex items-center justify-between gap-4 rounded-2xl px-4 py-4",
                    "bg-white/70"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-50 ring-1 ring-emerald-100 flex items-center justify-center">
                      <Sprout className="h-5 w-5 text-emerald-700" />
                    </div>

                    <div>
                      <div className="font-display font-semibold text-foreground">
                        {ev.plant}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {ev.date}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {ev.liters !== undefined ? (
                      <div className="font-medium text-foreground min-w-[52px] text-right">
                        {formatLiters(ev.liters)}
                      </div>
                    ) : (
                      <div className="min-w-[52px]" />
                    )}

                    <span
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium",
                        badge.className
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {badge.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}