import type { GameState } from "@/engine/types";
import { CareerPanel } from "@/components/CareerPanel";
import { CareerLadder } from "@/components/CareerLadder";
import { AmbitionPanel } from "@/components/AmbitionPanel";
import { ComparisonPanel } from "@/components/ComparisonPanel";

export function CareerTab({ state }: { state: GameState }) {
  return (
    <>
      <CareerLadder state={state} />
      <CareerPanel state={state} />
      <AmbitionPanel state={state} />
      <ComparisonPanel state={state} />
    </>
  );
}
