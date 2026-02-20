"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Radio,
  CloudRain,
  Droplets,
  Thermometer,
  Wifi,
  WifiOff,
} from "lucide-react";

type SensorStatus = "active" | "inactive";

type SensorCard = {
  id: string;
  title: string;
  subtitle: string;
  status: SensorStatus;
  icon: React.ElementType;
  value: string; // "62%" | "Sem chuva" | "—" | "28°C"
  description: string;
};

export default function SensorsPage() {
  const sensors: SensorCard[] = [
    {
      id: "rain",
      title: "Sensor de Chuva",
      subtitle: "Última leitura: Agora",
      status: "active",
      icon: CloudRain,
      value: "Sem chuva",
      description: "Detecta precipitação e pausa a irrigação automaticamente.",
    },
    {
      id: "soil-a",
      title: "Umidade do Solo - Canteiro A",
      subtitle: "Última leitura: Há 5 min",
      status: "active",
      icon: Droplets,
      value: "62%",
      description: "Mede a umidade do solo no canteiro principal.",
    },
    {
      id: "soil-b",
      title: "Umidade do Solo - Canteiro B",
      subtitle: "Última leitura: —",
      status: "inactive",
      icon: Droplets,
      value: "—",
      description: "Sensor não conectado. Verifique a instalação.",
    },
    {
      id: "temp",
      title: "Temperatura Ambiente",
      subtitle: "Última leitura: Agora",
      status: "active",
      icon: Thermometer,
      value: "28°C",
      description: "Temperatura atual medida na área de cultivo.",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          Sensores <span className="text-lg">🔬</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          Monitore os dados do campo em tempo real
        </p>
      </div>

      {/* Info banner */}
      <div className="rounded-2xl border border-sky-200 bg-sky-50 px-5 py-4 text-sky-900">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            <Radio className="h-5 w-5 text-sky-700" />
          </div>
          <div>
            <div className="font-medium">Recurso em desenvolvimento</div>
            <div className="text-sm text-sky-800/80 mt-1 leading-relaxed">
              A integração com sensores físicos está sendo preparada. Por enquanto,
              você pode simular os dados para testar o sistema.
            </div>
          </div>
        </div>
      </div>

      {/* Grid cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {sensors.map((s) => {
          const Icon = s.icon;
          const isActive = s.status === "active";

          return (
            <Card
              key={s.id}
              className={cn("card rounded-2xl", !isActive && "opacity-70")}
            >
              <CardContent className="p-6">
                {/* header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-50 ring-1 ring-emerald-100 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-emerald-700" />
                    </div>

                    <div className="space-y-1">
                      <div className="font-display font-semibold text-foreground">
                        {s.title}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {s.subtitle}
                      </div>
                    </div>
                  </div>

                  <Badge variant={isActive ? "green" : "muted"} className="px-3 py-1">
                    {isActive ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
                    {isActive ? "Ativo" : "Inativo"}
                  </Badge>
                </div>

                {/* big value box */}
                <div className="mt-5 rounded-2xl border border-border bg-zinc-50/60 px-6 py-7 flex items-center justify-center text-center">
                  <div
                    className={cn(
                      "font-display font-bold text-3xl text-foreground",
                      !isActive && "text-muted-foreground"
                    )}
                  >
                    {s.value}
                  </div>
                </div>

                {/* description */}
                <p className="mt-4 text-sm text-muted-foreground">
                  {s.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}