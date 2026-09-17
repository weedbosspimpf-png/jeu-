import type { GameState } from "@/engine/types";
import { RelationshipsPanel } from "@/components/RelationshipsPanel";

export function RelationsTab({ state }: { state: GameState }) {
  return <RelationshipsPanel state={state} />;
}
