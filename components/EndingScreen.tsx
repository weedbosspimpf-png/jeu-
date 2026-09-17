import type { Ending, GameState } from "@/engine/types";

interface EndingScreenProps {
  ending: Ending;
  state: GameState;
  onRestart: () => void;
}

export function EndingScreen({ ending, state, onRestart }: EndingScreenProps) {
  return (
    <div className="new-game-screen">
      <span className={`ending-badge ending-${ending.category}`}>{ending.category}</span>
      <h1>{ending.title}</h1>
      <p>{ending.epilogue(state)}</p>

      <section className="panel">
        <h2>Bilan de la vie de {state.character.name}</h2>
        <ul className="history-list">
          <li>Age atteint : {state.character.age} ans</li>
          <li>Fortune finale : {state.character.money.toLocaleString("fr-FR")} credits</li>
          <li>Reputation : {state.character.stats.reputation}/100</li>
          <li>Influence : {state.character.stats.influence}/100</li>
          <li>Carriere : {state.career.currentTrack ?? "aucune"} ({state.career.currentRankId ?? "-"})</li>
          <li>Relations construites : {Object.keys(state.relationships).length}</li>
        </ul>
      </section>

      <button className="choice-button primary" onClick={onRestart}>
        Commencer une nouvelle vie
      </button>
    </div>
  );
}
