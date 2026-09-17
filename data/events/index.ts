import type { GameEvent } from "@/engine/types";
import { earlyLifeEvents } from "./earlyLife";
import { economyEvents } from "./economy";
import { careerEvents } from "./career";
import { relationshipEvents } from "./relationships";
import { endgameEvents } from "./endgame";
import { armyTrainingEvents } from "./armyTraining";
import { armyCareerEvents } from "./armyCareer";
import { policeMoralEvents } from "./policeMoral";
import { gendarmerieTrainingEvents } from "./gendarmerieTraining";
import { crimeMissionEvents } from "./crimeMissions";
import { memoryEvents } from "./memory";

export const ALL_EVENTS: GameEvent[] = [
  ...earlyLifeEvents,
  ...economyEvents,
  ...careerEvents,
  ...relationshipEvents,
  ...endgameEvents,
  ...armyTrainingEvents,
  ...armyCareerEvents,
  ...policeMoralEvents,
  ...gendarmerieTrainingEvents,
  ...crimeMissionEvents,
  ...memoryEvents,
];
