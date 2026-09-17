import type { Effect } from "@/engine/types";
import { STAT_LABELS } from "@/data/stats";
import { AMBITION_LABELS } from "@/data/ambitions";
import { WORLD_LABELS } from "@/data/world";

/**
 * Traduit les effets VISIBLES d'un choix en lignes lisibles ("+ Reputation",
 * "- Argent"). N'inspecte jamais les hiddenEffects ni les delayedEffects :
 * certaines consequences doivent rester cachees ou n'apparaitre que plus
 * tard, exactement comme le veut le moteur existant.
 */
export function describeEffectDeltas(effects: Effect[]): string[] {
  const lines: string[] = [];

  for (const effect of effects) {
    switch (effect.type) {
      case "stat": {
        if (effect.delta !== 0) lines.push(formatDelta(STAT_LABELS[effect.stat], effect.delta));
        break;
      }
      case "money": {
        if (effect.delta !== 0) lines.push(formatDelta("Argent", effect.delta));
        break;
      }
      case "ambition": {
        if (effect.delta !== 0) lines.push(formatDelta(AMBITION_LABELS[effect.key], effect.delta));
        break;
      }
      case "careerPerformance": {
        if (effect.delta !== 0) lines.push(formatDelta("Performance", effect.delta));
        break;
      }
      case "superiorTrust": {
        if (effect.delta !== 0) lines.push(formatDelta("Confiance des superieurs", effect.delta));
        break;
      }
      case "subordinateMorale": {
        if (effect.delta !== 0) lines.push(formatDelta("Moral des subordonnes", effect.delta));
        break;
      }
      case "world": {
        if (effect.delta !== 0) lines.push(formatDelta(WORLD_LABELS[effect.key], effect.delta));
        break;
      }
      case "relationship": {
        const parts = [effect.trust, effect.loyalty, effect.influence].filter((v) => v !== undefined);
        if (parts.length > 0) lines.push(`Relation avec ${effect.npcId}`);
        break;
      }
      case "regionalPopularity": {
        if (effect.delta !== 0) lines.push(formatDelta(`Popularite (${effect.region})`, effect.delta));
        break;
      }
      case "joinCareer": {
        lines.push(`Nouvelle trajectoire : ${effect.track}`);
        break;
      }
      default:
        break;
    }
  }

  return lines;
}

function formatDelta(label: string, delta: number): string {
  const sign = delta > 0 ? "+" : "";
  return `${sign}${delta} ${label}`;
}
