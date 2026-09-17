import type { CareerTrack, GameEvent, GameState } from "./types";
import { worldTick } from "./world";
import { careerTick } from "./careers";
import { pickNextEvent, resolvePendingEffects } from "./events";

export interface Registry {
  events: GameEvent[];
  careerTracks: CareerTrack[];
}

export interface TurnResult {
  state: GameState;
  log: string[];
  nextEvent: GameEvent | null;
}

/**
 * Fait avancer la simulation d'un tour (1 an dans le prototype).
 * Toujours appele sur une COPIE de l'etat (deep clone en amont),
 * jamais sur l'etat encore affiche par l'UI.
 */
export function advanceTurn(state: GameState, registry: Registry): TurnResult {
  const log: string[] = [];

  state.turn += 1;
  state.character.age += 1;

  const worldLog = worldTick(state);
  if (worldLog) log.push(worldLog);

  const pendingLog = resolvePendingEffects(state);
  log.push(...pendingLog);

  const promotionLog = careerTick(state, registry.careerTracks);
  if (promotionLog) log.push(promotionLog);

  state.history.push({
    turn: state.turn,
    age: state.character.age,
    label: promotionLog ?? worldLog ?? `Annee ${state.character.age} ans.`,
  });

  const nextEvent = pickNextEvent(state, registry.events);

  return { state, log, nextEvent };
}
