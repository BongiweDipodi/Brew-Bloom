// The cafe, drawn as a small SVG scene. It is built purely from the player's
// state, so buying an upgrade or levelling up changes what you see.

const BERRY = "#5a1a3a";
const PINK = "#ff4d8d";
const LEAF = "#46a877";
const LEAF_LIGHT = "#5bbf8a";
const TERRACOTTA = "#d98c6a";

// x position on the counter for each piece of equipment
const SLOTS = { "espresso-machine": 110, "pro-grinder": 165, "filter-set": 220 };

const DRINK_ICON = { tea: "🍵", latte: "☕", filter: "☕" };

function Kettle({ upgraded }) {
  const fill = upgraded ? PINK : "#c4b5bc";
  return (
    <g transform="translate(50,150)">
      <path className="steam" d="M-3 -40 q-4 -5 0 -9 q4 -5 0 -9" />
      <path className="steam steam-late" d="M6 -40 q-4 -5 0 -9 q4 -5 0 -9" />
      <path d="M-14 0 v-18 q0 -12 14 -12 q14 0 14 12 v18 z" fill={fill} stroke={BERRY} strokeWidth="2" />
      <rect x="-5" y="-35" width="10" height="6" rx="3" fill={fill} stroke={BERRY} strokeWidth="2" />
      <path d="M14 -16 q12 -2 15 -14" fill="none" stroke={BERRY} strokeWidth="3" strokeLinecap="round" />
      <path d="M-14 -22 q-15 2 -13 14 q2 8 13 6" fill="none" stroke={BERRY} strokeWidth="3" strokeLinecap="round" />
      {upgraded && <text x="10" y="-30" fontSize="12">✨</text>}
    </g>
  );
}

function EspressoMachine() {
  return (
    <g transform={`translate(${SLOTS["espresso-machine"]},150)`}>
      <rect x="-20" y="-36" width="40" height="36" rx="6" fill={BERRY} />
      <rect x="-14" y="-30" width="28" height="8" rx="3" fill={PINK} />
      <circle cx="10" cy="-12" r="3" fill="#fff" />
      <rect x="-9" y="-13" width="12" height="13" rx="3" fill="#fff" />
    </g>
  );
}

function Grinder() {
  return (
    <g transform={`translate(${SLOTS["pro-grinder"]},150)`}>
      <path d="M-13 -46 h26 l-6 24 h-14 z" fill="#fff" stroke={BERRY} strokeWidth="2" />
      <rect x="-13" y="-22" width="26" height="22" rx="4" fill={PINK} stroke={BERRY} strokeWidth="2" />
      <circle cx="0" cy="-11" r="3" fill="#fff" />
    </g>
  );
}

function FilterSet() {
  return (
    <g transform={`translate(${SLOTS["filter-set"]},150)`}>
      <path d="M-17 -36 h34 l-10 17 h-14 z" fill="#fff" stroke={BERRY} strokeWidth="2" />
      <rect x="-11" y="-19" width="22" height="19" rx="4" fill="#fff" stroke={BERRY} strokeWidth="2" />
      <path d="M11 -14 q9 0 9 6 q0 6 -9 6" fill="none" stroke={BERRY} strokeWidth="2.5" />
    </g>
  );
}

// A dashed outline for equipment the player has not bought yet.
function EmptySlot({ x }) {
  return (
    <g opacity="0.4">
      <rect x={x - 19} y="116" width="38" height="34" rx="7" fill="none" stroke={BERRY} strokeWidth="1.5" strokeDasharray="4 3" />
      <text x={x} y="138" textAnchor="middle" fontSize="13" fill={BERRY}>?</text>
    </g>
  );
}

function Table({ x }) {
  return (
    <g transform={`translate(${x},214)`}>
      <rect x="-3" y="2" width="6" height="22" fill={BERRY} />
      <ellipse cx="0" cy="26" rx="14" ry="4" fill={BERRY} />
      <ellipse cx="0" cy="0" rx="27" ry="8" fill="#fff" stroke={BERRY} strokeWidth="2" />
    </g>
  );
}

function Customer({ order, outcome }) {
  const mood = outcome === "served" ? "❤️" : outcome === "walkout" ? "💢" : DRINK_ICON[order.recipe.id];
  return (
    <g key={order.id} className="cust-wrap">
      <g className={`cust cust-${outcome}`}>
        <circle cx="305" cy="122" r="16" fill="#fff" stroke={BERRY} strokeWidth="2" />
        <text x="305" y="128" textAnchor="middle" fontSize="18">{mood}</text>
        <text x="305" y="172" textAnchor="middle" fontSize="44">{order.customer.emoji}</text>
      </g>
      {outcome === "served" && (
        <text className="drink-on-table" x="320" y="212" fontSize="16">{DRINK_ICON[order.recipe.id]}</text>
      )}
    </g>
  );
}

export default function CafeScene({ owned, level, order, outcome }) {
  const has = (key) => owned.includes(key);
  const wallpaper = has("pink-wallpaper");

  const features = [
    wallpaper && "pink wallpaper",
    has("better-kettle") && "a pink kettle",
    has("espresso-machine") && "an espresso machine",
    has("pro-grinder") && "a pro grinder",
    has("filter-set") && "a filter coffee set",
    has("extra-table") && "an extra table",
    level >= 2 && "plants on the windowsill",
  ].filter(Boolean);

  return (
    <div className="scene">
      <svg
        viewBox="0 0 400 250"
        role="img"
        aria-label={`Your cafe at level ${level}${features.length ? `, with ${features.join(", ")}` : ""}.`}
      >
        <defs>
          <pattern id="bb-stripes" width="24" height="10" patternUnits="userSpaceOnUse">
            <rect width="24" height="10" fill="#ffeaf2" />
            <rect width="12" height="10" fill="#ffd3e4" />
          </pattern>
        </defs>

        {/* walls and floor */}
        <rect width="400" height="175" fill={wallpaper ? "url(#bb-stripes)" : "#f3e9e4"} />
        <rect y="175" width="400" height="75" fill="#f1d9c6" />
        {[195, 215, 235].map((y) => (
          <line key={y} x1="0" x2="400" y1={y} y2={y} stroke="#e4c4aa" strokeWidth="1.5" />
        ))}

        {/* window and what grows in it */}
        <rect x="40" y="14" width="110" height="70" rx="8" fill="#e3f4fb" stroke={BERRY} strokeWidth="3" />
        <line x1="95" y1="14" x2="95" y2="84" stroke={BERRY} strokeWidth="2" />
        <line x1="40" y1="49" x2="150" y2="49" stroke={BERRY} strokeWidth="2" />
        <rect x="34" y="84" width="122" height="8" rx="3" fill={BERRY} />

        {level >= 2 && (
          <g transform="translate(62,84)">
            <path d="M-10 0 l3 -13 h14 l3 13 z" fill={TERRACOTTA} />
            <ellipse cx="-5" cy="-21" rx="5" ry="10" fill={LEAF_LIGHT} transform="rotate(-25 -5 -21)" />
            <ellipse cx="5" cy="-21" rx="5" ry="10" fill={LEAF} transform="rotate(25 5 -21)" />
          </g>
        )}
        {level >= 3 &&
          [104, 130].map((x) => (
            <g key={x} transform={`translate(${x},84)`}>
              <path d="M0 0 v-22" stroke={LEAF} strokeWidth="3" />
              <circle cx="0" cy="-27" r="8" fill={PINK} />
              <circle cx="0" cy="-27" r="3" fill="#ffd54f" />
            </g>
          ))}
        {level >= 4 && (
          <g>
            <line x1="95" y1="0" x2="95" y2="22" stroke={BERRY} strokeWidth="2" />
            <path d="M84 22 h22 l-4 11 h-14 z" fill={TERRACOTTA} />
            <path d="M88 33 q-7 14 -3 28 M95 33 q0 18 0 34 M102 33 q7 13 3 24" fill="none" stroke={LEAF} strokeWidth="3" strokeLinecap="round" />
            <circle cx="85" cy="61" r="4" fill={PINK} />
            <circle cx="95" cy="67" r="4" fill={PINK} />
            <circle cx="105" cy="57" r="4" fill={PINK} />
          </g>
        )}

        {/* sign and shelf */}
        <rect x="205" y="36" width="155" height="36" rx="10" fill={PINK} />
        <text x="282" y="60" textAnchor="middle" fontSize="18" fontWeight="600" fill="#fff" fontFamily="Fredoka, sans-serif">
          Brew &amp; Bloom
        </text>
        {level >= 5 && (
          <text x="282" y="33" textAnchor="middle" fontSize="12">🌸 🌸 🌸 🌸 🌸 🌸</text>
        )}
        <rect x="205" y="100" width="155" height="5" rx="2" fill={BERRY} />
        {[220, 245, 270, 295].map((x, i) => (
          <rect key={x} x={x} y="90" width="12" height="10" rx="3" fill={i % 2 ? "#fff" : PINK} stroke={BERRY} strokeWidth="1.5" />
        ))}

        {/* tables */}
        <Table x={305} />
        {has("extra-table") && <Table x={365} />}

        {/* counter */}
        <rect x="20" y="162" width="250" height="62" rx="8" fill="#fff" stroke={BERRY} strokeWidth="2.5" />
        <rect x="14" y="150" width="262" height="14" rx="6" fill={PINK} stroke={BERRY} strokeWidth="2.5" />
        <Kettle upgraded={has("better-kettle")} />
        {has("espresso-machine") ? <EspressoMachine /> : <EmptySlot x={SLOTS["espresso-machine"]} />}
        {has("pro-grinder") ? <Grinder /> : <EmptySlot x={SLOTS["pro-grinder"]} />}
        {has("filter-set") ? <FilterSet /> : <EmptySlot x={SLOTS["filter-set"]} />}

        {/* Kuro the cafe cat */}
        <text x="64" y="244" fontSize="24" aria-hidden="true">🐈‍⬛</text>

        {order && <Customer key={order.id} order={order} outcome={outcome} />}
      </svg>
    </div>
  );
}
