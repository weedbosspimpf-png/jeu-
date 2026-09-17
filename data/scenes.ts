/**
 * Registre des scenes visuelles de mission. Purement descriptif (jamais
 * importe par engine/) : GameEvent.scene ne porte qu'une cle (voir
 * engine/types.ts), ce fichier decrit ce que cette cle represente pour
 * que SceneIllustration.tsx sache quoi dessiner. Ajouter une scene =
 * ajouter une entree ici, jamais toucher au moteur ni a EventCard.tsx.
 *
 * Chaque scene doit rester coherente avec la situation reelle (carriere,
 * lieu, type de mission) : ce n'est jamais une illustration decorative
 * generique, c'est une representation de ce qui se passe dans l'evenement
 * auquel elle est attachee.
 */

export type SceneBackdrop =
  | "briefing-room"
  | "rural-field"
  | "checkpoint"
  | "crime-scene"
  | "office"
  | "signing-room"
  | "rally-square"
  | "council-chamber";

export type SceneCareerAccent =
  | "army"
  | "police"
  | "gendarmerie"
  | "entrepreneur"
  | "politics"
  | "presidency"
  | "crime";

export type SceneFormation = "solo" | "facing" | "group" | "crowd";

export interface SceneDescriptor {
  label: string;
  location: string;
  time: "aube" | "matin" | "jour" | "crepuscule" | "nuit";
  backdrop: SceneBackdrop;
  career: SceneCareerAccent;
  figures: number;
  formation: SceneFormation;
  caption: string;
}

export const SCENES: Record<string, SceneDescriptor> = {
  "army-kambara-briefing": {
    label: "Salle de briefing",
    location: "Base avancee, region de Kambara",
    time: "aube",
    backdrop: "briefing-room",
    career: "army",
    figures: 3,
    formation: "group",
    caption: "Ton unite attend tes ordres devant la carte de la zone.",
  },
  "army-kambara-field": {
    label: "Zone d'operation",
    location: "Peripherie de l'exploitation clandestine, Kambara",
    time: "jour",
    backdrop: "rural-field",
    career: "army",
    figures: 2,
    formation: "group",
    caption: "L'operation est engagee sur le terrain, hors de toute route goudronnee.",
  },
  "army-kambara-debrief": {
    label: "Debriefing",
    location: "Base avancee, region de Kambara",
    time: "crepuscule",
    backdrop: "briefing-room",
    career: "army",
    figures: 2,
    formation: "facing",
    caption: "Le bilan de l'operation remonte a la hierarchie.",
  },
  "police-disparition-briefing": {
    label: "Scene a investiguer",
    location: "Quartier residentiel, capitale",
    time: "nuit",
    backdrop: "crime-scene",
    career: "police",
    figures: 2,
    formation: "facing",
    caption: "Tu arrives sur les lieux ou la personne disparue a ete vue pour la derniere fois.",
  },
  "police-disparition-resolution": {
    label: "Bureau des enqueteurs",
    location: "Commissariat central",
    time: "jour",
    backdrop: "office",
    career: "police",
    figures: 1,
    formation: "solo",
    caption: "Tu rediges tes conclusions avant de les transmettre.",
  },
  "entrepreneur-contrat-briefing": {
    label: "Table de negociation",
    location: "Siege de l'entreprise, capitale",
    time: "jour",
    backdrop: "office",
    career: "entrepreneur",
    figures: 2,
    formation: "facing",
    caption: "Le client attend ta position sur les termes du contrat.",
  },
  "entrepreneur-contrat-resolution": {
    label: "Signature",
    location: "Siege de l'entreprise, capitale",
    time: "crepuscule",
    backdrop: "signing-room",
    career: "entrepreneur",
    figures: 2,
    formation: "facing",
    caption: "Les termes sont arretes, il ne reste qu'a signer.",
  },
  "politics-mobilisation-briefing": {
    label: "Place publique",
    location: "Quartier populaire, capitale",
    time: "jour",
    backdrop: "rally-square",
    career: "politics",
    figures: 6,
    formation: "crowd",
    caption: "Une foule s'est reunie, en attente de ce que tu vas leur dire.",
  },
  "politics-mobilisation-resolution": {
    label: "Apres le rassemblement",
    location: "Quartier populaire, capitale",
    time: "crepuscule",
    backdrop: "rally-square",
    career: "politics",
    figures: 3,
    formation: "group",
    caption: "Le mouvement que tu as lance commence a prendre forme.",
  },
  "presidency-budget-briefing": {
    label: "Conseil des ministres",
    location: "Palais presidentiel, capitale",
    time: "matin",
    backdrop: "council-chamber",
    career: "presidency",
    figures: 4,
    formation: "group",
    caption: "Le conseil attend ton arbitrage sur une enveloppe budgetaire limitee.",
  },
  "presidency-budget-resolution": {
    label: "Annonce officielle",
    location: "Palais presidentiel, capitale",
    time: "jour",
    backdrop: "council-chamber",
    career: "presidency",
    figures: 3,
    formation: "facing",
    caption: "La decision budgetaire est rendue publique.",
  },
};
