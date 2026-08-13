import { ArrowDownRight, ArrowUpRight, Clock, FileStack, ShieldAlert, TrendingUp, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { API_BASE } from "@/lib/api";

type Kpi = {
  label: string;
  value: string;
  sub: string;
  trend: number;
  trendGood: boolean;
  icon: React.ReactNode;
  tint: string;
};

export function KpiCards() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/api/stats`, {
        headers: { "Bypass-Tunnel-Reminder": "true" }
      });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-32 items-center justify-center rounded-xl bg-muted/50">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !data) {
    return <div className="text-danger text-sm">Erreur de chargement des statistiques.</div>;
  }

  const { kpis } = data;

  const KPIS: Kpi[] = [
    {
      label: "Réclamations enregistrées",
      value: kpis.total_complaints?.toString() || "0",
      sub: "Total cumulé",
      trend: 6.8,
      trendGood: false,
      icon: <FileStack className="h-5 w-5" />,
      tint: "bg-navy/10 text-navy",
    },
    {
      label: "Temps moyen de résolution",
      value: `${kpis.avg_resolution_time_days || "0"} j`,
      sub: "Objectif DOT : 3 j",
      trend: -12.4,
      trendGood: true,
      icon: <Clock className="h-5 w-5" />,
      tint: "bg-telecom/10 text-telecom",
    },
    {
      label: "Taux de résolution",
      value: `${kpis.resolution_rate_percent || "0"} %`,
      sub: `${kpis.total_complaints || 0} dossiers`,
      trend: 3.1,
      trendGood: true,
      icon: <TrendingUp className="h-5 w-5" />,
      tint: "bg-success/10 text-success",
    },
    {
      label: "Tickets à risque (ML)",
      value: "218", // Mock ML value
      sub: "Probabilité > 70 %",
      trend: -4.5,
      trendGood: true,
      icon: <ShieldAlert className="h-5 w-5" />,
      tint: "bg-danger/10 text-danger",
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {KPIS.map((k) => {
        const up = k.trend >= 0;
        const good = k.trendGood;
        return (
          <Card
            key={k.label}
            className="gap-0 border-border/70 p-5 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-raised)]"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="min-w-0 text-sm font-medium text-muted-foreground">{k.label}</p>
              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${k.tint}`}>{k.icon}</span>
            </div>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">{k.value}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${good ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
                  }`}
              >
                {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                {Math.abs(k.trend).toFixed(1)} %
              </span>
              <span className="text-xs text-muted-foreground">{k.sub}</span>
            </div>
          </Card>
        );
      })}
    </section>
  );
}
