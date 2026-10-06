// The tap steps for each drink, in the correct order.
// The ids must match the recipe ids in server/src/game/recipes.js.
export const RECIPES = {
  tea: {
    id: "tea",
    name: "Cuppa Tea",
    steps: [
      { id: "boil", label: "Boil water", icon: "🫖" },
      { id: "bag", label: "Add tea bag", icon: "🍃" },
      { id: "steep", label: "Let it steep", icon: "⏳" },
      { id: "milk", label: "Add milk", icon: "🥛" },
    ],
  },
  latte: {
    id: "latte",
    name: "Latte",
    steps: [
      { id: "grind", label: "Grind beans", icon: "⚙️" },
      { id: "shot", label: "Pull espresso", icon: "☕" },
      { id: "steam", label: "Steam milk", icon: "♨️" },
      { id: "pour", label: "Pour", icon: "🫗" },
    ],
  },
  filter: {
    id: "filter",
    name: "Filter Coffee",
    steps: [
      { id: "grind", label: "Grind beans", icon: "⚙️" },
      { id: "rinse", label: "Rinse filter", icon: "💧" },
      { id: "bloom", label: "Bloom the grounds", icon: "🌱" },
      { id: "pour", label: "Pour slowly", icon: "🫗" },
      { id: "serve", label: "Serve", icon: "🛎️" },
    ],
  },
};

export const CUSTOMERS = [
  { name: "Pete the postman", emoji: "🧑‍✈️", say: (d) => `Morning! A ${d}, please. I'm on my round.` },
  { name: "Nan", emoji: "👵", say: (d) => `Hello love, a ${d} for me. No rush.` },
  { name: "Zoe the student", emoji: "🧑‍🎓", say: (d) => `${d}, quick as you can. I have a deadline.` },
  { name: "Mr Whittaker", emoji: "🧐", say: (d) => `One ${d}. And do mind the cup this time.` },
];
