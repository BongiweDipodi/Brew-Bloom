export default function Shop({ upgrades, state, onBuy }) {
  return (
    <div className="shop">
      <h2 className="shop-title">Upgrades</h2>
      <ul className="shop-list">
        {upgrades.map((u) => {
          const owned = state.owned.includes(u.key);
          const locked = state.level < u.minLevel;
          const poor = state.player.coins < u.cost;

          let label = `Buy for ${u.cost} coins`;
          if (owned) label = "Owned";
          else if (locked) label = `Reach level ${u.minLevel}`;
          else if (poor) label = `${u.cost} coins`;

          return (
            <li key={u.key} className={`shop-item ${owned ? "is-owned" : ""}`}>
              <div>
                <p className="shop-name">{u.name}</p>
                <p className="shop-desc">{u.description}</p>
              </div>
              <button
                className="shop-buy"
                disabled={owned || locked || poor}
                onClick={() => onBuy(u.key)}
              >
                {label}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
