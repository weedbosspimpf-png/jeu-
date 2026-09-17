import type { CareerTrack } from "@/engine/types";

export const politicsTrack: CareerTrack = {
  id: "politics",
  label: "Politique",
  description:
    "Filiere politique, accessible depuis n'importe quelle autre trajectoire une fois l'influence suffisante.",
  careerGoal: "Atteindre les plus hautes fonctions politiques.",
  focusAmbitions: ["politique", "influence", "reforme", "institutions"],
  ranks: [
    {
      id: "militant",
      title: "Militant",
      minTurnsInRank: 0,
      requirements: (state) => state.character.stats.influence >= 30,
    },
    {
      id: "responsable-local",
      title: "Responsable local",
      minTurnsInRank: 1,
      requirements: (state) =>
        state.character.stats.diplomacy >= 45 && state.career.performance >= 45,
    },
    {
      id: "elu",
      title: "Elu",
      minTurnsInRank: 2,
      requirements: (state) =>
        state.character.stats.reputation >= 55 &&
        state.character.stats.charisma >= 50 &&
        state.career.performance >= 55,
      onPromote: [{ type: "stat", stat: "influence", delta: 10 }],
    },
    {
      id: "ministre",
      title: "Ministre",
      minTurnsInRank: 3,
      requirements: (state) =>
        state.character.stats.influence >= 70 && state.career.performance >= 65,
      onPromote: [
        { type: "stat", stat: "influence", delta: 15 },
        { type: "relationshipSyncPresident" },
      ],
    },
    {
      id: "candidat",
      title: "Candidat a la presidence",
      minTurnsInRank: 1,
      requirements: (state) =>
        state.character.stats.influence >= 80 && state.character.stats.reputation >= 60,
    },
    {
      id: "president",
      title: "President",
      minTurnsInRank: 1,
      // La presidence ne s'obtient jamais par simple seuil de stats : elle
      // passe toujours par une des voies simulees dans
      // data/events/powerAccession.ts (electorale, transition de crise,
      // coup), qui posent ce flag via l'effet becomePresident.
      requirements: (state) => state.flags["became-president"] === true,
    },
  ],
};
