import { Router } from "express";
import { prisma } from "../db.js";
import { RECIPES } from "../game/recipes.js";
import { UPGRADES, totalEffects } from "../game/upgrades.js";
import { calculateReward, levelBounds, levelFor } from "../game/rewards.js";

const router = Router();

const withUpgrades = { upgrades: true };

// Everything the client needs to draw the game, built from a player row.
function toState(player) {
  const owned = player.upgrades.map((u) => u.upgradeKey);
  const level = levelFor(player.reputation);
  return {
    player: {
      id: player.id,
      name: player.name,
      coins: player.coins,
      reputation: player.reputation,
      servedCount: player.servedCount,
    },
    level,
    levelBounds: levelBounds(level),
    owned,
    effects: totalEffects(owned),
    unlockedRecipes: Object.entries(RECIPES)
      .filter(([, r]) => !r.requiresUpgrade || owned.includes(r.requiresUpgrade))
      .map(([id]) => id),
  };
}

async function requirePlayer(req, res, next) {
  const player = await prisma.player.findUnique({
    where: { id: req.params.id },
    include: withUpgrades,
  });
  if (!player) return res.status(404).json({ error: "Player not found" });
  req.player = player;
  next();
}

router.get("/upgrades", (_req, res) => {
  res.json(Object.entries(UPGRADES).map(([key, upgrade]) => ({ key, ...upgrade })));
});

router.post("/players", async (req, res) => {
  const name = String(req.body?.name ?? "").trim().slice(0, 30);
  if (!name) return res.status(400).json({ error: "Name is required" });
  const player = await prisma.player.create({ data: { name }, include: withUpgrades });
  res.status(201).json(toState(player));
});

router.get("/players/:id", requirePlayer, (req, res) => {
  res.json(toState(req.player));
});

router.post("/players/:id/serve", requirePlayer, async (req, res) => {
  const { recipeId, mistakes, timeMs } = req.body ?? {};

  if (typeof recipeId !== "string" || !Object.hasOwn(RECIPES, recipeId)) {
    return res.status(400).json({ error: "Unknown recipe" });
  }
  if (!Number.isInteger(mistakes) || mistakes < 0 || mistakes > 100) {
    return res.status(400).json({ error: "Invalid mistakes" });
  }
  if (!Number.isFinite(timeMs) || timeMs <= 0) {
    return res.status(400).json({ error: "Invalid time" });
  }

  const state = toState(req.player);
  if (!state.unlockedRecipes.includes(recipeId)) {
    return res.status(403).json({ error: "That drink is not on your menu yet" });
  }

  const reward = calculateReward({
    recipe: RECIPES[recipeId],
    mistakes,
    timeMs,
    coinBonusPct: state.effects.coinBonusPct,
  });

  const updated = await prisma.player.update({
    where: { id: req.player.id },
    data: {
      coins: { increment: reward.coins },
      reputation: { increment: reward.reputation },
      servedCount: { increment: 1 },
    },
    include: withUpgrades,
  });

  res.json({ reward, ...toState(updated) });
});

router.post("/players/:id/walkout", requirePlayer, async (req, res) => {
  const updated = await prisma.player.update({
    where: { id: req.player.id },
    data: { reputation: Math.max(0, req.player.reputation - 1) },
    include: withUpgrades,
  });
  res.json(toState(updated));
});

router.post("/players/:id/upgrades", requirePlayer, async (req, res) => {
  const key = req.body?.key;
  if (typeof key !== "string" || !Object.hasOwn(UPGRADES, key)) {
    return res.status(400).json({ error: "Unknown upgrade" });
  }

  const upgrade = UPGRADES[key];
  const state = toState(req.player);
  if (state.owned.includes(key)) {
    return res.status(409).json({ error: "You already own that" });
  }
  if (state.level < upgrade.minLevel) {
    return res.status(403).json({ error: `Reach level ${upgrade.minLevel} first` });
  }

  try {
    const bought = await prisma.$transaction(async (tx) => {
      // Only charge if the player still has enough coins at this moment.
      const paid = await tx.player.updateMany({
        where: { id: req.player.id, coins: { gte: upgrade.cost } },
        data: { coins: { decrement: upgrade.cost } },
      });
      if (paid.count === 0) return false;
      await tx.playerUpgrade.create({ data: { playerId: req.player.id, upgradeKey: key } });
      return true;
    });
    if (!bought) return res.status(402).json({ error: "Not enough coins" });
  } catch (err) {
    if (err.code === "P2002") return res.status(409).json({ error: "You already own that" });
    throw err;
  }

  const updated = await prisma.player.findUnique({
    where: { id: req.player.id },
    include: withUpgrades,
  });
  res.json(toState(updated));
});

export default router;
