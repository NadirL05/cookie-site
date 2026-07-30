export interface Review {
  quote: string;
  name: string;
  event: string;
  product: string;
}

export const reviews: Review[] = [
  {
    quote: "Une animation exceptionnelle qui a fait l'unanimité auprès de nos invités. Le bar à crêpes était un vrai succès !",
    name: "Sophie M.",
    event: "Mariage · Région PACA",
    product: "Bar à Crêpes",
  },
  {
    quote: "Le bar à tiramisu a été une vraie révélation : originalité, goût et élégance. Nos collaborateurs en parlent encore.",
    name: "Thomas & Julie",
    event: "Soirée corporate · Marseille",
    product: "Bar à Tiramisu",
  },
  {
    quote: "CooksBrad a su créer une ambiance unique, à la fois conviviale et haut de gamme. Je recommande sans hésiter.",
    name: "Camille R.",
    event: "Anniversaire privé · Aix-en-Provence",
    product: "Bar à Gaufres",
  },
  {
    quote: "Service irréprochable du début à la fin. Une équipe professionnelle et souriante qui a tout géré parfaitement.",
    name: "Marc D.",
    event: "EVJF · Nice",
    product: "Bar à Crêpes",
  },
];
