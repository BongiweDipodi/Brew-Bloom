import test from "node:test";
import assert from "node:assert/strict";
import { calculateReward, levelBounds, levelFor, starsFor } from "./rewards.js";
import { totalEffects } from "./upgrades.js";

const tea = { basePrice: 6, stepCount: 4 };

test("stars drop with mistakes but never below one", () => {
  assert.equal(starsFor(0), 3);
  assert.equal(starsFor(1), 2);
  assert.equal(starsFor(2), 1);
  assert.equal(starsFor(9), 1);
});

test("level rises with reputation", () => {
  assert.equal(levelFor(-5), 1);
  assert.equal(levelFor(0), 1);
  assert.equal(levelFor(10), 2);
  assert.equal(levelFor(40), 3);
});

test("level bounds match levelFor", () => {
  for (const level of [1, 2, 3, 4]) {
    const { from, to } = levelBounds(level);
    assert.equal(levelFor(from), level);
    assert.equal(levelFor(to), level + 1);
  }
});

test("a slow, clean brew pays the base price", () => {
  const r = calculateReward({ recipe: tea, mistakes: 0, timeMs: 20000 });
  assert.deepEqual(r, { stars: 3, coins: 6, tip: 0, reputation: 3 });
});

test("a fast brew earns a tip", () => {
  const r = calculateReward({ recipe: tea, mistakes: 0, timeMs: 6000 });
  assert.equal(r.tip, 3);
  assert.equal(r.coins, 9);
});

test("mistakes reduce the payout", () => {
  const r = calculateReward({ recipe: tea, mistakes: 2, timeMs: 20000 });
  assert.equal(r.stars, 1);
  assert.equal(r.coins, 4);
});

test("coin bonus is applied to the total", () => {
  const r = calculateReward({ recipe: tea, mistakes: 0, timeMs: 6000, coinBonusPct: 10 });
  assert.equal(r.coins, 10);
});

test("upgrade effects add up and ignore unknown keys", () => {
  const e = totalEffects(["better-kettle", "pro-grinder", "extra-table", "nope"]);
  assert.deepEqual(e, { coinBonusPct: 25, patienceBonusSec: 10 });
});
