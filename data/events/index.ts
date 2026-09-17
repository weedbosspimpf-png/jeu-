import type { GameEvent } from "@/engine/types";
import { earlyLifeEvents } from "./earlyLife";
import { economyEvents } from "./economy";
import { careerEvents } from "./career";
import { relationshipEvents } from "./relationships";
import { endgameEvents } from "./endgame";
import { armyTrainingEvents } from "./armyTraining";
import { armyCareerEvents } from "./armyCareer";
import { policeMoralEvents } from "./policeMoral";
import { policeCareerEvents } from "./policeCareer";
import { gendarmerieTrainingEvents } from "./gendarmerieTraining";
import { gendarmerieCareerEvents } from "./gendarmerieCareer";
import { crimeMissionEvents } from "./crimeMissions";
import { crimeCareerEvents } from "./crimeCareer";
import { entrepreneurCareerEvents } from "./entrepreneurCareer";
import { civilCareerEvents } from "./civilCareer";
import { politicsCareerEvents } from "./politicsCareer";
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
  ...policeCareerEvents,
  ...gendarmerieTrainingEvents,
  ...gendarmerieCareerEvents,
  ...crimeMissionEvents,
  ...crimeCareerEvents,
  ...entrepreneurCareerEvents,
  ...civilCareerEvents,
  ...politicsCareerEvents,
  ...memoryEvents,
];
