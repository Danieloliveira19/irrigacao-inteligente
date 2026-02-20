"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Bell, Globe } from "lucide-react";

export default function SettingsPage() {
  // MOCK (depois liga no backend)
  const [profile, setProfile] = useState({
    name: "João Carlos",
    email: "joao@fazenda.com",
    farmName: "Sítio Boa Esperança",
  });

  const [notifications, setNotifications] = useState({
    irrigationAlerts: true,
    sensorAlerts: true,
    dailySummary: false,
  });

  const [prefs, setPrefs] = useState({
    waterUnit: "L",
    timezone: "America/Sao_Paulo",
  });

  const timezoneLabel = useMemo(() => {
    if (prefs.timezone === "America/Sao_Paulo") return "Brasília (GMT-3)";
    if (prefs.timezone === "America/Manaus") return "Manaus (GMT-4)";
    if (prefs.timezone === "America/Rio_Branco") return "Rio Branco (GMT-5)";
    return prefs.timezone;
  }, [prefs.timezone]);

  function handleSave() {
    alert("Alterações salvas (mock).");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          Configurações <span className="text-lg">⚙️</span>
        </h1>
        <p className="text-muted-foreground mt-1">Gerencie seu perfil e preferências</p>
      </div>

      {/* Perfil */}
      <Card className="rounded-2xl">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-50 ring-1 ring-emerald-100 flex items-center justify-center">
              <User className="h-5 w-5 text-emerald-700" />
            </div>
            <h2 className="font-display text-lg font-semibold">Perfil</h2>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input
                value={profile.name}
                onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>E-mail</Label>
              <Input
                value={profile.email}
                onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Nome da Propriedade</Label>
              <Input
                value={profile.farmName}
                onChange={(e) => setProfile((p) => ({ ...p, farmName: e.target.value }))}
              />
            </div>
          </div>

          <div className="mt-6">
            <Button
              onClick={handleSave}
              className="rounded-xl bg-emerald-700 hover:bg-emerald-700/90"
            >
              Salvar alterações
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notificações */}
      <Card className="rounded-2xl">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-50 ring-1 ring-emerald-100 flex items-center justify-center">
              <Bell className="h-5 w-5 text-emerald-700" />
            </div>
            <h2 className="font-display text-lg font-semibold">Notificações</h2>
          </div>

          <div className="mt-6 space-y-5">
            <RowToggle
              title="Alertas de irrigação"
              description="Receba avisos quando for hora de irrigar"
              checked={notifications.irrigationAlerts}
              onCheckedChange={(v) =>
                setNotifications((n) => ({ ...n, irrigationAlerts: v }))
              }
            />
            <RowToggle
              title="Alertas de sensor"
              description="Avise quando um sensor ficar offline"
              checked={notifications.sensorAlerts}
              onCheckedChange={(v) => setNotifications((n) => ({ ...n, sensorAlerts: v }))}
            />
            <RowToggle
              title="Resumo diário"
              description="Receba um resumo das irrigações do dia"
              checked={notifications.dailySummary}
              onCheckedChange={(v) => setNotifications((n) => ({ ...n, dailySummary: v }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Preferências */}
      <Card className="rounded-2xl">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-50 ring-1 ring-emerald-100 flex items-center justify-center">
              <Globe className="h-5 w-5 text-emerald-700" />
            </div>
            <h2 className="font-display text-lg font-semibold">Preferências</h2>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <Label>Unidade de medida de água</Label>
              <Select
                value={prefs.waterUnit}
                onValueChange={(value) => setPrefs((p) => ({ ...p, waterUnit: value }))}
              >
                <SelectTrigger className="rounded-xl bg-white">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L">Litros (L)</SelectItem>
                  <SelectItem value="ml">Mililitros (ml)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Fuso horário</Label>
              <Select
                value={prefs.timezone}
                onValueChange={(value) => setPrefs((p) => ({ ...p, timezone: value }))}
              >
                <SelectTrigger className="rounded-xl bg-white">
                  {/* aqui a gente mostra o label bonitinho */}
                  <span className={prefs.timezone ? "" : "text-muted-foreground"}>
                    {prefs.timezone ? timezoneLabel : "Selecione..."}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/Sao_Paulo">Brasília (GMT-3)</SelectItem>
                  <SelectItem value="America/Manaus">Manaus (GMT-4)</SelectItem>
                  <SelectItem value="America/Rio_Branco">Rio Branco (GMT-5)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function RowToggle({
  title,
  description,
  checked,
  onCheckedChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <div className="font-medium text-foreground">{title}</div>
        <div className="text-sm text-muted-foreground">{description}</div>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}