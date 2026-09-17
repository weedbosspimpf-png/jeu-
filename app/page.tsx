"use client";

import { NewGameScreen } from "@/components/NewGameScreen";
import { GameScreen } from "@/components/GameScreen";
import { EndingScreen } from "@/components/EndingScreen";
import { useGameStore } from "@/store/useGameStore";

export default function HomePage() {
  const state = useGameStore((s) => s.state);
  const currentEvent = useGameStore((s) => s.currentEvent);
  const ending = useGameStore((s) => s.ending);
  const log = useGameStore((s) => s.log);
  const resetGame = useGameStore((s) => s.resetGame);

  if (!state) return <NewGameScreen />;
  if (ending) return <EndingScreen ending={ending} state={state} onRestart={resetGame} />;

  return <GameScreen state={state} currentEvent={currentEvent} log={log} />;
}
