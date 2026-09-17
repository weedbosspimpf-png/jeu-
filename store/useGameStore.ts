"use client";

import { create } from "zustand";
import type { GameEvent, GameState } from "@/engine/types";
import { createNewGame } from "@/engine/createNewGame";
import { advanceTurn } from "@/engine/simulation";
import { applyChoice, pickNextEvent } from "@/engine/events";
import { saveGame, loadGame, clearSave, hasSave } from "@/engine/save";
import { BASE_STATS } from "@/data/stats";
import { getOrigin } from "@/data/origins";
import { ALL_EVENTS } from "@/data/events";
import { CAREER_TRACKS } from "@/data/careers";

interface GameStore {
  state: GameState | null;
  currentEvent: GameEvent | null;
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
    set({ state: newState, currentEvent: firstEvent, log: [], hasExistingSave: true });
  },

  chooseOption: (choiceId) => {
    const { state, currentEvent } = get();
    if (!state || !currentEvent) return;
    const next = cloneState(state);
    const log = applyChoice(next, currentEvent, choiceId);
    const followUpEvent = pickNextEvent(next, ALL_EVENTS.filter((e) => e.id !== currentEvent.id));
    saveGame(next);
    set((prev) => ({
      state: next,
      currentEvent: followUpEvent,
      log: [...log, ...prev.log].slice(0, 30),
    }));
  },

  advance: () => {
    const { state } = get();
    if (!state) return;
    const next = cloneState(state);
    const result = advanceTurn(next, { events: ALL_EVENTS, careerTracks: CAREER_TRACKS });
    saveGame(result.state);
    set((prev) => ({
      state: result.state,
      currentEvent: result.nextEvent,
      log: [...result.log, ...prev.log].slice(0, 30),
    }));
  },

  continueSavedGame: () => {
    const saved = loadGame();
    if (!saved) return;
    const nextEvent = pickNextEvent(saved, ALL_EVENTS);
    set({ state: saved, currentEvent: nextEvent, log: [], hasExistingSave: true });
  },

  resetGame: () => {
    clearSave();
    set({ state: null, currentEvent: null, log: [], hasExistingSave: false });
  },
}));
