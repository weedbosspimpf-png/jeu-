# Destin — contexte du projet pour Claude

Ce fichier existe pour qu'une nouvelle session Claude (dans un nouvel espace,
sur une autre machine, apres un reset de contexte) retrouve immediatement
tout ce qu'il faut savoir sans que l'utilisateur ait a tout reexpliquer.
Lis-le en entier avant de commencer a travailler sur ce depot.

## Ce projet en une phrase

Un jeu video de simulation narrative et strategique : le joueur commence
civil a 18 ans dans un pays fictif (Verdania) et construit sa propre
trajectoire de vie (civile, militaire, policiere, entrepreneuriale ou
criminelle fictive) a travers des decisions qui ont des consequences
immediates, differees et parfois cachees.

## Origine et independance du projet

Ce depot (`weedbosspimpf-png/jeu-`) est **totalement independant** du
projet "Etoile Athlete" (`weedbosspimpf-png/-toile-athl-te-`), une
plateforme de mise en relation de talents sportifs sans rapport avec ce
jeu. Les deux ont ete developpes dans la meme session Claude a l'origine,
d'ou un possible melange historique cote interface Claude.ai, mais le
code n'a jamais ete mele : ce sont deux depots Git separes depuis le
debut. Ne jamais copier de code ou de dependances entre les deux projets.

## Vision complete demandee par l'utilisateur

L'utilisateur a fourni un cahier des charges detaille en plusieurs temps.
Resume fidele (a consulter si un doute survient sur l'intention) :

### Concept central
- Pas d'histoire lineaire : le joueur construit sa trajectoire par ses
  choix. Chaque decision peut modifier stats, relations, reputation,
  argent, influence, carriere, situation du pays, evenements futurs.
- Trajectoires possibles et **qui peuvent se croiser/changer en cours de
  partie** : civil, militaire, policier, gendarme, entrepreneur,
  trajectoire criminelle fictive. Exemples de parcours complets :
  - Civil -> entrepreneur -> homme politique -> president.
  - Armee -> officier -> commandant -> general -> politique -> president.
  - Police -> enqueteur -> haut responsable -> politique.
  - Criminalite fictive -> membre -> lieutenant -> chef de reseau ->
    influence politique OU retour a la vie legale.

### Personnage
13 statistiques minimum : intelligence, force, discipline, courage,
ambition, leadership, loyaute, diplomatie, charisme, integrite, richesse,
reputation, influence. Toutes evoluent selon les actions.

### Systeme de choix
Chaque evenement propose plusieurs reponses. Chaque reponse peut avoir des
consequences immediates, differees (plusieurs annees plus tard) et
cachees. Le joueur ne doit jamais voir une option presentee comme
"objectivement la meilleure" moralement.

### Relations
Chaque PNJ a une relation avec le joueur : confiance, loyaute, influence,
memoire des actions passees. Statuts possibles : ami, rival, allie,
ennemi, superieur, subordonne, partenaire.

### Carrieres — gameplay specifique par filiere (pas de simple arbre statique)
- **Armee** : epreuves de formation notees (endurance, discipline,
  leadership, strategie, esprit d'equipe, gestion du stress, decision).
  Une mauvaise note ferme des possibilites sans finir la partie.
- **Police** : plusieurs trajectoires possibles (integre, opportuniste,
  corrompu, enqueteur, commandement, evolution politique). Evenements a
  choix multiples (accepter/refuser/signaler/negocier) sans hierarchie
  morale imposee : chaque choix a des couts ET des benefices.
- **Gendarmerie** : meme logique que police/armee, evenements propres.
- **Criminalite fictive** : progression Membre -> Executant -> Lieutenant
  -> Chef de secteur -> Chef de reseau -> Figure influente. Missions
  testant loyaute/courage/intelligence/negociation/influence/gestion de
  conflit. Choix : obeir, refuser, negocier, trahir, quitter, devenir
  independant. **Toujours fictif et abstrait, jamais de methode
  operationnelle reelle.**
- **Interconnexion** : les filieres ne sont pas isolees, les PNJ et
  evenements passes doivent pouvoir revenir influencer d'autres filieres.

### Systeme de memoire
Une decision prise tot (ex: refuser un superieur a 20 ans) doit pouvoir
revenir des annees plus tard (ce superieur redevient rival puis peut
redevenir allie a 40 ans).

### Systeme de comparaison
Afficher au joueur les caracteristiques de son parcours (revenu,
stabilite, influence, reputation, risque, potentiel de promotion,
relations, competences) **sans jamais dire quelle carriere est
objectivement la meilleure**.

### Monde
Pays fictif qui evolue independamment du joueur : economie, securite,
stabilite, population, chomage, corruption, popularite du gouvernement,
relations exterieures, tension sociale, puissance militaire.

### Systeme politique
Accessible depuis n'importe quelle trajectoire une fois assez d'influence.
Parcours : militant, responsable local, elu, ministre, chef de parti,
candidat, president, opposition, retraite politique. Les scenarios de
crise/prise de pouvoir restent des mecaniques fictives et narratives,
jamais des procedures operationnelles reelles.

### Fins de partie
Pas de fin unique : reussite, echec, changement de carriere, retraite,
perte de pouvoir, mort, devenir une personnalite importante, devenir
president, laisser un heritage.

### Contrainte d'architecture explicitement demandee
Separer clairement : moteur de simulation / donnees / evenements /
carrieres / personnages / relations / economie / politique / interface
graphique. Objectif : pouvoir ajouter metiers, evenements, personnages,
carrieres et mecaniques **sans reecrire le moteur principal**.

## Architecture implementee (respecte la contrainte ci-dessus)

```
engine/     moteur pur TypeScript, aucune dependance UI, entierement testable
  types.ts          types partages (GameState, Effect, GameEvent, CareerTrack, Ending...)
  effects.ts        applyEffect/applyEffects : seul endroit qui mute le GameState
  world.ts          evolution du pays independante du joueur (worldTick)
  careers.ts        progression de carriere generique (careerTick, getCurrentRank)
  events.ts         moteur d'evenements generique (condition -> choix -> consequences,
                     effets differes via pendingEffects)
  endings.ts        moteur de fins de partie generique (checkEnding)
  simulation.ts      orchestrateur d'un tour (advanceTurn = 1 an)
  createNewGame.ts   assemble un GameState initial a partir des donnees d'origine
  save.ts            serialisation localStorage (GameState est 100% JSON-serialisable,
                      AUCUNE fonction n'est jamais stockee dans le state)
  utils.ts           clamp, id, random, pickWeighted

data/       contenu declaratif. Ajouter du contenu ici NE TOUCHE JAMAIS engine/
  stats.ts              labels + stats de depart
  origins.ts             5 origines de personnage (civil, army, police, entrepreneur, crime)
  world.ts                labels des variables du monde
  endings.ts               liste des fins de partie (Ending[])
  careers/                 un fichier par filiere (civil, army, police, gendarmerie,
                            entrepreneur, crime, politics), + index.ts qui les agrege
  events/                  un fichier par theme, + index.ts qui les agrege :
    earlyLife.ts            evenements des premieres annees
    economy.ts               evenements lies au monde (crise, manifestations...)
    career.ts                evenements de carriere generiques (dont acces a la politique)
    relationships.ts         evenements de relation (mentor, rival)
    endgame.ts                declencheurs de fins (retraite, enquete policiere...)
    armyTraining.ts           les 7 epreuves militaires + affectation finale
    policeMoral.ts             dilemmes moraux police/gendarmerie
    gendarmerieTraining.ts     evenements propres a la gendarmerie
    crimeMissions.ts           chaine de missions criminelles fictives
    memory.ts                  evenements de rappel (systeme de memoire)

store/useGameStore.ts   PONT entre le moteur et React (Zustand). Aucune regle de jeu
                        ici, seulement : appeler le moteur, cloner l'etat, sauvegarder,
                        detecter une fin de partie.

components/ + app/      UI Next.js (App Router), theme sombre. Ne contient aucune
                        regle de jeu, seulement de l'affichage + dispatch d'actions.
```

### Principe cle a ne jamais casser

`GameState` doit rester **entierement serialisable en JSON** (verifie par
`JSON.parse(JSON.stringify(state))` utilise pour cloner l'etat et pour la
sauvegarde). C'est pour ca que les effets (`Effect`) sont des objets
declaratifs (`{ type: "stat", stat: "courage", delta: 5 }`) et jamais des
fonctions stockees dans l'etat. Seules les *definitions* d'evenements,
de carrieres et de fins de partie (dans `data/`) contiennent des fonctions
(`condition`, `requirements`, `epilogue`) — elles ne sont jamais
serialisees, seulement evaluees a la volee sur le `GameState` courant.

Ajouter un nouvel evenement, une nouvelle carriere ou une nouvelle fin =
ajouter une entree dans `data/`, jamais modifier `engine/`.

## Etat d'avancement actuel

Fait :
- Prototype jouable complet (creation de personnage a 18 ans, choix
  d'orientation, sauvegarde locale).
- 13 statistiques, 5 origines de depart, 7 filieres de carriere.
- Moteur d'evenements generique avec effets immediats/differes/caches.
- Gameplay specifique pour armee (epreuves notees), police/gendarmerie
  (dilemmes moraux), criminalite (chaine de missions + progression
  Membre -> Figure influente).
- Systeme de memoire (au moins 3 evenements de rappel : ancien superieur,
  ancien contact criminel, mentor).
- Systeme de fins de partie (7 fins : arrestation, president, chute du
  pouvoir, effondrement, retraite, heritage, mort naturelle).
- Panneau de comparaison de parcours sans hierarchie morale/objective.
- Build Next.js et typecheck TypeScript verifies fonctionnels.

Pas encore fait / limites connues :
- Pas de tests automatises du moteur (aucun framework de test installe).
- Les trajectoires morales de la police restent pilotees par des
  stats/flags plutot que par des arbres de rang distincts nommes
  "integre/opportuniste/corrompu".
- L'interconnexion entre filieres est encore limitee a quelques cas
  precis (pas de generation generique de rencontres entre PNJ de
  branches differentes).
- La filiere "vie civile" et "entrepreneuriat" restent moins etoffees
  que armee/police/crime.
- Pas encore de systeme de scenarios politiques de crise avances
  (le rang "president" existe mais peu d'evenements specifiques a la
  presidence elle-meme).
- `npm audit` signale des CVE Next.js plus larges qui ne se corrigent
  qu'en passant a Next 16 (breaking change) : pas fait, a decider avec
  l'utilisateur si ca devient pertinent (deploiement public notamment).

## Demarrer

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de production
npm run typecheck
```

## Conventions de code a respecter en continuant

- Commentaires rares, uniquement quand le "pourquoi" n'est pas evident.
- Pas d'abstraction speculative : ajouter ce qui est demande, pas plus.
- Toute nouvelle mecanique de jeu passe par `data/`, jamais par une
  modification d'`engine/` sauf si un nouveau *type* d'effet ou de
  concept generique est reellement necessaire (comme `relationshipInit`
  ajoute pour nommer un PNJ superieur hierarchique la premiere fois
  qu'il apparait).
- Toujours verifier `npx tsc --noEmit` et `npm run build` avant de
  commit/push.
