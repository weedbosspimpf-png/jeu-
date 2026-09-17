import { SCENES, type SceneBackdrop, type SceneCareerAccent, type SceneFormation } from "@/data/scenes";

interface SceneIllustrationProps {
  sceneKey: string;
}

/**
 * Systeme de scenes visuelles de mission : une illustration cinematique
 * generee proceduralement (SVG) a partir des parametres purement
 * descriptifs de data/scenes.ts (lieu, decor, carriere, nombre de
 * personnages). Pas d'image bitmap statique : ceci garantit une identite
 * visuelle unifiee (memes lumieres, memes silhouettes, meme cadrage) sur
 * toutes les scenes, sans dependre d'un pipeline d'assets externe.
 *
 * Personnages representes en silhouettes a peau brune (identite du jeu :
 * personnages noirs, Afrique de l'Ouest fictive), tenue coloree selon la
 * filiere pour rester reconnaissable d'une scene a l'autre.
 */

const SKIN = "#8a5a3c";
const SKIN_SHADOW = "#5e3a24";

const CAREER_COLORS: Record<SceneCareerAccent, { garment: string; accent: string }> = {
  army: { garment: "#585c3d", accent: "#cdd0a8" },
  police: { garment: "#2d4159", accent: "#a9c1d6" },
  gendarmerie: { garment: "#39485c", accent: "#b7c4d6" },
  entrepreneur: { garment: "#302c29", accent: "#e0b34a" },
  politics: { garment: "#6e2a2a", accent: "#e0b34a" },
  presidency: { garment: "#1c2230", accent: "#e0b34a" },
  crime: { garment: "#3d2a38", accent: "#8a6a7a" },
};

const TIME_SKY: Record<string, [string, string]> = {
  aube: ["#3a2a2e", "#1a1512"],
  matin: ["#2c2620", "#171310"],
  jour: ["#26211d", "#151110"],
  crepuscule: ["#3f2416", "#171310"],
  nuit: ["#0f1420", "#0a0d15"],
};

function Figure({ x, y, scale = 1, garment, accent }: { x: number; y: number; scale?: number; garment: string; accent: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cx="0" cy="86" rx="20" ry="5" fill="#000" opacity="0.35" />
      <path d="M -14 84 L -16 40 Q -16 22 0 22 Q 16 22 16 40 L 14 84 Z" fill={garment} />
      <rect x="-15" y="30" width="6" height="34" rx="3" fill={garment} />
      <rect x="9" y="30" width="6" height="34" rx="3" fill={garment} />
      <rect x="-3" y="2" width="6" height="24" rx="3" fill={accent} opacity="0.8" />
      <circle cx="0" cy="10" r="12" fill={SKIN} />
      <path d="M -12 6 Q 0 -6 12 6 L 12 2 Q 0 -10 -12 2 Z" fill={SKIN_SHADOW} opacity="0.6" />
    </g>
  );
}

function figurePositions(formation: SceneFormation, count: number): { x: number; y: number; scale: number }[] {
  if (formation === "solo") return [{ x: 200, y: 70, scale: 1.15 }];
  if (formation === "facing") {
    return [
      { x: 140, y: 70, scale: 1.1 },
      { x: 260, y: 70, scale: 1.1 },
    ].slice(0, Math.max(count, 2));
  }
  if (formation === "crowd") {
    const positions: { x: number; y: number; scale: number }[] = [];
    for (let i = 0; i < count; i++) {
      const row = Math.floor(i / 3);
      const col = i % 3;
      positions.push({
        x: 90 + col * 90 + (row % 2) * 25,
        y: 110 - row * 18,
        scale: 0.55 - row * 0.08,
      });
    }
    return positions;
  }
  // group
  const positions: { x: number; y: number; scale: number }[] = [];
  const spread = 70;
  const start = 200 - ((count - 1) * spread) / 2;
  for (let i = 0; i < count; i++) {
    positions.push({ x: start + i * spread, y: 74, scale: 1 });
  }
  return positions;
}

function Backdrop({ backdrop }: { backdrop: SceneBackdrop }) {
  switch (backdrop) {
    case "briefing-room":
      return (
        <g>
          <rect x="0" y="0" width="400" height="160" fill="#1a1512" />
          <rect x="30" y="18" width="90" height="60" fill="#241c16" stroke="#3a2f26" />
          <line x1="45" y1="30" x2="105" y2="30" stroke="#5e3a24" strokeWidth="2" opacity="0.5" />
          <line x1="45" y1="42" x2="95" y2="42" stroke="#5e3a24" strokeWidth="2" opacity="0.5" />
          <line x1="45" y1="54" x2="100" y2="54" stroke="#5e3a24" strokeWidth="2" opacity="0.5" />
          <circle cx="330" cy="20" r="26" fill="#e0b34a" opacity="0.18" />
          <rect x="130" y="118" width="180" height="10" rx="3" fill="#221b17" />
        </g>
      );
    case "rural-field":
      return (
        <g>
          <path d="M0 100 Q 100 70 200 95 T 400 85 V160 H0 Z" fill="#2a2115" />
          <path d="M0 130 Q 120 110 220 128 T 400 120 V160 H0 Z" fill="#1c160f" />
          <ellipse cx="70" cy="98" rx="4" ry="18" fill="#171310" />
          <ellipse cx="70" cy="82" rx="18" ry="10" fill="#171310" />
          <ellipse cx="330" cy="104" rx="3" ry="14" fill="#171310" />
          <ellipse cx="330" cy="92" rx="14" ry="8" fill="#171310" />
        </g>
      );
    case "checkpoint":
      return (
        <g>
          <rect x="0" y="0" width="400" height="160" fill="#1c1a1c" />
          <rect x="0" y="110" width="400" height="50" fill="#241f1e" />
          <rect x="40" y="60" width="60" height="50" fill="#20191a" />
          <rect x="140" y="94" width="120" height="8" fill="#e0b34a" opacity="0.7" />
          <rect x="140" y="94" width="30" height="8" fill="#c0392b" opacity="0.8" />
        </g>
      );
    case "crime-scene":
      return (
        <g>
          <rect x="0" y="0" width="400" height="160" fill="#12131a" />
          <rect x="20" y="20" width="140" height="90" fill="#1a1a22" />
          <rect x="60" y="45" width="22" height="26" fill="#e0b34a" opacity="0.35" />
          <line x1="0" y1="70" x2="400" y2="55" stroke="#d1653f" strokeWidth="6" opacity="0.55" />
          <line x1="0" y1="90" x2="400" y2="75" stroke="#d1653f" strokeWidth="6" opacity="0.4" />
        </g>
      );
    case "office":
      return (
        <g>
          <rect x="0" y="0" width="400" height="160" fill="#151313" />
          <rect x="230" y="10" width="150" height="90" fill="#1c1a1c" />
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={245 + i * 32} y={20 + (i % 2) * 12} width="10" height="14" fill="#e0b34a" opacity="0.3" />
          ))}
          <rect x="60" y="120" width="200" height="10" rx="3" fill="#241c16" />
        </g>
      );
    case "signing-room":
      return (
        <g>
          <rect x="0" y="0" width="400" height="160" fill="#191412" />
          <rect x="120" y="112" width="160" height="12" rx="3" fill="#221b17" />
          <rect x="150" y="106" width="60" height="8" fill="#e0e0d8" opacity="0.85" />
          <circle cx="330" cy="30" r="22" fill="#e0b34a" opacity="0.2" />
        </g>
      );
    case "rally-square":
      return (
        <g>
          <rect x="0" y="0" width="400" height="160" fill="#1a1310" />
          <rect x="10" y="130" width="380" height="8" fill="#241c16" />
          <rect x="150" y="30" width="6" height="60" fill="#3a2f26" />
          <path d="M156 30 L 200 42 L 156 54 Z" fill="#e0b34a" opacity="0.6" />
        </g>
      );
    case "council-chamber":
      return (
        <g>
          <rect x="0" y="0" width="400" height="160" fill="#171622" />
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x={20 + i * 76} y="10" width="14" height="100" fill="#1f1e2c" />
          ))}
          <circle cx="200" cy="30" r="18" fill="#e0b34a" opacity="0.35" />
          <rect x="90" y="118" width="220" height="10" rx="3" fill="#221b17" />
        </g>
      );
    default:
      return null;
  }
}

export function SceneIllustration({ sceneKey }: SceneIllustrationProps) {
  const scene = SCENES[sceneKey];
  if (!scene) return null;

  const [skyTop, skyBottom] = TIME_SKY[scene.time]!;
  const colors = CAREER_COLORS[scene.career];
  const positions = figurePositions(scene.formation, scene.figures);
  const gradientId = `sky-${sceneKey}`;
  const vignetteId = `vignette-${sceneKey}`;

  return (
    <figure className="scene-illustration">
      <svg viewBox="0 0 400 160" preserveAspectRatio="xMidYMid slice" role="img" aria-label={scene.caption}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={skyTop} />
            <stop offset="100%" stopColor={skyBottom} />
          </linearGradient>
          <radialGradient id={vignetteId} cx="50%" cy="45%" r="75%">
            <stop offset="55%" stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.55" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="400" height="160" fill={`url(#${gradientId})`} />
        <Backdrop backdrop={scene.backdrop} />
        {positions.map((p, i) => (
          <Figure key={i} x={p.x} y={p.y} scale={p.scale} garment={colors.garment} accent={colors.accent} />
        ))}
        <rect x="0" y="0" width="400" height="160" fill={`url(#${vignetteId})`} />
      </svg>
      <figcaption>
        <span className="scene-location">
          {scene.location} &middot; {scene.time}
        </span>
        <span className="scene-caption">{scene.caption}</span>
      </figcaption>
    </figure>
  );
}
