import type { GameState, PresidentProfile, RegimeType, WorldKey } from "./types";
import { clamp, clampStat, randomInt } from "./utils";

const PRESIDENT_NAME_POOL = [
  "Amara Koffi",
  "Ibrahima Toure",
  "Salimata Bakayoko",
  "Moussa Diarra",
  "Fatou Cisse",
  "Kwame Sango",
  "Aminata Sarr",
  "Bakary Ouedraogo",
];

export function createInitialPresident(sinceTurn: number): PresidentProfile {
  return {
    name: PRESIDENT_NAME_POOL[randomInt(0, PRESIDENT_NAME_POOL.length - 1)]!,
    traits: {
      integrity: randomInt(35, 65),
      authority: randomInt(45, 70),
      popularity: 50,
      ambition: randomInt(40, 75),
      corruption: randomInt(25, 50),
      institutionalRespect: randomInt(35, 65),
    },
    sinceTurn,
  };
}

/**
 * Le monde evolue meme si le joueur n'agit pas : derive aleatoire legere,
 * plus quelques regles de couplage simples entre variables.
 * Ce module ne connait rien du joueur : il ne lit/ecrit que state.world
 * (et le president, qui fait partie du monde independamment du joueur).
 * Retourne un message a inscrire dans l'historique si un evenement notable
 * du monde (changement de regime, election) a eu lieu ce tour-ci.
 */
export function worldTick(state: GameState): string | null {
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

  driftPresident(state);
  const regimeLog = updateRegime(state);
  const electionLog = maybeHoldElection(state);

  return electionLog ?? regimeLog ?? null;
}

function drift(values: Record<WorldKey, number>, key: WorldKey, min: number, max: number): void {
  values[key] = clamp(values[key] + randomInt(min, max), 0, 100);
}

/** Les traits du president et le climat general du pays s'influencent mutuellement. */
function driftPresident(state: GameState): void {
  const v = state.world.values;
  const traits = state.world.president.traits;

  traits.popularity = clampStat(traits.popularity + Math.round((v.govPopularity - traits.popularity) * 0.15) + randomInt(-2, 2));
  traits.corruption = clampStat(traits.corruption + Math.round((v.corruption - traits.corruption) * 0.1) + randomInt(-1, 1));
  v.govPopularity = clamp(v.govPopularity + Math.round((traits.popularity - v.govPopularity) * 0.1), 0, 100);
}

/**
 * Le regime institutionnel n'est jamais presente comme bon ou mauvais :
 * il change simplement les regles du monde selon la stabilite et la
 * corruption ambiante.
 */
function updateRegime(state: GameState): string | null {
  const v = state.world.values;
  const previous = state.world.regime;
  let next: RegimeType = previous;

  if (v.corruption > 75 && v.stability < 35) next = "unstable";
  else if (v.corruption > 60 && v.socialTension > 60) next = "repressive";
  else if (v.stability >= 65 && v.corruption <= 45) next = "democracy_stable";
  else if (v.stability < 45) next = "democracy_fragile";
  else if (v.corruption > 55) next = "authoritarian";

  if (next !== previous) {
    state.world.regime = next;
    return `Le climat politique du pays change de nature.`;
  }
  return null;
}

/**
 * En regime democratique, une election peut remplacer le president
 * independamment des actions du joueur. Le nouveau president a sa propre
 * personnalite : la relation que le joueur entretenait avec le precedent
 * ne se transfere pas automatiquement.
 */
function maybeHoldElection(state: GameState): string | null {
  const regime = state.world.regime;
  if (regime !== "democracy_stable" && regime !== "democracy_fragile" && regime !== "transitional") {
    return null;
  }
  const yearsInOffice = state.turn - state.world.president.sinceTurn;
  if (yearsInOffice < 6) return null;
  if (randomInt(1, 100) > 12) return null;

  const previousName = state.world.president.name;
  state.world.president = createInitialPresident(state.turn);
  return `Election presidentielle : ${previousName} laisse place a ${state.world.president.name}.`;
}
