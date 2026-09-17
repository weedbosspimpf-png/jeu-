import type { GameState, WorldKey } from "./types";
import { clamp, randomInt } from "./utils";

/**
 * Le monde evolue meme si le joueur n'agit pas : derive aleatoire legere,
 * plus quelques regles de couplage simples entre variables.
 * Ce module ne connait rien du joueur : il ne lit/ecrit que state.world.
 */
export function worldTick(state: GameState): void {
  const v = state.world.values;

  drift(v, "economy", -2, 2);
  drift(v, "unemployment", -1, 2);
  drift(v, "corruption", -1, 1);
  drift(v, "foreignRelations", -2, 2);
  drift(v, "militaryPower", -1, 1);

  // Couplages : une mauvaise economie fait monter chomage et tension sociale.
  if (v.economy < 35) {
    v.unemployment = clamp(v.unemployment + randomInt(1, 3), 0, 100);
    v.socialTension = clamp(v.socialTension + randomInt(1, 3), 0, 100);
  } else if (v.economy > 65) {
    v.unemployment = clamp(v.unemployment - randomInt(0, 2), 0, 100);
    v.socialTension = clamp(v.socialTension - randomInt(0, 1), 0, 100);
  }

  if (v.corruption > 65) {
    v.govPopularity = clamp(v.govPopularity - randomInt(1, 3), 0, 100);
    v.stability = clamp(v.stability - randomInt(0, 2), 0, 100);
  }

  if (v.socialTension > 70) {
    v.stability = clamp(v.stability - randomInt(1, 3), 0, 100);
  } else if (v.socialTension < 30) {
    v.stability = clamp(v.stability + randomInt(0, 1), 0, 100);
  }

  drift(v, "govPopularity", -2, 2);
  drift(v, "stability", -1, 1);
  drift(v, "security", -1, 1);

  state.world.population = Math.max(0, Math.round(state.world.population * (1 + randomInt(-2, 4) / 1000)));
}

function drift(values: Record<WorldKey, number>, key: WorldKey, min: number, max: number): void {
  values[key] = clamp(values[key] + randomInt(min, max), 0, 100);
}
