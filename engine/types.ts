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
  | "influence"
  | "opportunism"
  | "empathy"
  | "authority"
  | "greed"
  | "popularity"
  | "publicTrust"
  | "malice"
  | "ruse"
  | "manipulation"
  | "perspicacity"
  | "prudence"
  | "coolness";

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

export type RegimeType =
  | "democracy_stable"
  | "democracy_fragile"
  | "authoritarian"
  | "repressive"
  | "transitional"
  | "unstable";

export type PresidentTraitKey =
  | "integrity"
  | "authority"
  | "popularity"
  | "ambition"
  | "corruption"
  | "institutionalRespect"
  | "militarySupport"
  | "legitimacy";

/**
 * Voie par laquelle un personnage a accede a la presidence : influence
 * durablement sa legitimite et la maniere dont il doit ensuite gouverner
 * (voir becomePresident et data/events/presidencyGovernance.ts).
 */
export type PowerAccessionMode = "election" | "crisis-transition" | "coup";

/** Regions fictives du pays, utilisees pour une popularite qui varie geographiquement. */
export type RegionId = "nord" | "centre" | "sud" | "capitale";

/**
 * Le president a sa propre personnalite, independante de la relation que
 * le joueur entretient avec lui (voir relationships["president"]).
 */
export interface PresidentProfile {
  name: string;
  traits: Record<PresidentTraitKey, number>;
  sinceTurn: number;
}

export interface WorldState {
  countryName: string;
  population: number;
  values: Record<WorldKey, number>;
  regime: RegimeType;
  president: PresidentProfile;
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
  /** Popularite politique, differente d'une region a l'autre du pays. */
  regionalPopularity: Record<RegionId, number>;
}

/**
 * Ambitions secondaires, communes a toutes les filieres : elles evoluent
 * avec les choix du joueur (jamais imposees), et permettent de deduire
 * une ambition principale emergente quand aucun objectif n'a ete
 * explicitement declare (voir data/ambitions.ts, cote presentation).
 */
export type AmbitionKey =
  | "richesse"
  | "influence"
  | "prestige"
  | "reputation"
  | "politique"
  | "institutions"
  | "justice"
  | "securite"
  | "independance"
  | "reforme"
  | "protectionDesSiens"
  | "stabilite";

export interface DeclaredGoal {
  label: string;
  trackId: CareerTrackId;
  declaredTurn: number;
}

/**
 * Empreinte laissee par une filiere quittee : le passe du personnage ne
 * disparait jamais quand il change de trajectoire (voir applyEffect,
 * cas "joinCareer").
 */
export interface CareerLegacyEntry {
  peakRankId: string;
  turnsServed: number;
  reputationAtExit: number;
  influenceAtExit: number;
  exitTurn: number;
  /** Ex: "Sanction disciplinaire", "Faillite", "Defaite electorale". Absent = depart volontaire ordinaire. */
  exitReason?: string;
}

/** Ampleur d'une action sociale (voir engine/socialActions.ts) : determine le cout et le potentiel d'effet. */
export type SocialActionScale = "small" | "medium" | "large";

/** Effet declaratif applicable a un etat de jeu : entierement serialisable. */
export type Effect =
  | { type: "stat"; stat: StatKey; delta: number }
  | { type: "money"; delta: number }
  | { type: "relationship"; npcId: string; trust?: number; loyalty?: number; influence?: number }
  | { type: "relationshipStatus"; npcId: string; status: RelationshipState["status"] }
  | { type: "relationshipInit"; npcId: string; name: string; role: string }
  | { type: "world"; key: WorldKey; delta: number }
  | { type: "flag"; flag: string; value: boolean }
  | { type: "careerPerformance"; delta: number }
  | { type: "joinCareer"; track: CareerTrackId; rankId: string; reason?: string }
  | { type: "presidentTrait"; trait: PresidentTraitKey; delta: number }
  | { type: "regimeShift"; regime: RegimeType }
  | { type: "relationshipSyncPresident" }
  | { type: "ambition"; key: AmbitionKey; delta: number }
  | { type: "declareGoal"; label: string }
  | { type: "regionalPopularity"; region: RegionId; delta: number }
  | { type: "resolvePresidentialElection" }
  | { type: "resolveCrisisTransition" }
  | { type: "resolveCoupAttempt" }
  | { type: "becomePresident"; mode: PowerAccessionMode }
  | { type: "resolveSocialAction"; cost: number; scale: SocialActionScale };

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
  ambitions: Record<AmbitionKey, number>;
  declaredGoal: DeclaredGoal | null;
  careerLegacy: Partial<Record<CareerTrackId, CareerLegacyEntry>>;
  powerAccessionMode: PowerAccessionMode | null;
  /** Identifiants des particularites de personnalite deja debloquees (voir engine/traits.ts). */
  unlockedTraits: string[];
}

/**
 * Une particularite de personnalite emerge d'une combinaison de stats
 * comportementales, jamais d'une seule stat isolee : elle raconte que le
 * personnage a developpe une facon de penser/agir reconnaissable, sans
 * devenir une classe figee (voir data/personalityTraits.ts).
 */
export interface PersonalityTrait {
  id: string;
  label: string;
  icon: string;
  description: string;
  condition: (state: GameState) => boolean;
}

export interface EventChoice {
  id: string;
  label: string;
  effects: Effect[];
  hiddenEffects?: Effect[];
  delayedEffects?: { delay: number; effects: Effect[]; note?: string }[];
  /**
   * Rend ce choix disponible seulement si la condition est vraie (ex: une
   * stat comportementale assez haute debloque une solution alternative).
   * Absent = toujours disponible. Jamais un simple bonus numerique : une
   * vraie option narrative supplementaire.
   */
  requires?: (state: GameState) => boolean;
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
  /** Objectif professionnel de reference pour cette filiere (affiche au joueur, jamais garanti). */
  careerGoal: string;
  /** Ambitions secondaires que cette filiere permet de nourrir en priorite. */
  focusAmbitions: AmbitionKey[];
  ranks: CareerRank[];
}

export interface Ending {
  id: string;
  title: string;
  category:
    | "success"
    | "failure"
    | "retirement"
    | "death"
    | "power-loss"
    | "legacy"
    | "president";
  /** Plus le nombre est eleve, plus cette fin est prioritaire si plusieurs correspondent. */
  priority: number;
  condition: (state: GameState) => boolean;
  epilogue: (state: GameState) => string;
}
