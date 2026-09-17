"use client";

import { create } from "zustand";
import type { Ending, GameEvent, GameState } from "@/engine/types";
import { createNewGame } from "@/engine/createNewGame";
import { advanceTurn } from "@/engine/simulation";
import { applyChoice, pickNextEvent } from "@/engine/events";
import { checkEnding } from "@/engine/endings";
import { checkNewTraits } from "@/engine/traits";
import { saveGame, loadGame, clearSave, hasSave } from "@/engine/save";
import { BASE_STATS } from "@/data/stats";
import { getOrigin } from "@/data/origins";
import { ALL_EVENTS } from "@/data/events";
import { CAREER_TRACKS } from "@/data/careers";
import { ENDINGS } from "@/data/endings";
import { PERSONALITY_TRAITS } from "@/data/personalityTraits";

function describeNewTraits(traits: ReturnType<typeof checkNewTraits>): string[] {
  return traits.map((trait) => `${trait.icon} Particularite developpee : ${trait.label}`);
}

interface GameStore {
  state: GameState | null;
  currentEvent: GameEvent | null;
  ending: Ending | null;
  log: string[];
  hasExistingSave: boolean;
  startNewGame: (name: string, originId: string) => void;
  chooseOption: (choiceId: string) => void;
  advance: () => void;
  continueSavedGame: () => void;
  resetGame: () => void;
}

function cloneState(state: GameState): GameState {
  return JSON.parse(JSON.stringify(state)) as GameState;
}

export const useGameStore = create<GameStore>((set, get) => ({
  state: null,
  currentEvent: null,
  ending: null,
  log: [],
  hasExistingSave: hasSave(),

  startNewGame: (name, originId) => {
    const origin = getOrigin(originId);
    const newState = createNewGame({
      name,
      originId,
      countryName: "Republique de Verdania",
      baseStats: BASE_STATS,
      statModifiers: origin.statModifiers,
      startingMoney: origin.startingMoney,
      startingCareer: origin.startingCareer,
      mentor: origin.mentor,
    });
    const firstEvent = pickNextEvent(newState, ALL_EVENTS);
    saveGame(newState);
    set({ state: newState, currentEvent: firstEvent, ending: null, log: [], hasExistingSave: true });
  },

  chooseOption: (choiceId) => {
    const { state, currentEvent } = get();
    if (!state || !currentEvent) return;
    const next = cloneState(state);
    const log = applyChoice(next, currentEvent, choiceId);
    const newTraits = checkNewTraits(next, PERSONALITY_TRAITS);
    const ending = checkEnding(next, ENDINGS);
    const followUpEvent = ending
      ? null
      : pickNextEvent(next, ALL_EVENTS.filter((e) => e.id !== currentEvent.id));
    saveGame(next);
    set((prev) => ({
      state: next,
      currentEvent: followUpEvent,
      ending,
      log: [...describeNewTraits(newTraits), ...log, ...prev.log].slice(0, 30),
    }));
  },

  advance: () => {
    const { state } = get();
    if (!state) return;
    const next = cloneState(state);
    const result = advanceTurn(next, { events: ALL_EVENTS, careerTracks: CAREER_TRACKS });
    const newTraits = checkNewTraits(result.state, PERSONALITY_TRAITS);
    const ending = checkEnding(result.state, ENDINGS);
    saveGame(result.state);
    set((prev) => ({
      state: result.state,
      currentEvent: ending ? null : result.nextEvent,
      ending,
      log: [...describeNewTraits(newTraits), ...result.log, ...prev.log].slice(0, 30),
    }));
  },

  continueSavedGame: () => {
    const saved = loadGame();
    if (!saved) return;
    const ending = checkEnding(saved, ENDINGS);
    const nextEvent = ending ? null : pickNextEvent(saved, ALL_EVENTS);
    set({ state: saved, currentEvent: nextEvent, ending, log: [], hasExistingSave: true });
  },

  resetGame: () => {
    clearSave();
    set({ state: null, currentEvent: null, ending: null, log: [], hasExistingSave: false });
  },
}));
