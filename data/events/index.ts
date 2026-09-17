import type { GameEvent } from "@/engine/types";
import { earlyLifeEvents } from "./earlyLife";
import { economyEvents } from "./economy";
import { careerEvents } from "./career";
import { relationshipEvents } from "./relationships";

export const ALL_EVENTS: GameEvent[] = [
  ...earlyLifeEvents,
  ...economyEvents,
  ...careerEvents,
  ...relationshipEvents,
];
