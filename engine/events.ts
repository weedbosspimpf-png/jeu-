import type { GameEvent, GameState, PendingEffect } from "./types";
import { applyEffects } from "./effects";
import { nextId, pickWeighted } from "./utils";

/**
 * Moteur d'evenements generique : condition -> choix -> consequences.
 * Ajouter un evenement = ajouter une entree dans data/events/*, jamais
 * modifier ce fichier.
 */
export function getAvailableEvents(state: GameState, registry: GameEvent[]): GameEvent[] {
  return registry.filter((event) => {
    if (event.once && state.resolvedEventIds.includes(event.id)) return false;
    const cooldownUntil = state.eventCooldowns[event.id];
    if (cooldownUntil !== undefined && state.turn < cooldownUntil) return false;
    return event.condition(state);
  });
}

export function pickNextEvent(state: GameState, registry: GameEvent[]): GameEvent | null {
  const available = getAvailableEvents(state, registry);
  return pickWeighted(available, (e) => e.weight ?? 1);
}

export function applyChoice(state: GameState, event: GameEvent, choiceId: string): string[] {
  const choice = event.choices.find((c) => c.id === choiceId);
  if (!choice) throw new Error(`Choix inconnu ${choiceId} pour l'evenement ${event.id}`);

  const log: string[] = [`${event.title} -> ${choice.label}`];

  applyEffects(state, choice.effects);
  if (choice.hiddenEffects) applyEffects(state, choice.hiddenEffects);

  if (choice.delayedEffects) {
    for (const delayed of choice.delayedEffects) {
      // Un effet differe peut contenir plusieurs effets : on les eclate en plusieurs PendingEffect.
      for (const effect of delayed.effects) {
        const pending: PendingEffect = {
          id: nextId("pending"),
          triggerTurn: state.turn + delayed.delay,
          effect,
          sourceEventId: event.id,
          note: delayed.note,
        };
        state.pendingEffects.push(pending);
      }
    }
  }

  if (event.once) state.resolvedEventIds.push(event.id);
  if (event.cooldown) state.eventCooldowns[event.id] = state.turn + event.cooldown;

  return log;
}

export function resolvePendingEffects(state: GameState): string[] {
  const due = state.pendingEffects.filter((p) => p.triggerTurn <= state.turn);
  if (due.length === 0) return [];

  state.pendingEffects = state.pendingEffects.filter((p) => p.triggerTurn > state.turn);

  const log: string[] = [];
  for (const pending of due) {
    applyEffects(state, [pending.effect]);
    if (pending.note) log.push(pending.note);
  }
  return log;
}
