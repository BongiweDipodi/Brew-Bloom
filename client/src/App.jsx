import { useEffect, useState } from "react";
import { buyUpgrade, createPlayer, getPlayer, getUpgrades, serveOrder, walkout } from "./api.js";
import { CUSTOMERS, RECIPES } from "./game/recipes.js";
import CafeScene from "./components/CafeScene.jsx";
import Customer from "./components/Customer.jsx";
import Hud from "./components/Hud.jsx";
import Shop from "./components/Shop.jsx";
import TapBrew from "./components/TapBrew.jsx";
import Welcome from "./components/Welcome.jsx";

const STORAGE_KEY = "brewbloom.playerId";
const BASE_PATIENCE_SEC = 30;

const pick = (list) => list[Math.floor(Math.random() * list.length)];

function newOrder(unlockedRecipes) {
  return {
    id: crypto.randomUUID(),
    customer: pick(CUSTOMERS),
    recipe: RECIPES[pick(unlockedRecipes)],
  };
}

export default function App() {
  const [state, setState] = useState(null);
  const [upgrades, setUpgrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("cafe");
  const [order, setOrder] = useState(null);
  const [phase, setPhase] = useState("making"); // "making" or "done"
  const [result, setResult] = useState(null);

  // Load the upgrade catalogue and, if we have a saved player, their progress.
  useEffect(() => {
    async function load() {
      try {
        setUpgrades(await getUpgrades());
        const savedId = localStorage.getItem(STORAGE_KEY);
        if (savedId) {
          try {
            setState(await getPlayer(savedId));
          } catch {
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      } catch (e) {
        setError("Cannot reach the game server. Is it running?");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Bring in the first customer once the player is loaded.
  useEffect(() => {
    if (state && !order) setOrder(newOrder(state.unlockedRecipes));
  }, [state, order]);

  async function handleStart(name) {
    setError("");
    try {
      const next = await createPlayer(name);
      localStorage.setItem(STORAGE_KEY, next.player.id);
      setState(next);
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleServed({ mistakes, timeMs }) {
    setPhase("done");
    try {
      const { reward, ...next } = await serveOrder(state.player.id, {
        recipeId: order.recipe.id,
        mistakes,
        timeMs,
      });
      setState(next);
      setResult({ type: "served", reward, customer: order.customer });
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleWalkout() {
    setPhase("done");
    try {
      setState(await walkout(state.player.id));
      setResult({ type: "walkout", customer: order.customer });
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleBuy(key) {
    setError("");
    try {
      setState(await buyUpgrade(state.player.id, key));
    } catch (e) {
      setError(e.message);
    }
  }

  function nextCustomer() {
    setResult(null);
    setPhase("making");
    setOrder(newOrder(state.unlockedRecipes));
  }

  if (loading) return <p className="center">Opening up...</p>;
  if (!state) return <Welcome onStart={handleStart} error={error} />;

  const patienceSec = BASE_PATIENCE_SEC + state.effects.patienceBonusSec;
  const outcome = result ? result.type : "waiting"; // waiting, served or walkout

  return (
    <main className="app">
      <header className="app-header">
        <h1>Brew &amp; Bloom</h1>
        <p>{state.player.name}'s cafe</p>
      </header>

      <Hud state={state} />

      <CafeScene owned={state.owned} level={state.level} order={order} outcome={outcome} />

      <nav className="tabs">
        <button className={tab === "cafe" ? "is-active" : ""} onClick={() => setTab("cafe")}>Cafe</button>
        <button className={tab === "shop" ? "is-active" : ""} onClick={() => setTab("shop")}>Upgrades</button>
      </nav>

      {error && <p className="error" role="alert">{error}</p>}

      <div hidden={tab !== "cafe"} className="cafe">
        {order && (
          <Customer
            key={order.id}
            customer={order.customer}
            drinkName={order.recipe.name}
            patienceSec={patienceSec}
            paused={tab !== "cafe" || phase !== "making"}
            onWalkout={handleWalkout}
          />
        )}

        {order && phase === "making" && (
          <TapBrew key={order.id} recipe={order.recipe} onComplete={handleServed} />
        )}

        {result && (
          <div className="result" role="status">
            {result.type === "served" ? (
              <p>
                {result.customer.name} loved it! {"★".repeat(result.reward.stars)}
                {"☆".repeat(3 - result.reward.stars)} You earned {result.reward.coins} coins
                {result.reward.tip > 0 ? ` including a tip.` : "."}
              </p>
            ) : (
              <p>{result.customer.name} got tired of waiting and left. Your reputation dipped.</p>
            )}
            <button onClick={nextCustomer}>Next customer</button>
          </div>
        )}
      </div>

      <div hidden={tab !== "shop"}>
        <Shop upgrades={upgrades} state={state} onBuy={handleBuy} />
      </div>
    </main>
  );
}
