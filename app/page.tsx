"use client";

import { NewGameScreen } from "@/components/NewGameScreen";
import { GameScreen } from "@/components/GameScreen";
import { useGameStore } from "@/store/useGameStore";

export default function HomePage() {
  const state = useGameStore((s) => s.state);
  const currentEvent = useGameStore((s) => s.currentEvent);
  const log = useGameStore((s) => s.log);

  if (!state) return <NewGameScreen />;

  return <GameScreen state={state} currentEvent={currentEvent} log={log} />;
}
