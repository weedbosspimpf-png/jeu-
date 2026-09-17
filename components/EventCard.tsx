import type { GameEvent, GameState } from "@/engine/types";
import { getAvailableChoices } from "@/engine/events";

interface EventCardProps {
  event: GameEvent;
  state: GameState;
  onChoose: (choiceId: string) => void;
}

export function EventCard({ event, state, onChoose }: EventCardProps) {
  const choices = getAvailableChoices(state, event);
  return (
    <section className="panel event-card">
      <span className="event-category">{event.category}</span>
      <h2>{event.title}</h2>
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
