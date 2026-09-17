import type { CareerTrack } from "@/engine/types";
import { civilTrack } from "./civil";
import { armyTrack } from "./army";
import { policeTrack } from "./police";
import { gendarmerieTrack } from "./gendarmerie";
import { entrepreneurTrack } from "./entrepreneur";
import { crimeTrack } from "./crime";
import { politicsTrack } from "./politics";

export const CAREER_TRACKS: CareerTrack[] = [
  civilTrack,
  armyTrack,
  policeTrack,
  gendarmerieTrack,
  entrepreneurTrack,
  crimeTrack,
  politicsTrack,
];
