import type { GameState } from "@/engine/types";
import { describeArchetype } from "@/data/personality";
import { PERSONALITY_TRAITS } from "@/data/personalityTraits";

export function PersonalityPanel({ state }: { state: GameState }) {
  const unlocked = PERSONALITY_TRAITS.filter((trait) => state.unlockedTraits.includes(trait.id));

  return (
    <section className="panel">
      <h2>Personnalite</h2>
      <p className="muted small">
        Profil emergent, deduit de tes choix : ni bon ni mauvais, juste une facon de penser et d&apos;agir.
      </p>
      <p className="career-rank">{describeArchetype(state)}</p>

      {unlocked.length > 0 ? (
        <>
          <h3 className="muted small">Particularites developpees</h3>
          <ul className="history-list">
            {unlocked.map((trait) => (
              <li key={trait.id}>
                {trait.icon} <strong>{trait.label}</strong> &mdash; {trait.description}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="muted small">
          Aucune particularite marquante ne s&apos;est encore degagee de ton parcours.
        </p>
      )}
    </section>
  );
}
