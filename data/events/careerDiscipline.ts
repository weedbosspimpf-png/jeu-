import type { GameEvent, GameState } from "@/engine/types";
import { computeDisciplinaryRisk } from "@/data/careerRisk";

/**
 * Chaine d'escalade disciplinaire commune aux filieres hierarchiques
 * (armee, police, gendarmerie) : avertissement -> sanction -> revocation.
 * Une mauvaise decision ne met jamais fin a la partie : la revocation
 * propose directement les nouvelles trajectoires ouvertes par le passe
 * du personnage, jamais un "GAME OVER".
 */

const HIERARCHICAL_TRACKS = ["army", "police", "gendarmerie"];

function inHierarchicalTrack(state: GameState): boolean {
  return HIERARCHICAL_TRACKS.includes(state.career.currentTrack ?? "");
}

export const careerDisciplineEvents: GameEvent[] = [
  {
    id: "hierarchical-discipline-warning",
    title: "Avertissement de la hierarchie",
    description:
      "Ton comportement recent degrade la confiance de ta hierarchie. Ce n'est pas encore une sanction, mais la situation est surveillee.",
    category: "career-discipline",
    cooldown: 3,
    condition: (state) => {
      if (!inHierarchicalTrack(state)) return false;
      const risk = computeDisciplinaryRisk(state);
      return risk >= 50 && risk < 75;
    },
    choices: [
      {
        id: "correct-behavior",
        label: "Redoubler d'efforts pour rassurer ta hierarchie",
        effects: [
          { type: "careerPerformance", delta: 15 },
          { type: "stat", stat: "discipline", delta: 5 },
        ],
      },
      {
        id: "ignore-warning",
        label: "Continuer comme avant",
        effects: [{ type: "stat", stat: "opportunism", delta: 2 }],
      },
    ],
  },
  {
    id: "hierarchical-sanction",
    title: "Une sanction disciplinaire",
    description:
      "Ta hierarchie decide de te sanctionner formellement. Ta carriere n'est pas terminee, mais la situation devient serieuse.",
    category: "career-discipline",
    cooldown: 4,
    condition: (state) =>
      inHierarchicalTrack(state) &&
      computeDisciplinaryRisk(state) >= 75 &&
      state.flags["career-sanctioned-once"] !== true,
    choices: [
      {
        id: "accept-sanction",
        label: "Accepter la sanction et te remettre en question",
        effects: [
          { type: "flag", flag: "career-sanctioned-once", value: true },
          { type: "stat", stat: "reputation", delta: -10 },
          { type: "careerPerformance", delta: -15 },
          { type: "stat", stat: "integrity", delta: 5 },
        ],
      },
      {
        id: "contest-sanction",
        label: "Contester la sanction",
        effects: [
          { type: "flag", flag: "career-sanctioned-once", value: true },
          { type: "stat", stat: "reputation", delta: -10 },
          { type: "careerPerformance", delta: -15 },
          { type: "stat", stat: "opportunism", delta: 4 },
          { type: "relationship", npcId: "mentor", trust: -10 },
        ],
      },
    ],
  },
  {
    id: "hierarchical-revocation",
    title: "La fin d'un chapitre",
    description:
      "Malgre la sanction, la situation ne s'est pas amelioree. Ta hierarchie met fin a tes fonctions. Ton passe reste cependant acquis : il t'ouvre encore des portes.",
    category: "career-discipline",
    cooldown: 6,
    condition: (state) =>
      inHierarchicalTrack(state) &&
      computeDisciplinaryRisk(state) >= 75 &&
      state.flags["career-sanctioned-once"] === true,
    choices: [
      {
        id: "one-last-effort",
        label: "Jouer ta derniere carte pour rester en poste",
        effects: [
          { type: "careerPerformance", delta: 25 },
          { type: "stat", stat: "discipline", delta: 10 },
        ],
      },
      {
        id: "leave-to-civil",
        label: "Accepter ton depart et rejoindre la vie civile",
        effects: [
          { type: "joinCareer", track: "civil", rankId: "employe", reason: "Sanction disciplinaire" },
        ],
      },
      {
        id: "leave-to-entrepreneur",
        label: "Utiliser tes indemnites de depart pour te lancer dans l'entrepreneuriat",
        requires: (state) => state.character.stats.wealth >= 30,
        effects: [
          { type: "joinCareer", track: "entrepreneur", rankId: "independant", reason: "Sanction disciplinaire" },
          { type: "money", delta: 300 },
        ],
      },
      {
        id: "leave-to-politics",
        label: "Te reconvertir directement en politique",
        requires: (state) => state.character.stats.influence >= 30,
        effects: [
          { type: "joinCareer", track: "politics", rankId: "militant", reason: "Sanction disciplinaire" },
        ],
      },
    ],
  },
];
