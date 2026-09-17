# Destin — prototype

Jeu de simulation narrative et strategique. Le joueur commence a 18 ans dans un pays
fictif (Verdania) et construit sa propre trajectoire de vie a travers des decisions
qui ont des consequences immediates, differees et parfois cachees.

## Demarrer

```bash
npm install
npm run dev
```

L'application demarre sur [http://localhost:3000](http://localhost:3000).

## Architecture

- `engine/` — moteur de simulation pur (TypeScript, sans dependance UI) :
  gestion de l'etat de jeu, effets, monde, carrieres, evenements, sauvegarde.
- `data/` — contenu declaratif (statistiques, origines, carrieres, evenements,
  PNJ). Ajouter un evenement ou une carriere ne necessite aucune modification
  du moteur.
- `store/` — pont entre le moteur et React (Zustand).
- `components/` et `app/` — interface Next.js (App Router).

Voir la discussion d'architecture dans l'historique du projet pour le detail
de la communication entre les differents systemes (etat central `GameState`,
effets declaratifs serialisables, moteur d'evenements generique, promotions
de carriere conditionnelles, monde qui evolue independamment du joueur).

## Etat du prototype (Phase 1)

- Creation de personnage a 18 ans avec choix d'orientation initiale (civil,
  armee, police, gendarmerie, entrepreneuriat, trajectoire criminelle fictive).
- 13 statistiques evolutives.
- Systeme de decisions avec consequences immediates, differees et cachees.
- Progression de carriere conditionnelle sur 7 filieres (dont acces a la
  politique une fois l'influence suffisante).
- Systeme de relations simple (confiance, loyaute, influence, statut).
- Monde fictif qui evolue tour par tour, avec evenements declenches par son
  etat (crise economique, manifestations, etc.).
- Sauvegarde locale automatique (localStorage).

Ce prototype est concu pour etre etendu progressivement : nouveaux metiers,
evenements, personnages et mecaniques s'ajoutent via `data/`, sans toucher a
`engine/`.
