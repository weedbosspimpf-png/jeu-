"use client";

import type { GameState, GameEvent } from "@/engine/types";
import { CharacterSheet } from "./CharacterSheet";
import { WorldPanel } from "./WorldPanel";
import { CareerPanel } from "./CareerPanel";
import { RelationshipsPanel } from "./RelationshipsPanel";
import { EventCard } from "./EventCard";
import { HistoryLog } from "./HistoryLog";
import { ComparisonPanel } from "./ComparisonPanel";
import { AmbitionPanel } from "./AmbitionPanel";
import { PersonalityPanel } from "./PersonalityPanel";
import { ReputationPanel } from "./ReputationPanel";
import { FinancesPanel } from "./FinancesPanel";
import { useGameStore } from "@/store/useGameStore";

interface GameScreenProps {
  state: GameState;
  currentEvent: GameEvent | null;
  log: string[];
}

export function GameScreen({ state, currentEvent, log }: GameScreenProps) {
  const chooseOption = useGameStore((s) => s.chooseOption);
  const advance = useGameStore((s) => s.advance);
  const resetGame = useGameStore((s) => s.resetGame);

  return (
    <div className="game-screen">
      <header className="game-header">
        <h1>Destin &mdash; An {state.turn}</h1>
        <button className="link-button" onClick={resetGame}>
          Recommencer
        </button>
      </header>

      <div className="game-grid">
        <div className="column">
          <CharacterSheet state={state} />
          <CareerPanel state={state} />
          <FinancesPanel state={state} />
          <ReputationPanel state={state} />
          <AmbitionPanel state={state} />
          <PersonalityPanel state={state} />
        </div>

        <div className="column column-main">
          {currentEvent ? (
            <EventCard event={currentEvent} state={state} onChoose={chooseOption} />
          ) : (
            <section className="panel event-card">
              <h2>Rien de particulier pour l'instant</h2>
              <p>La vie suit son cours. Avance a l'annee suivante pour voir ce qui se presente.</p>
              <button className="choice-button primary" onClick={advance}>
                Avancer d&apos;une annee
              </button>
            </section>
          )}
          <ComparisonPanel state={state} />
          <HistoryLog log={log} />
        </div>

        <div className="column">
          <WorldPanel state={state} />
          <RelationshipsPanel state={state} />
        </div>
      </div>
    </div>
  );
}
