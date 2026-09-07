export const CHANNELS = ["Call Center", "Web Form", "Réclamation écrite"] as const;
export type Channel = (typeof CHANNELS)[number];

export const COMMUNES = [
  "M'Sila",
  "Bou Saâda",
  "Aïn El Melh",
  "Sidi Aïssa",
  "Magra",
  "Hammam Dhalaa",
  "Ouled Derradj",
  "Chellal",
] as const;
export type Commune = (typeof COMMUNES)[number];

export const TYPES = ["ADSL", "FTTH Fibre", "Facturation", "Coupure Réseau", "Qualité Call Center"] as const;
export type ComplaintType = (typeof TYPES)[number];

export const STATUSES = ["Résolu", "En Cours", "Non Traité"] as const;
export type Status = (typeof STATUSES)[number];

export const CLIENT_TYPES = ["Résidentiel", "Professionnel", "Entreprise", "Administration"] as const;

export const MONTHLY_TRENDS = [
  { month: "Jan", recues: 412, resolues: 366, delai: 3.9 },
  { month: "Fév", recues: 388, resolues: 350, delai: 3.6 },
  { month: "Mar", recues: 465, resolues: 401, delai: 4.2 },
  { month: "Avr", recues: 502, resolues: 448, delai: 3.8 },
  { month: "Mai", recues: 476, resolues: 437, delai: 3.4 },
  { month: "Juin", recues: 531, resolues: 470, delai: 3.7 },
  { month: "Juil", recues: 604, resolues: 512, delai: 4.5 },
  { month: "Août", recues: 578, resolues: 511, delai: 4.1 },
  { month: "Sep", recues: 495, resolues: 452, delai: 3.3 },
  { month: "Oct", recues: 523, resolues: 489, delai: 3.1 },
  { month: "Nov", recues: 548, resolues: 507, delai: 2.9 },
  { month: "Déc", recues: 571, resolues: 534, delai: 2.7 },
];

export const VOLUME_BY_TYPE = [
  { month: "Juil", ADSL: 168, "FTTH Fibre": 142, Facturation: 121, "Coupure Réseau": 96, "Qualité Call Center": 77 },
  { month: "Août", ADSL: 152, "FTTH Fibre": 149, Facturation: 118, "Coupure Réseau": 89, "Qualité Call Center": 70 },
  { month: "Sep", ADSL: 131, "FTTH Fibre": 138, Facturation: 102, "Coupure Réseau": 71, "Qualité Call Center": 53 },
  { month: "Oct", ADSL: 139, "FTTH Fibre": 151, Facturation: 108, "Coupure Réseau": 66, "Qualité Call Center": 59 },
  { month: "Nov", ADSL: 143, "FTTH Fibre": 162, Facturation: 111, "Coupure Réseau": 74, "Qualité Call Center": 58 },
  { month: "Déc", ADSL: 147, "FTTH Fibre": 178, Facturation: 114, "Coupure Réseau": 69, "Qualité Call Center": 63 },
];

export const STATUS_DISTRIBUTION = [
  { name: "Résolu", value: 4477, color: "var(--success)" },
  { name: "En Cours", value: 981, color: "var(--warning)" },
  { name: "Non Traité", value: 635, color: "var(--danger)" },
];

export const BY_COMMUNE = [
  { commune: "M'Sila", total: 1682, enRetard: 214 },
  { commune: "Bou Saâda", total: 1231, enRetard: 178 },
  { commune: "Sidi Aïssa", total: 764, enRetard: 96 },
  { commune: "Aïn El Melh", total: 612, enRetard: 88 },
  { commune: "Magra", total: 528, enRetard: 61 },
  { commune: "Hammam Dhalaa", total: 483, enRetard: 55 },
  { commune: "Ouled Derradj", total: 421, enRetard: 47 },
  { commune: "Chellal", total: 372, enRetard: 39 },
];

export type Ticket = {
  id: string;
  client: string;
  channel: Channel;
  date: string;
  type: ComplaintType;
  commune: Commune;
  status: Status;
  priority: "Haute" | "Moyenne" | "Basse";
};

const NAMES = [
  "Amine Belkacem", "Nadia Cherif", "Yacine Bouzid", "Samira Hadj Ali", "Karim Mezhoud",
  "Fatiha Benali", "Riad Zerrouki", "Lamia Boudiaf", "Sofiane Merabet", "Hakim Ouali",
  "Djamila Saïdi", "Toufik Rahmani", "Meriem Guerfi", "Bilal Hamdani", "Salima Kaci",
  "Rachid Lounis", "Imane Ferhat", "Nabil Bensalem", "Wassila Chaïb", "Omar Tibaoui",
];

function mulberry(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const TICKETS: Ticket[] = (() => {
  const rnd = mulberry(2026);
  const pick = <T,>(a: readonly T[]) => a[Math.floor(rnd() * a.length)];
  return Array.from({ length: 96 }, (_, i) => {
    const day = 1 + Math.floor(rnd() * 28);
    const month = 10 + Math.floor(rnd() * 3);
    return {
      id: `DOT-${String(28450 + i)}`,
      client: pick(NAMES),
      channel: pick(CHANNELS),
      date: `2025-${String(Math.min(month, 12)).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      type: pick(TYPES),
      commune: pick(COMMUNES),
      status: pick(STATUSES),
      priority: pick(["Haute", "Moyenne", "Basse"] as const),
    };
  });
})();
