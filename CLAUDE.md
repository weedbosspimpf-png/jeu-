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

### Principe narratif approfondi (ajoute apres le prototype initial)
Le joueur ne choisit pas seulement une carriere : il construit
*progressivement quel genre de personne il devient a l'interieur de cette
carriere*. Un meme metier (ex: l'armee) doit pouvoir produire des
trajectoires totalement differentes selon les choix faits a chaque grade.

- **Profil multi-dimensionnel** : en plus des 13 stats d'origine, 6
  dimensions supplementaires existent (`opportunism`, `empathy`,
  `authority`, `greed`, `popularity`, `publicTrust`, voir
  `data/stats.ts`). Aucune combinaison n'est presentee comme "la bonne" :
  un personnage peut etre loyal ET corrompu, integre ET tres ambitieux.
- **Choix contextuels par grade** : les evenements de carriere lisent
  `state.career.currentRankId` pour proposer des dilemmes adaptes au
  niveau de responsabilite (recrue = camaraderie/discipline, officier =
  commandement/corruption ponctuelle, colonel/commandant = ressources et
  reseaux d'influence, general = relations avec le president et crises
  politiques majeures). Voir `data/events/armyCareer.ts` pour le modele
  de reference (filiere armee), a repliquer pour police/gendarmerie/
  crime/entrepreneuriat/politique/vie civile.
- **Gouvernement vivant** : `WorldState` porte desormais un `regime`
  (type institutionnel : democratie stable/fragile, autoritaire,
  repressif, transition, instable — jamais qualifie de bon/mauvais) et un
  `president` avec sa propre personnalite (`traits` : integrite,
  autorite, popularite, ambition, corruption, respect des institutions),
  independante de la relation que le joueur entretient avec lui. Les deux
  evoluent dans `engine/world.ts::worldTick` (derive + eventuelle election
  qui remplace le president en regime democratique, sans que la relation
  du joueur avec l'ancien president ne se transfere).
- **Relation joueur/president** : modelisee comme une `relationship`
  ordinaire (`npcId: "president"`), synchronisee sur le president actuel
  via l'effet `relationshipSyncPresident` (declenche a la promotion
  General). Elle peut donc changer completement d'un president a l'autre,
  comme demande ("un general peut etre loyal a un president et avoir une
  relation completement differente avec son successeur").
- **Nouveaux effets generiques ajoutes a engine/** (parce qu'ils
  representaient un vrai nouveau concept, pas juste du contenu) :
  `presidentTrait`, `regimeShift`, `relationshipSyncPresident`.

Prochaine etape prevue (voir aussi limites connues) : repliquer la meme
profondeur (choix contextuels par grade/reputation/corruption, boucle
recrutement -> epreuves -> missions -> dilemmes -> promotions) pour
police, gendarmerie, criminalite fictive, entrepreneuriat, politique et
vie civile, en s'appuyant sur `armyCareer.ts` comme gabarit.

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
    armyCareer.ts              boucle de carriere par grade (corruption,
                               opportunisme, empathie, lien avec le
                               president, crise politique) - gabarit a
                               repliquer pour les autres filieres
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
- 19 statistiques (13 initiales + 6 dimensions de profil : opportunisme,
  empathie, autorite, cupidite, popularite, confiance des autres),
  5 origines de depart, 7 filieres de carriere.
- Moteur d'evenements generique avec effets immediats/differes/caches.
- Gameplay specifique pour armee : epreuves de formation notees, PUIS
  boucle de carriere par grade (`armyCareer.ts`) avec dilemmes de
  corruption/opportunisme/integrite/empathie distincts a chaque niveau
  (recrue -> officier -> commandant/colonel -> general), relation avec
  un president qui a sa propre personnalite et peut changer par election,
  et un premier evenement de crise politique au grade de general.
- Gameplay specifique pour police/gendarmerie (dilemmes moraux),
  criminalite (chaine de missions + progression Membre -> Figure
  influente).
- Monde avec regime institutionnel (`WorldState.regime`) et president
  fictif (`WorldState.president`) qui evoluent independamment du joueur,
  y compris des elections qui remplacent le president en regime
  democratique.
- Systeme de memoire (evenements de rappel : ancien superieur police,
  ancien contact criminel, mentor, + 2 nouveaux specifiques a l'armee :
  echo de l'affaire de detournement, retour de l'ancien camarade Sory).
- Systeme de fins de partie (7 fins : arrestation, president, chute du
  pouvoir, effondrement, retraite, heritage, mort naturelle).
- Panneau de comparaison de parcours sans hierarchie morale/objective.
- Build Next.js et typecheck TypeScript verifies fonctionnels.

Pas encore fait / limites connues :
- Pas de tests automatises du moteur (aucun framework de test installe).
- La meme profondeur de carriere par grade (boucle recrutement ->
  epreuves -> dilemmes contextuels -> promotions, cf. `armyCareer.ts`)
  n'existe encore que pour l'armee. Police/gendarmerie/crime restent
  pilotes par des stats/flags plus simples, sans arbres de rang nommes
  "integre/opportuniste/corrompu" ni gabarit par grade repris de l'armee.
- L'interconnexion entre filieres est encore limitee a quelques cas
  precis (pas de generation generique de rencontres entre PNJ de
  branches differentes).
- La filiere "vie civile" et "entrepreneuriat" restent moins etoffees
  que armee/police/crime.
- Le pays fictif (Republique de Verdania) n'a encore ni capitale, ni
  villes/regions, ni partis politiques, ni medias fictifs nommes : seul
  le regime institutionnel et le president sont modelises pour l'instant.
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
