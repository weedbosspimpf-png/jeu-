"use client";

import { useState } from "react";
import type { GameState, GameEvent } from "@/engine/types";
import { IdentityStrip } from "./IdentityStrip";
import { EventCard } from "./EventCard";
import { ConsequencesPanel } from "./ConsequencesPanel";
import { HistoryLog } from "./HistoryLog";
import { WorldPanel } from "./WorldPanel";
import { OverviewTab } from "./tabs/OverviewTab";
import { CareerTab } from "./tabs/CareerTab";
import { PersonalityTab } from "./tabs/PersonalityTab";
import { FinancesTab } from "./tabs/FinancesTab";
import { RelationsTab } from "./tabs/RelationsTab";
import { PoliticsTab } from "./tabs/PoliticsTab";
import { HistoryTab } from "./tabs/HistoryTab";
import { useGameStore } from "@/store/useGameStore";

type TabId = "apercu" | "carriere" | "personnalite" | "finances" | "relations" | "politique" | "historique";

interface GameScreenProps {
  state: GameState;
  currentEvent: GameEvent | null;
  log: string[];
}

export function GameScreen({ state, currentEvent, log }: GameScreenProps) {
  const chooseOption = useGameStore((s) => s.chooseOption);
  const advance = useGameStore((s) => s.advance);
  const resetGame = useGameStore((s) => s.resetGame);
  const lastConsequences = useGameStore((s) => s.lastConsequences);
  const [tab, setTab] = useState<TabId>("apercu");

  const showPolitics = state.career.currentTrack === "politics" || state.career.currentRankId === "president";

  const tabs: { id: TabId; label: string }[] = [
    { id: "apercu", label: "Apercu" },
    { id: "carriere", label: "Carriere" },
    { id: "personnalite", label: "Personnalite" },
    { id: "finances", label: "Finances" },
    { id: "relations", label: "Relations" },
    ...(showPolitics ? [{ id: "politique" as const, label: "Politique" }] : []),
    { id: "historique", label: "Historique" },
  ];

  return (
    <div className="game-screen">
      <header className="game-header">
        <h1>Destin &mdash; An {state.turn}</h1>
        <button className="link-button" onClick={resetGame}>
          Recommencer
        </button>
      </header>

      <IdentityStrip state={state} />

      <div className="game-main">
        {currentEvent ? (
          <EventCard event={currentEvent} state={state} onChoose={chooseOption} />
        ) : (
          <section className="panel event-card">
            <h2>Rien de particulier pour l&apos;instant</h2>
            <p>La vie suit son cours. Avance a l&apos;annee suivante pour voir ce qui se presente.</p>
            <button className="choice-button primary" onClick={advance}>
              Avancer d&apos;une annee
            </button>
          </section>
        )}
        <ConsequencesPanel consequences={lastConsequences} />
        <HistoryLog log={log} />
      </div>

      <nav className="tab-nav">
        {tabs.map((t) => (
          <button
            key={t.id}
            className={`tab-button ${tab === t.id ? "active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <div className="tab-content">
        {tab === "apercu" && (
          <>
            <OverviewTab state={state} />
            <WorldPanel state={state} />
          </>
        )}
        {tab === "carriere" && <CareerTab state={state} />}
        {tab === "personnalite" && <PersonalityTab state={state} />}
        {tab === "finances" && <FinancesTab state={state} />}
        {tab === "relations" && <RelationsTab state={state} />}
        {tab === "politique" && showPolitics && <PoliticsTab state={state} />}
        {tab === "historique" && <HistoryTab state={state} />}
      </div>
    </div>
  );
}
