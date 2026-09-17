import type { GameEvent } from "@/engine/types";

interface EventCardProps {
  event: GameEvent;
  onChoose: (choiceId: string) => void;
}

export function EventCard({ event, onChoose }: EventCardProps) {
  return (
    <section className="panel event-card">
      <span className="event-category">{event.category}</span>
      <h2>{event.title}</h2>
      <p>{event.description}</p>
      <div className="choice-list">
        {event.choices.map((choice) => (
          <button key={choice.id} className="choice-button" onClick={() => onChoose(choice.id)}>
            {choice.label}
          </button>
        ))}
      </div>
    </section>
  );
}
