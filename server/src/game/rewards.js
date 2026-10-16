// Pure game rules. No database or HTTP in here, so they are easy to test.

export function starsFor(mistakes) {
  return 3 - Math.min(mistakes, 2);
}

// Reputation needed to reach a level: 0, 10, 40, 90, 160, ...
export function levelFor(reputation) {
  return 1 + Math.floor(Math.sqrt(Math.max(0, reputation) / 10));
}

export function levelBounds(level) {
  return { from: 10 * (level - 1) ** 2, to: 10 * level ** 2 };
}

export function calculateReward({ recipe, mistakes, timeMs, coinBonusPct = 0 }) {
  const stars = starsFor(mistakes);
  const base = Math.round(recipe.basePrice * (0.5 + (0.5 * stars) / 3));
  const fastLimitMs = recipe.stepCount * 2000;
  const tip = timeMs <= fastLimitMs ? Math.round(recipe.basePrice * 0.5) : 0;
  const coins = Math.round((base + tip) * (1 + coinBonusPct / 100));
  return { stars, coins, tip, reputation: stars };
}
