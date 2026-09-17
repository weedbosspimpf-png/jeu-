import type { PersonalityTrait } from "@/engine/types";

/**
 * Particularites de personnalite qui emergent apres suffisamment de
 * decisions coherentes - jamais choisies au debut, jamais une seule
 * stat isolee. Aucune n'est presentee comme superieure a une autre :
 * chacune ouvre des possibilites tout en fermant d'autres portes.
 */
export const PERSONALITY_TRAITS: PersonalityTrait[] = [
  {
    id: "lecture-des-hommes",
    label: "Lecture des hommes",
    icon: "🧠",
    description:
      "Votre perspicacite et votre experience des relations vous permettent de mieux comprendre certaines situations.",
    condition: (state) => state.character.stats.perspicacity >= 70 && state.character.stats.empathy >= 55,
  },
  {
    id: "stratege",
    label: "Stratege",
    icon: "♟️",
    description:
      "Votre combinaison de prudence, d'intelligence et de sang-froid vous permet d'envisager davantage d'options dans certaines crises.",
    condition: (state) =>
      state.character.stats.prudence >= 65 &&
      state.character.stats.intelligence >= 65 &&
      state.character.stats.coolness >= 65,
  },
  {
    id: "leader-charismatique",
    label: "Leader charismatique",
    icon: "🎙️",
    description: "Votre charisme et votre influence vous permettent de mobiliser plus facilement certains groupes.",
    condition: (state) => state.character.stats.charisma >= 70 && state.character.stats.influence >= 50,
  },
  {
    id: "architecte-de-lombre",
    label: "Architecte de l'ombre",
    icon: "🕸️",
    description:
      "Votre malice et votre sens de la manipulation vous ouvrent des solutions indirectes, mais nourrissent aussi la mefiance a votre egard.",
    condition: (state) => state.character.stats.manipulation >= 70 && state.character.stats.malice >= 60,
  },
  {
    id: "diplomate-hors-pair",
    label: "Diplomate hors pair",
    icon: "🤝",
    description:
      "Votre sens de la negociation et votre comprehension des autres debloquent des issues pacifiques a certains conflits.",
    condition: (state) => state.character.stats.diplomacy >= 70 && state.character.stats.perspicacity >= 55,
  },
  {
    id: "sang-froid-legendaire",
    label: "Sang-froid legendaire",
    icon: "❄️",
    description: "Rien ne semble pouvoir vous deborder, meme dans les crises les plus intenses.",
    condition: (state) => state.character.stats.coolness >= 80 && state.character.stats.courage >= 60,
  },
  {
    id: "opportuniste-avise",
    label: "Opportuniste avise",
    icon: "🎯",
    description: "Vous savez reconnaitre et exploiter une occasion favorable avant qu'elle ne disparaisse.",
    condition: (state) => state.character.stats.opportunism >= 70 && state.character.stats.ruse >= 60,
  },
  {
    id: "integrite-inflexible",
    label: "Integrite inflexible",
    icon: "⚖️",
    description:
      "Vos principes ne plient pas, ce qui vous vaut le respect de certains et ferme des portes dans les environnements plus compromis.",
    condition: (state) => state.character.stats.integrity >= 85 && state.character.stats.loyalty >= 60,
  },
];
