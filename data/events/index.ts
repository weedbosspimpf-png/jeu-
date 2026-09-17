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
import { ambitionTransitionEvents } from "./ambitionTransitions";
import { powerAccessionEvents } from "./powerAccession";
import { presidencyGovernanceEvents } from "./presidencyGovernance";
import { personalityMomentEvents } from "./personalityMoments";
import { careerDisciplineEvents } from "./careerDiscipline";
import { socialActionEvents } from "./socialActions";
import { personalFinanceEvents } from "./personalFinance";
import { leadershipManagementEvents } from "./leadershipManagement";
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
  ...ambitionTransitionEvents,
  ...powerAccessionEvents,
  ...presidencyGovernanceEvents,
  ...personalityMomentEvents,
  ...careerDisciplineEvents,
  ...socialActionEvents,
  ...personalFinanceEvents,
  ...leadershipManagementEvents,
  ...memoryEvents,
];
