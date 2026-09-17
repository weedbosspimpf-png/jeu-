/**
 * Types partages par tout le moteur de simulation.
 * Rien ici ne depend de React/Next : le moteur doit pouvoir tourner
 * dans un test unitaire pur ou une future UI differente.
 */

export type StatKey =
  | "intelligence"
  | "force"
  | "discipline"
  | "courage"
  | "ambition"
  | "leadership"
  | "loyalty"
  | "diplomacy"
  | "charisma"
  | "integrity"
  | "wealth"
  | "reputation"
  | "influence";

export type Stats = Record<StatKey, number>;

export type CareerTrackId =
  | "civil"
  | "army"
  | "police"
  | "gendarmerie"
  | "politics"
  | "entrepreneur"
  | "crime";

export type WorldKey =
  | "economy"
  | "security"
  | "stability"
  | "unemployment"
  | "corruption"
  | "govPopularity"
  | "foreignRelations"
  | "socialTension"
  | "militaryPower";

export interface WorldState {
  countryName: string;
  population: number;
  values: Record<WorldKey, number>;
}

export interface RelationshipState {
  npcId: string;
  name: string;
  role: string;
  trust: number;
  loyalty: number;
  influence: number;
  status: "neutral" | "ami" | "allie" | "rival" | "ennemi" | "superieur" | "subordonne" | "partenaire";
  history: string[];
}

export interface CareerRankRecord {
  trackId: CareerTrackId;
  rankId: string;
  since: number;
}

export interface CareerState {
  currentTrack: CareerTrackId | null;
  currentRankId: string | null;
  turnsInRank: number;
  performance: number;
  history: CareerRankRecord[];
}

export interface Character {
  name: string;
  age: number;
  originId: string;
  stats: Stats;
  money: number;
}

/** Effet declaratif applicable a un etat de jeu : entierement serialisable. */
export type Effect =
  | { type: "stat"; stat: StatKey; delta: number }
  | { type: "money"; delta: number }
  | { type: "relationship"; npcId: string; trust?: number; loyalty?: number; influence?: number }
  | { type: "relationshipStatus"; npcId: string; status: RelationshipState["status"] }
  | { type: "world"; key: WorldKey; delta: number }
  | { type: "flag"; flag: string; value: boolean }
  | { type: "careerPerformance"; delta: number }
  | { type: "joinCareer"; track: CareerTrackId; rankId: string };

export interface PendingEffect {
  id: string;
  triggerTurn: number;
  effect: Effect;
  sourceEventId: string;
  note?: string;
}

export interface HistoryEntry {
  turn: number;
  age: number;
  label: string;
}

export interface GameState {
  character: Character;
  world: WorldState;
  career: CareerState;
  relationships: Record<string, RelationshipState>;
  flags: Record<string, boolean>;
  pendingEffects: PendingEffect[];
  resolvedEventIds: string[];
  eventCooldowns: Record<string, number>;
  history: HistoryEntry[];
  turn: number;
  createdAt: number;
}

export interface EventChoice {
  id: string;
  label: string;
  effects: Effect[];
  hiddenEffects?: Effect[];
  delayedEffects?: { delay: number; effects: Effect[]; note?: string }[];
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  category: string;
  once?: boolean;
  cooldown?: number;
  weight?: number;
  condition: (state: GameState) => boolean;
  choices: EventChoice[];
}

export interface CareerRank {
  id: string;
  title: string;
  minTurnsInRank: number;
  requirements: (state: GameState) => boolean;
  onPromote?: Effect[];
}

export interface CareerTrack {
  id: CareerTrackId;
  label: string;
  description: string;
  ranks: CareerRank[];
}
