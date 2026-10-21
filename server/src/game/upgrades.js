// The upgrade shop. To add an upgrade, add an entry here and (for cosmetics)
// handle its key in the client. No database change is needed.
export const UPGRADES = {
  "better-kettle": {
    name: "Better kettle",
    description: "Earn 10% more coins on every order.",
    cost: 40,
    minLevel: 1,
    effects: { coinBonusPct: 10 },
  },
  "extra-table": {
    name: "Extra table",
    description: "Customers wait 10 seconds longer.",
    cost: 60,
    minLevel: 1,
    effects: { patienceBonusSec: 10 },
  },
  "pink-wallpaper": {
    name: "Pink wallpaper",
    description: "A fresh coat of paint for the cafe walls.",
    cost: 50,
    minLevel: 1,
    effects: {},
  },
  "tea-rug": {
    name: "Tea rug",
    description: "A soft rug grounds the room and makes the cafe feel homey.",
    cost: 75,
    minLevel: 1,
    effects: {},
  },
  "gallery-pictures": {
    name: "Gallery pictures",
    description: "Framed art gives the walls a warm, lived-in look.",
    cost: 90,
    minLevel: 2,
    effects: {},
  },
  "fairy-lights": {
    name: "Fairy lights",
    description: "A gentle glow for cozy evenings in the cafe.",
    cost: 110,
    minLevel: 3,
    effects: {},
  },
  "espresso-machine": {
    name: "Espresso machine",
    description: "Unlocks lattes on the menu.",
    cost: 120,
    minLevel: 2,
    effects: {},
  },
  "filter-set": {
    name: "Filter coffee set",
    description: "Unlocks filter coffee on the menu.",
    cost: 200,
    minLevel: 3,
    effects: {},
  },
  "pro-grinder": {
    name: "Pro grinder",
    description: "Earn 15% more coins on every order.",
    cost: 150,
    minLevel: 3,
    effects: { coinBonusPct: 15 },
  },
};

export function totalEffects(ownedKeys) {
  const totals = { coinBonusPct: 0, patienceBonusSec: 0 };
  for (const key of ownedKeys) {
    const effects = UPGRADES[key]?.effects ?? {};
    totals.coinBonusPct += effects.coinBonusPct ?? 0;
    totals.patienceBonusSec += effects.patienceBonusSec ?? 0;
  }
  return totals;
}
