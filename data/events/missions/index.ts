import type { GameEvent } from "@/engine/types";
import { armyMissionEvents } from "./army";
import { policeMissionEvents } from "./police";
import { gendarmerieMissionEvents } from "./gendarmerie";
import { crimeMissionEventsExtra } from "./crime";
import { entrepreneurMissionEvents } from "./entrepreneur";
import { politicsMissionEvents } from "./politics";
import { presidencyMissionEvents } from "./presidency";

/**
 * Chaque mission n'est qu'une chaine de GameEvent (meme moteur, memes
 * effets, memes flags) habillee de metadonnees `mission` pour un
 * affichage immersif. Ajouter une mission = ajouter une entree ici,
 * jamais modifier engine/.
 */
export const MISSION_EVENTS: GameEvent[] = [
  ...armyMissionEvents,
  ...policeMissionEvents,
  ...gendarmerieMissionEvents,
  ...crimeMissionEventsExtra,
  ...entrepreneurMissionEvents,
  ...politicsMissionEvents,
  ...presidencyMissionEvents,
];
