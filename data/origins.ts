import type { CareerTrackId, StatKey } from "@/engine/types";

export interface Origin {
  id: string;
  label: string;
  description: string;
  statModifiers: Partial<Record<StatKey, number>>;
  startingMoney: number;
  startingCareer?: { track: CareerTrackId; rankId: string };
  mentor: { npcId: string; name: string; role: string };
}

export const ORIGINS: Origin[] = [
  {
    id: "civil",
    label: "Vie civile",
    description:
      "Tu sors du systeme scolaire ordinaire, sans reseau ni filiere imposee. Toutes les portes restent ouvertes.",
    statModifiers: { intelligence: 5, diplomacy: 5 },
    startingMoney: 500,
    mentor: { npcId: "mentor", name: "Mme Rahal", role: "Ancienne professeure" },
  },
  {
    id: "army",
    label: "Engagement militaire",
    description: "Tu t'engages dans l'armee fictive du pays a 18 ans, comme simple recrue.",
    statModifiers: { discipline: 10, force: 10, courage: 5, wealth: -5 },
    startingMoney: 300,
    startingCareer: { track: "army", rankId: "recrue" },
    mentor: { npcId: "mentor", name: "Sergent Okoro", role: "Instructeur" },
  },
  {
    id: "police",
    label: "Ecole de police",
    description: "Tu integres l'ecole de police pour devenir agent de terrain.",
    statModifiers: { discipline: 8, integrity: 8, courage: 5 },
    startingMoney: 350,
    startingCareer: { track: "police", rankId: "eleve" },
    mentor: { npcId: "mentor", name: "Inspectrice Dumont", role: "Formatrice" },
  },
  {
    id: "entrepreneur",
    label: "Entrepreneuriat",
    description: "Tu lances ta premiere petite activite avec des economies modestes.",
    statModifiers: { ambition: 10, charisma: 5, wealth: 5 },
    startingMoney: 800,
    startingCareer: { track: "entrepreneur", rankId: "independant" },
    mentor: { npcId: "mentor", name: "M. Kader", role: "Investisseur local" },
  },
  {
    id: "crime",
    label: "Trajectoire criminelle fictive",
    description:
      "Faute d'opportunites, tu te rapproches d'un reseau informel. Ce chemin fictif explore les consequences d'une vie hors-la-loi.",
    statModifiers: { courage: 8, loyalty: -5, integrity: -10, reputation: -10 },
    startingMoney: 150,
    startingCareer: { track: "crime", rankId: "recrue" },
    mentor: { npcId: "mentor", name: "Le Vieux", role: "Figure du reseau" },
  },
];

export function getOrigin(id: string): Origin {
  const origin = ORIGINS.find((o) => o.id === id);
  if (!origin) throw new Error(`Origine inconnue: ${id}`);
  return origin;
}
