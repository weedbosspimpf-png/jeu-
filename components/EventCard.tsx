import type { GameEvent, GameState } from "@/engine/types";
import { getAvailableChoices } from "@/engine/events";
import { SceneIllustration } from "./SceneIllustration";

interface EventCardProps {
  event: GameEvent;
  state: GameState;
  onChoose: (choiceId: string) => void;
}

const PHASE_LABELS: Record<string, string> = {
  briefing: "Mission",
  action: "Mission en cours",
  resolution: "Mission terminee",
};

export function EventCard({ event, state, onChoose }: EventCardProps) {
  const choices = getAvailableChoices(state, event);
  const mission = event.mission;

  return (
    <section className={`panel event-card ${mission ? "mission-card" : ""}`}>
      {event.scene && <SceneIllustration sceneKey={event.scene} />}
      {mission ? (
        <>
          <span className="event-category">{PHASE_LABELS[mission.phase]}</span>
          <h2>{mission.title}</h2>
          <p className="muted small">
            <strong>Objectif :</strong> {mission.objective}
          </p>
          {mission.phase === "briefing" && (
            <>
              <p className="muted small">
                Difficulte :{" "}
                <span className={`difficulty-badge difficulty-${mission.difficulty}`}>{mission.difficulty}</span>
              </p>
              {(mission.rewardsPreview || mission.risksPreview) && (
                <ul className="mission-preview-list">
                  {mission.rewardsPreview?.map((r) => (
                    <li key={r} className="tone-positive">
                      + {r}
                    </li>
                  ))}
                  {mission.risksPreview?.map((r) => (
                    <li key={r} className="tone-warning">
                      ⚠ {r}
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
          <hr className="mission-divider" />
          <h3>{event.title}</h3>
        </>
      ) : (
        <>
          <span className="event-category">{event.category}</span>
          <h2>{event.title}</h2>
        </>
      )}
      <p>{event.description}</p>
      <div className="choice-list">
        {choices.map((choice) => (
          <button key={choice.id} className="choice-button" onClick={() => onChoose(choice.id)}>
            {choice.label}
          </button>
        ))}
      </div>
    </section>
  );
}
