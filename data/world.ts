import type { PresidentTraitKey, RegimeType, RegionId, WorldKey } from "@/engine/types";

/**
 * Aucun regime n'est presente comme "bon" ou "mauvais" : ces libelles ne
 * font que nommer une configuration institutionnelle, qui change les
 * regles et situations rencontrees par le joueur.
 */
export const REGIME_LABELS: Record<RegimeType, string> = {
  democracy_stable: "Democratie stable",
  democracy_fragile: "Democratie fragile",
  authoritarian: "Regime autoritaire",
  repressive: "Regime repressif",
  transitional: "Periode de transition",
  unstable: "Etat instable",
};

export const PRESIDENT_TRAIT_LABELS: Record<PresidentTraitKey, string> = {
  integrity: "Integrite",
  authority: "Autorite",
  popularity: "Popularite",
  ambition: "Ambition",
  corruption: "Corruption",
  institutionalRespect: "Respect des institutions",
  militarySupport: "Soutien de l'armee",
  legitimacy: "Legitimite",
};

export const REGION_LABELS: Record<RegionId, string> = {
  nord: "Region Nord",
  centre: "Region Centre",
  sud: "Region Sud",
  capitale: "Capitale",
};

export const WORLD_LABELS: Record<WorldKey, string> = {
  economy: "Economie",
  security: "Securite",
  stability: "Stabilite",
  unemployment: "Chomage",
  corruption: "Corruption",
  govPopularity: "Popularite du gouvernement",
  foreignRelations: "Relations exterieures",
  socialTension: "Tension sociale",
  militaryPower: "Puissance militaire",
};
