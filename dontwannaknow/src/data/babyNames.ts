// Top baby names per decade and country. Boys and girls listed roughly
// in order of frequency for that decade. US data follows the Social
// Security Administration records; CA tracks closely with US;
// Czech/Spanish/Ukrainian/Mexican names are popular-historical
// approximations from civil-registry summaries.

import type { Country } from "./countryDecades";

export type BabyNames = {
  country: Exclude<Country, "INTL">;
  decadeStart: number;
  boys: string[];
  girls: string[];
};

export const BABY_NAMES: BabyNames[] = [
  // ── US ──────────────────────────────────────────────────────────
  { country: "US", decadeStart: 1920, boys: ["Robert", "John", "James", "William", "Charles"], girls: ["Mary", "Dorothy", "Helen", "Betty", "Margaret"] },
  { country: "US", decadeStart: 1930, boys: ["Robert", "James", "John", "William", "Richard"], girls: ["Mary", "Betty", "Barbara", "Shirley", "Patricia"] },
  { country: "US", decadeStart: 1940, boys: ["James", "Robert", "John", "William", "Richard"], girls: ["Mary", "Linda", "Barbara", "Patricia", "Carol"] },
  { country: "US", decadeStart: 1950, boys: ["Michael", "James", "Robert", "John", "David"], girls: ["Mary", "Linda", "Patricia", "Susan", "Deborah"] },
  { country: "US", decadeStart: 1960, boys: ["Michael", "David", "John", "James", "Robert"], girls: ["Lisa", "Mary", "Karen", "Susan", "Kimberly"] },
  { country: "US", decadeStart: 1970, boys: ["Michael", "Christopher", "Jason", "David", "James"], girls: ["Jennifer", "Amy", "Melissa", "Michelle", "Kimberly"] },
  { country: "US", decadeStart: 1980, boys: ["Michael", "Christopher", "Matthew", "Joshua", "David"], girls: ["Jessica", "Jennifer", "Amanda", "Ashley", "Sarah"] },
  { country: "US", decadeStart: 1990, boys: ["Michael", "Christopher", "Matthew", "Joshua", "Jacob"], girls: ["Jessica", "Ashley", "Emily", "Sarah", "Samantha"] },

  // ── Canada ──────────────────────────────────────────────────────
  { country: "CA", decadeStart: 1920, boys: ["John", "William", "Robert", "James", "Charles"], girls: ["Mary", "Dorothy", "Helen", "Margaret", "Anne"] },
  { country: "CA", decadeStart: 1930, boys: ["Robert", "John", "James", "William", "Richard"], girls: ["Mary", "Betty", "Barbara", "Joan", "Margaret"] },
  { country: "CA", decadeStart: 1940, boys: ["Robert", "James", "John", "William", "Michael"], girls: ["Mary", "Linda", "Susan", "Patricia", "Barbara"] },
  { country: "CA", decadeStart: 1950, boys: ["Michael", "David", "John", "Robert", "James"], girls: ["Linda", "Susan", "Karen", "Barbara", "Mary"] },
  { country: "CA", decadeStart: 1960, boys: ["Michael", "David", "John", "Robert", "Stephen"], girls: ["Lisa", "Karen", "Kimberly", "Susan", "Jennifer"] },
  { country: "CA", decadeStart: 1970, boys: ["Michael", "Christopher", "Jason", "David", "Matthew"], girls: ["Jennifer", "Jessica", "Amanda", "Sarah", "Melanie"] },
  { country: "CA", decadeStart: 1980, boys: ["Michael", "Matthew", "Christopher", "David", "Andrew"], girls: ["Jennifer", "Jessica", "Ashley", "Sarah", "Amanda"] },
  { country: "CA", decadeStart: 1990, boys: ["Matthew", "Michael", "Joshua", "Ryan", "Jacob"], girls: ["Emily", "Jessica", "Sarah", "Megan", "Ashley"] },

  // ── Czechia / Czechoslovakia ────────────────────────────────────
  { country: "CZ", decadeStart: 1920, boys: ["Josef", "Jan", "František", "Václav", "Karel"], girls: ["Marie", "Anna", "Růžena", "Božena", "Františka"] },
  { country: "CZ", decadeStart: 1930, boys: ["Jan", "Josef", "Václav", "František", "Jiří"], girls: ["Marie", "Věra", "Jaroslava", "Anna", "Helena"] },
  { country: "CZ", decadeStart: 1940, boys: ["Jiří", "Václav", "Jan", "Josef", "Petr"], girls: ["Marie", "Jana", "Eva", "Věra", "Hana"] },
  { country: "CZ", decadeStart: 1950, boys: ["Jan", "Jiří", "Petr", "Pavel", "Václav"], girls: ["Jana", "Eva", "Hana", "Marie", "Alena"] },
  { country: "CZ", decadeStart: 1960, boys: ["Jan", "Petr", "Jiří", "Pavel", "Tomáš"], girls: ["Jana", "Eva", "Petra", "Lenka", "Martina"] },
  { country: "CZ", decadeStart: 1970, boys: ["Petr", "Jan", "Martin", "Tomáš", "Jiří"], girls: ["Petra", "Lenka", "Martina", "Jana", "Lucie"] },
  { country: "CZ", decadeStart: 1980, boys: ["Martin", "Jan", "Petr", "Lukáš", "Tomáš"], girls: ["Lucie", "Tereza", "Kateřina", "Petra", "Veronika"] },
  { country: "CZ", decadeStart: 1990, boys: ["Jan", "Tomáš", "Lukáš", "Martin", "Jakub"], girls: ["Tereza", "Kateřina", "Lucie", "Nikola", "Veronika"] },

  // ── Spain ───────────────────────────────────────────────────────
  { country: "ES", decadeStart: 1920, boys: ["José", "Antonio", "Juan", "Manuel", "Francisco"], girls: ["María", "Carmen", "Josefa", "Dolores", "Francisca"] },
  { country: "ES", decadeStart: 1930, boys: ["Antonio", "José", "Manuel", "Francisco", "Juan"], girls: ["María", "Carmen", "Josefa", "Pilar", "Ana"] },
  { country: "ES", decadeStart: 1940, boys: ["Antonio", "José", "Manuel", "Francisco", "Juan"], girls: ["María Carmen", "María Dolores", "María Pilar", "Antonia", "Josefa"] },
  { country: "ES", decadeStart: 1950, boys: ["Antonio", "José", "Manuel", "Francisco", "Juan"], girls: ["María Carmen", "María Dolores", "María Teresa", "Ana María", "María Pilar"] },
  { country: "ES", decadeStart: 1960, boys: ["José Antonio", "Juan Carlos", "José Luis", "Francisco Javier", "José Manuel"], girls: ["María Carmen", "María Isabel", "María Teresa", "Ana María", "María Pilar"] },
  { country: "ES", decadeStart: 1970, boys: ["David", "Javier", "Daniel", "Francisco Javier", "Antonio"], girls: ["María", "Ana", "Cristina", "Laura", "María Carmen"] },
  { country: "ES", decadeStart: 1980, boys: ["David", "Javier", "Daniel", "Sergio", "Carlos"], girls: ["Laura", "Cristina", "María", "Sara", "Ana"] },
  { country: "ES", decadeStart: 1990, boys: ["Alejandro", "David", "Daniel", "Javier", "Adrián"], girls: ["María", "Laura", "Cristina", "Marta", "Sara"] },

  // ── Ukraine / Ukrainian SSR ─────────────────────────────────────
  { country: "UA", decadeStart: 1920, boys: ["Ivan", "Mykola", "Petro", "Mykhailo", "Vasyl"], girls: ["Maria", "Hanna", "Kateryna", "Olha", "Paraskeva"] },
  { country: "UA", decadeStart: 1930, boys: ["Ivan", "Vasyl", "Mykola", "Petro", "Mykhailo"], girls: ["Maria", "Hanna", "Olha", "Nadia", "Kateryna"] },
  { country: "UA", decadeStart: 1940, boys: ["Mykhailo", "Ivan", "Vasyl", "Mykola", "Volodymyr"], girls: ["Hanna", "Maria", "Nina", "Lyubov", "Vira"] },
  { country: "UA", decadeStart: 1950, boys: ["Volodymyr", "Mykola", "Viktor", "Oleksandr", "Anatoliy"], girls: ["Lyudmyla", "Hanna", "Tetiana", "Olha", "Svitlana"] },
  { country: "UA", decadeStart: 1960, boys: ["Oleksandr", "Volodymyr", "Andriy", "Serhiy", "Yuriy"], girls: ["Olena", "Iryna", "Tetiana", "Natalia", "Svitlana"] },
  { country: "UA", decadeStart: 1970, boys: ["Andriy", "Serhiy", "Oleksandr", "Maksym", "Dmytro"], girls: ["Iryna", "Tetiana", "Olena", "Yulia", "Natalia"] },
  { country: "UA", decadeStart: 1980, boys: ["Oleksandr", "Dmytro", "Andriy", "Serhiy", "Maksym"], girls: ["Yulia", "Anna", "Iryna", "Olha", "Tetiana"] },
  { country: "UA", decadeStart: 1990, boys: ["Oleksandr", "Andriy", "Dmytro", "Maksym", "Vladyslav"], girls: ["Anna", "Iryna", "Olena", "Yulia", "Kateryna"] },

  // ── Mexico ──────────────────────────────────────────────────────
  { country: "MX", decadeStart: 1920, boys: ["José", "Juan", "Pedro", "Manuel", "Carlos"], girls: ["María", "Guadalupe", "Josefina", "Concepción", "Carmen"] },
  { country: "MX", decadeStart: 1930, boys: ["José", "Juan", "Pedro", "Manuel", "Carlos"], girls: ["María", "Guadalupe", "Carmen", "Rosa", "Margarita"] },
  { country: "MX", decadeStart: 1940, boys: ["José", "Juan", "Carlos", "Manuel", "Francisco"], girls: ["María", "Guadalupe", "Rosa", "Carmen", "Margarita"] },
  { country: "MX", decadeStart: 1950, boys: ["José", "Juan", "Carlos", "Roberto", "Jorge"], girls: ["María", "Guadalupe", "Rosa", "Patricia", "Silvia"] },
  { country: "MX", decadeStart: 1960, boys: ["José", "Juan", "Carlos", "Jorge", "Luis"], girls: ["María", "Patricia", "Silvia", "Rosa", "Verónica"] },
  { country: "MX", decadeStart: 1970, boys: ["Juan", "José", "Luis", "Carlos", "Miguel"], girls: ["María", "Verónica", "Patricia", "Sandra", "Mónica"] },
  { country: "MX", decadeStart: 1980, boys: ["Luis", "Carlos", "Juan", "José", "Jorge"], girls: ["María Guadalupe", "Verónica", "Mónica", "Sandra", "Karina"] },
  { country: "MX", decadeStart: 1990, boys: ["Juan", "Luis", "Carlos", "Miguel", "Jorge"], girls: ["María", "Karla", "Diana", "Daniela", "Brenda"] },
];

export function namesFor(country: Country, year: number): BabyNames | null {
  if (country === "INTL") return null;
  const decade = Math.floor(year / 10) * 10;
  return BABY_NAMES.find((n) => n.country === country && n.decadeStart === decade) ?? null;
}
