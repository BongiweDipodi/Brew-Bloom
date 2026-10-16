// Economy data for each drink. The tap steps themselves live in the client.
// A recipe with requiresUpgrade stays locked until the player owns that upgrade.
export const RECIPES = {
  tea: { name: "Cuppa Tea", basePrice: 6, stepCount: 4, requiresUpgrade: null },
  latte: { name: "Latte", basePrice: 14, stepCount: 4, requiresUpgrade: "espresso-machine" },
  filter: { name: "Filter Coffee", basePrice: 18, stepCount: 5, requiresUpgrade: "filter-set" },
};
