import type { GameEvent } from "@/engine/types";

/**
 * Situations qui n'existent QUE parce que le personnage a developpe une
 * capacite comportementale particuliere (perspicacite, prudence...).
 * D'autres capacites (charisme, sang-froid, manipulation, ruse) sont
 * exploitees en ajoutant un choix supplementaire (`requires`) a des
 * evenements existants plutot qu'en dupliquant du contenu - voir
 * powerAccession.ts, politicsCareer.ts, policeCareer.ts, crimeCareer.ts.
 */
export const personalityMomentEvents: GameEvent[] = [
  {
    id: "insight-hidden-agenda",
    title: "Une intuition sur les intentions d'un rival",
    description:
      "Quelque chose dans l'attitude d'un rival attire ton attention : ses mots ne correspondent pas tout a fait a ses actes.",
    category: "personality",
    once: true,
    condition: (state) =>
      state.character.stats.perspicacity >= 65 &&
      Object.values(state.relationships).some((r) => r.status === "rival"),
    choices: [
      {
        id: "act-on-insight",
        label: "Te preparer discretement en fonction de ce que tu as compris",
        effects: [
          { type: "stat", stat: "perspicacity", delta: 3 },
          { type: "stat", stat: "influence", delta: 4 },
        ],
      },
      {
        id: "confront-with-insight",
        label: "Confronter directement ce rival avec ce que tu as devine",
        effects: [
          { type: "stat", stat: "courage", delta: 4 },
          { type: "stat", stat: "reputation", delta: 3 },
        ],
        hiddenEffects: [{ type: "stat", stat: "publicTrust", delta: -2 }],
      },
      {
        id: "keep-it-to-yourself",
        label: "Garder cette intuition pour toi, pour l'instant",
        effects: [{ type: "stat", stat: "prudence", delta: 2 }],
      },
    ],
  },
];
