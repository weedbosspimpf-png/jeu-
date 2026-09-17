"use client";

import { useState } from "react";
import { ORIGINS } from "@/data/origins";
import { useGameStore } from "@/store/useGameStore";

export function NewGameScreen() {
  const [name, setName] = useState("");
  const [originId, setOriginId] = useState(ORIGINS[0]?.id ?? "civil");
  const startNewGame = useGameStore((s) => s.startNewGame);
  const hasExistingSave = useGameStore((s) => s.hasExistingSave);
  const continueSavedGame = useGameStore((s) => s.continueSavedGame);

  return (
    <div className="new-game-screen">
      <h1>Destin</h1>
      <p className="muted">
        A 18 ans, ta vie commence. Chaque decision compte, chaque trajectoire reste ouverte.
      </p>

      {hasExistingSave && (
        <button className="choice-button" onClick={continueSavedGame}>
          Reprendre ma partie
        </button>
      )}

      <div className="panel">
        <label className="field">
          <span>Nom du personnage</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ton nom"
            maxLength={30}
          />
        </label>

        <fieldset className="origin-choices">
          <legend>Point de depart</legend>
          {ORIGINS.map((origin) => (
            <label key={origin.id} className={`origin-option ${originId === origin.id ? "selected" : ""}`}>
              <input
                type="radio"
                name="origin"
                value={origin.id}
                checked={originId === origin.id}
                onChange={() => setOriginId(origin.id)}
              />
              <div>
                <strong>{origin.label}</strong>
                <p className="muted small">{origin.description}</p>
              </div>
            </label>
          ))}
        </fieldset>

        <button
          className="choice-button primary"
          disabled={name.trim().length === 0}
          onClick={() => startNewGame(name.trim(), originId)}
        >
          Commencer ma vie
        </button>
      </div>
    </div>
  );
}
