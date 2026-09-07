import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, BrainCircuit, Table2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { KpiCards } from "@/components/dashboard/KpiCards";
import { ExecutiveTab } from "@/components/dashboard/ExecutiveTab";
import { PredictiveTab } from "@/components/dashboard/PredictiveTab";
import { ExplorerTab } from "@/components/dashboard/ExplorerTab";

const title = "DOT M'Sila — Analytique des réclamations | Algérie Télécom";
const description =
  "Tableau de bord décisionnel des réclamations clients de la Direction Opérationnelle d'Algérie Télécom M'Sila : KPI, tendances, prédiction IA et explorateur de dossiers.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="mx-auto max-w-[1400px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="sr-only">
          Tableau de bord analytique des réclamations clients — DOT M'Sila, Algérie Télécom
        </h1>
        <KpiCards />

        <Tabs defaultValue="exec" className="space-y-4">
          <TabsList className="h-auto w-full flex-wrap justify-start gap-1 rounded-xl bg-muted p-1">
            <TabsTrigger value="exec" className="gap-2 rounded-lg px-3 py-2 text-sm data-[state=active]:shadow-[var(--shadow-card)]">
              <BarChart3 className="h-4 w-4" />
              Tableau exécutif
            </TabsTrigger>
            <TabsTrigger value="ml" className="gap-2 rounded-lg px-3 py-2 text-sm data-[state=active]:shadow-[var(--shadow-card)]">
              <BrainCircuit className="h-4 w-4" />
              Prédiction & insights
            </TabsTrigger>
            <TabsTrigger value="data" className="gap-2 rounded-lg px-3 py-2 text-sm data-[state=active]:shadow-[var(--shadow-card)]">
              <Table2 className="h-4 w-4" />
              Explorateur de données
            </TabsTrigger>
          </TabsList>

          <TabsContent value="exec">
            <ExecutiveTab />
          </TabsContent>
          <TabsContent value="ml">
            <PredictiveTab />
          </TabsContent>
          <TabsContent value="data">
            <ExplorerTab />
          </TabsContent>
        </Tabs>

        <footer className="border-t border-border pt-4 pb-2 text-xs text-muted-foreground">
          Algérie Télécom — Direction Opérationnelle des Télécommunications de M'Sila. Données de démonstration.
        </footer>
      </main>
    </div>
  );
}
