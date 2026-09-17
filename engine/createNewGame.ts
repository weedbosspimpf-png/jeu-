import type { AmbitionKey, CareerTrackId, GameState, RelationshipState, Stats, StatKey } from "./types";
import { clampStat } from "./utils";
import { createInitialPresident } from "./world";

const AMBITION_KEYS: AmbitionKey[] = [
  "richesse",
  "influence",
  "prestige",
  "reputation",
  "politique",
  "institutions",
  "justice",
  "securite",
  "independance",
  "reforme",
  "protectionDesSiens",
  "stabilite",
];

function createInitialAmbitions(): Record<AmbitionKey, number> {
  const ambitions = {} as Record<AmbitionKey, number>;
  for (const key of AMBITION_KEYS) ambitions[key] = 10;
  return ambitions;
}

export interface NewGameParams {
  name: string;
  originId: string;
  countryName: string;
  baseStats: Stats;
  statModifiers: Partial<Record<StatKey, number>>;
  startingMoney: number;
  startingCareer?: { track: CareerTrackId; rankId: string };
  mentor: { npcId: string; name: string; role: string };
}

export function createNewGame(params: NewGameParams): GameState {
  const stats = { ...params.baseStats } as Stats;
  for (const [key, delta] of Object.entries(params.statModifiers)) {
    const statKey = key as StatKey;
    stats[statKey] = clampStat(stats[statKey] + (delta ?? 0));
  }

  const mentor: RelationshipState = {
    npcId: params.mentor.npcId,
    name: params.mentor.name,
    role: params.mentor.role,
    trust: 40,
    loyalty: 40,
    influence: 20,
    status: "neutral",
    history: [],
  };

  const state: GameState = {
    character: {
      name: params.name,
      age: 18,
      originId: params.originId,
      stats,
      money: params.startingMoney,
    },
    world: {
      countryName: params.countryName,
      population: 12_000_000,
      values: {
        economy: 55,
        security: 55,
        stability: 60,
        unemployment: 25,
        corruption: 40,
        govPopularity: 50,
        foreignRelations: 55,
        socialTension: 30,
        militaryPower: 50,
      },
      regime: "democracy_fragile",
      president: createInitialPresident(0),
    },
    career: {
      currentTrack: params.startingCareer?.track ?? null,
      currentRankId: params.startingCareer?.rankId ?? null,
      turnsInRank: 0,
      performance: 50,
      history: params.startingCareer
        ? [{ trackId: params.startingCareer.track, rankId: params.startingCareer.rankId, since: 0 }]
        : [],
    },
    relationships: { [mentor.npcId]: mentor },
    flags: {},
    pendingEffects: [],
    resolvedEventIds: [],
    eventCooldowns: {},
    history: [{ turn: 0, age: 18, label: "Le debut d'une nouvelle vie, a 18 ans." }],
    turn: 0,
    createdAt: Date.now(),
    ambitions: createInitialAmbitions(),
    declaredGoal: null,
    careerLegacy: {},
  };

  return state;
}
