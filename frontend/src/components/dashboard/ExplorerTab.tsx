import { useMemo, useState } from "react";
import { Download, Eye, PencilLine, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CHANNELS, COMMUNES, STATUSES, TYPES } from "@/lib/dot-data";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { API_BASE } from "@/lib/api";

const statusTint: Record<string, string> = {
  Résolu: "bg-success/10 text-success",
  "En Cours": "bg-warning/10 text-warning",
  "Non Traité": "bg-danger/10 text-danger",
};

const priorityTint: Record<string, string> = {
  Haute: "bg-danger/10 text-danger",
  Moyenne: "bg-telecom/10 text-telecom",
  Basse: "bg-muted text-muted-foreground",
};

const ALL = "Tous";
const COMPLAINTS_PAGE_SIZE = 100;

async function fetchAllComplaints() {
  const headers = { "Bypass-Tunnel-Reminder": "true" };
  let skip = 0;
  let total = 0;
  const data: Record<string, unknown>[] = [];

  do {
    const res = await fetch(
      `${API_BASE}/api/complaints?skip=${skip}&limit=${COMPLAINTS_PAGE_SIZE}`,
      { headers },
    );
    if (!res.ok) throw new Error("Failed to fetch");
    const page = await res.json();
    total = page.total as number;
    data.push(...(page.data as Record<string, unknown>[]));
    skip += COMPLAINTS_PAGE_SIZE;
  } while (skip < total);

  return { total, data };
}

export function ExplorerTab() {
  const { data, isLoading } = useQuery({
    queryKey: ["complaints"],
    queryFn: fetchAllComplaints,
  });

  const [q, setQ] = useState("");
  const [status, setStatus] = useState(ALL);
  const [channel, setChannel] = useState(ALL);
  const [type, setType] = useState(ALL);
  const [commune, setCommune] = useState(ALL);

  const rawTickets = data?.data || [];

  const rows = useMemo(() => {
    return rawTickets.map((row: any, i: number) => ({
      id: `DOT-${(28450 + i).toString()}`,
      client: row.client_id,
      channel: row.canal,
      date: row.date_plainte,
      type: row.type_plainte,
      commune: row.commune,
      status: row.statut,
      priority: row.statut === "Non Traité" ? "Haute" : row.statut === "En Cours" ? "Moyenne" : "Basse",
    })).filter(
      (t: any) =>
        (status === ALL || t.status === status) &&
        (channel === ALL || t.channel === channel) &&
        (type === ALL || t.type === type) &&
        (commune === ALL || t.commune === commune) &&
        (q.trim() === "" ||
          t.client?.toLowerCase().includes(q.toLowerCase()) ||
          t.id.toLowerCase().includes(q.toLowerCase())),
    );
  }, [rawTickets, q, status, channel, type, commune]);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Card className="border-border/70 shadow-[var(--shadow-card)]">
      <CardHeader className="gap-1">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <div className="min-w-0">
            <CardTitle className="text-base font-semibold tracking-tight">Explorateur des réclamations</CardTitle>
            <CardDescription className="text-xs">
              {rows.length} dossier(s) affiché(s) sur {data?.total ?? rawTickets.length}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" className="shrink-0">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Exporter</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <div className="relative sm:col-span-2 xl:col-span-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Client ou n° ticket"
              maxLength={60}
              className="pl-9"
            />
          </div>
          <FilterSelect value={status} onChange={setStatus} items={STATUSES} placeholder="Statut" />
          <FilterSelect value={channel} onChange={setChannel} items={CHANNELS} placeholder="Canal" />
          <FilterSelect value={type} onChange={setType} items={TYPES} placeholder="Type" />
          <FilterSelect value={commune} onChange={setCommune} items={COMMUNES} placeholder="Commune" />
        </div>

        <div className="overflow-x-auto rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/60">
                <TableHead className="whitespace-nowrap">Ticket</TableHead>
                <TableHead className="whitespace-nowrap">Client</TableHead>
                <TableHead className="whitespace-nowrap">Canal</TableHead>
                <TableHead className="whitespace-nowrap">Date</TableHead>
                <TableHead className="whitespace-nowrap">Type</TableHead>
                <TableHead className="whitespace-nowrap">Commune</TableHead>
                <TableHead className="whitespace-nowrap">Priorité</TableHead>
                <TableHead className="whitespace-nowrap">Statut</TableHead>
                <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.slice(0, 40).map((t: any) => (
                <TableRow key={t.id} className="text-sm">
                  <TableCell className="font-medium whitespace-nowrap text-telecom">{t.id}</TableCell>
                  <TableCell className="whitespace-nowrap">{t.client}</TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{t.channel}</TableCell>
                  <TableCell className="whitespace-nowrap tabular-nums text-muted-foreground">{t.date}</TableCell>
                  <TableCell className="whitespace-nowrap">{t.type}</TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{t.commune}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={`${priorityTint[t.priority]} border-0`}>
                      {t.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={`${statusTint[t.status]} border-0 whitespace-nowrap`}>
                      {t.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    <Button variant="ghost" size="icon" aria-label={`Consulter ${t.id}`}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label={`Traiter ${t.id}`}>
                      <PencilLine className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="py-10 text-center text-sm text-muted-foreground">
                    Aucune réclamation ne correspond aux filtres sélectionnés.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function FilterSelect({
  value,
  onChange,
  items,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  items: readonly string[];
  placeholder: string;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL}>{placeholder} : tous</SelectItem>
        {items.map((i) => (
          <SelectItem key={i} value={i}>
            {i}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
