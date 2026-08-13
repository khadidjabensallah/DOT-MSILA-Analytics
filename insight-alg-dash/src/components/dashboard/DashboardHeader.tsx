import { Activity, CalendarDays, Filter, MapPin, Signal } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CHANNELS, COMMUNES } from "@/lib/dot-data";

const RANGES = ["30 derniers jours", "Trimestre en cours", "6 derniers mois", "Année 2025"];

export function DashboardHeader() {
  return (
    <header className="border-b border-border bg-[image:var(--gradient-brand)] text-primary-foreground">
      <div className="mx-auto max-w-[1400px] px-4 py-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/12 ring-1 ring-white/25 backdrop-blur">
              <Signal className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold tracking-tight sm:text-xl">Algérie Télécom</p>
              <p className="truncate text-xs text-white/70 sm:text-sm">
                DOT M'SILA — Direction Opérationnelle
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs ring-1 ring-white/20">
            <Activity className="h-3.5 w-3.5" />
            <span className="whitespace-nowrap">Moteur IA actif</span>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <HeaderFilter icon={<CalendarDays className="h-4 w-4" />} label="Période" items={RANGES} defaultValue={RANGES[2]} />
          <HeaderFilter icon={<Filter className="h-4 w-4" />} label="Canal" items={["Tous les canaux", ...CHANNELS]} defaultValue="Tous les canaux" />
          <HeaderFilter icon={<MapPin className="h-4 w-4" />} label="Commune" items={["Toutes les communes", ...COMMUNES]} defaultValue="Toutes les communes" />
        </div>
      </div>
    </header>
  );
}

function HeaderFilter({
  icon,
  label,
  items,
  defaultValue,
}: {
  icon: React.ReactNode;
  label: string;
  items: readonly string[];
  defaultValue: string;
}) {
  return (
    <label className="flex min-w-0 items-center gap-2 rounded-xl bg-white/10 px-3 py-2 ring-1 ring-white/20">
      <span className="shrink-0 text-white/70">{icon}</span>
      <span className="shrink-0 text-xs font-medium text-white/70">{label}</span>
      <Select defaultValue={defaultValue}>
        <SelectTrigger className="h-8 min-w-0 flex-1 border-0 bg-transparent text-sm font-medium shadow-none focus:ring-0 focus-visible:ring-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {items.map((i) => (
            <SelectItem key={i} value={i}>
              {i}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  );
}
