import type { Ending } from "@/engine/types";

export const ENDINGS: Ending[] = [
  {
    id: "arrested",
    title: "Arrestation",
    category: "failure",
    priority: 100,
    condition: (state) => state.flags.arrested === true,
    epilogue: (state) =>
      `${state.character.name} est arrete par les autorites de ${state.world.countryName}. ` +
      `Sa trajectoire criminelle se termine derriere les barreaux, a ${state.character.age} ans.`,
  },
  {
    id: "power-loss",
    title: "Chute du pouvoir",
    category: "power-loss",
    priority: 85,
    condition: (state) =>
      (state.career.currentTrack === "politics" &&
        (state.career.currentRankId === "ministre" || state.career.currentRankId === "elu") &&
        state.character.stats.reputation <= 10) ||
      (state.career.currentRankId === "president" &&
        (state.character.stats.reputation <= 10 || state.world.president.traits.legitimacy <= 10)),
    epilogue: (state) =>
      state.career.currentRankId === "president"
        ? `Sa legitimite s'est effondree : ${state.character.name} perd le pouvoir a ${state.character.age} ans, ` +
          `dans les conditions memes qui l'y avaient porte.`
        : `Rattrape par un scandale, ${state.character.name} perd tout credit politique et est ecarte ` +
          `du pouvoir a ${state.character.age} ans.`,
  },
  {
    id: "presidential-legacy",
    title: "Fin de mandat presidentiel",
    category: "president",
    priority: 88,
    condition: (state) => state.flags["voluntary-succession"] === true,
    epilogue: (state) => {
      const modeLabel =
        state.powerAccessionMode === "election"
          ? "elu par la population"
          : state.powerAccessionMode === "crisis-transition"
            ? "porte au pouvoir par une transition institutionnelle"
            : "arrive au pouvoir par la force";
      return (
        `${state.character.name} quitte volontairement la presidence de ${state.world.countryName} ` +
        `a ${state.character.age} ans, apres y avoir ete ${modeLabel}. Son heritage restera juge a l'aune ` +
        `de la maniere dont il ou elle y est arrive.`
      );
    },
  },
  {
    id: "total-downfall",
    title: "Effondrement",
    category: "failure",
    priority: 80,
    condition: (state) =>
      state.character.stats.integrity <= 5 && state.character.stats.reputation <= 5,
    epilogue: (state) =>
      `${state.character.name} a perdu toute credibilite et toute integrite aux yeux de tous. ` +
      `A ${state.character.age} ans, plus personne ne lui fait confiance.`,
  },
  {
    id: "retirement",
    title: "Retraite",
    category: "retirement",
    priority: 50,
    condition: (state) => state.flags.retired === true,
    epilogue: (state) =>
      `${state.character.name} prend sa retraite a ${state.character.age} ans, apres une carriere ` +
      `dans le domaine ${state.career.currentTrack ?? "civil"}.`,
  },
  {
    id: "legacy",
    title: "Heritage durable",
    category: "legacy",
    priority: 40,
    condition: (state) =>
      state.character.age >= 60 &&
      state.character.stats.influence >= 80 &&
      state.character.stats.reputation >= 80,
    epilogue: (state) =>
      `Sans jamais avoir cherche le sommet du pouvoir, ${state.character.name} laisse un heritage ` +
      `reconnu par tout ${state.world.countryName}.`,
  },
  {
    id: "old-age",
    title: "Fin naturelle",
    category: "death",
    priority: 10,
    condition: (state) => state.character.age >= 85,
    epilogue: (state) =>
      `${state.character.name} s'eteint paisiblement a ${state.character.age} ans, apres une longue vie.`,
  },
];
