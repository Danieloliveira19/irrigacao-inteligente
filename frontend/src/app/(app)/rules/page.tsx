"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  Droplets,
  CloudRain,
  Thermometer,
  Timer,
  Moon,
  Leaf,
} from "lucide-react";

type Rule = {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  enabled: boolean;
  locked?: boolean; // quando true, fica cinza e não pode ativar
};

export default function RulesPage() {
  const [rules, setRules] = useState<Rule[]>([
    {
      id: "no-rain",
      title: "Não irrigar se chover",
      description:
        "Quando o sensor detectar chuva, a irrigação será pausada automaticamente.",
      icon: CloudRain,
      enabled: true,
    },
    {
      id: "every-2-days",
      title: "Irrigar a cada 2 dias",
      description: "As plantas serão irrigadas automaticamente a cada 48 horas.",
      icon: Timer,
      enabled: true,
    },
    {
      id: "cold-days",
      title: "Reduzir irrigação em dias frios",
      description:
        "Quando a temperatura estiver abaixo de 15°C, a irrigação será reduzida em 30%.",
      icon: Thermometer,
      enabled: false,
      locked: true, // igual o print: toggle cinza
    },
    {
      id: "early-morning",
      title: "Irrigar pela manhã cedo",
      description:
        "A irrigação acontecerá preferencialmente entre 5h e 7h da manhã para reduzir evaporação.",
      icon: Moon,
      enabled: true,
    },
    {
      id: "min-soil",
      title: "Umidade mínima do solo",
      description:
        "Irrigar automaticamente quando a umidade do solo cair abaixo de 40%.",
      icon: Droplets,
      enabled: false,
      locked: true, // igual o print: toggle cinza
    },
    {
      id: "by-stage",
      title: "Ajustar por estágio da planta",
      description:
        "Plantas em germinação recebem mais água. Plantas em colheita recebem menos.",
      icon: Leaf,
      enabled: true,
    },
  ]);

  const onToggle = (id: string, next: boolean) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: next } : r))
    );
  };

  const tipText = useMemo(
    () =>
      "Dica: Ative as regras que fazem sentido para o seu cultivo. O sistema usará essas regras para decidir automaticamente quando irrigar.",
    []
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Regras de Irrigação 💧
        </h1>
        <p className="text-muted-foreground mt-1">
          Configure quando e como suas plantas devem ser irrigadas
        </p>
      </div>

      {/* Tip box */}
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-800">
        <span className="font-medium">💡 {tipText}</span>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {rules.map((r) => {
          const Icon = r.icon;

          return (
            <Card
              key={r.id}
              className={cn(
                "rounded-2xl border border-border bg-card",
                r.locked ? "opacity-60" : "opacity-100"
              )}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-50 ring-1 ring-emerald-100 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-emerald-700" />
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-display text-base font-semibold text-foreground">
                        {r.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed max-w-[46ch]">
                        {r.description}
                      </p>
                    </div>
                  </div>

                  <Switch
                    checked={r.enabled}
                    onCheckedChange={(v) => onToggle(r.id, v)}
                    disabled={!!r.locked}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground">
        Nesta fase o toggle altera só no frontend (mock). Depois conectamos na API real.
      </p>
    </div>
  );
}