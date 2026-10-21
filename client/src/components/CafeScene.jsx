import { Canvas } from "@react-three/fiber";
import { OrbitControls, RoundedBox, Text } from "@react-three/drei";
import { Suspense } from "react";

const BERRY = "#5a1a3a";
const PINK = "#ff4d8d";
const LEAF = "#46a877";
const LEAF_LIGHT = "#5bbf8a";
const TERRACOTTA = "#d98c6a";
const WALL = "#f8ebf0";
const FLOOR = "#f1d9c6";
const FLOOR_DARK = "#dfb892";
const SHELF = "#fce2ee";

const DRINK_ICON = { tea: "🍵", latte: "☕", filter: "☕" };

function Counter() {
  return (
    <group position={[0, -0.8, 0.2]}>
      <RoundedBox args={[5.2, 0.8, 1.6]} radius={0.1} position={[0, 0, 0]}>
        <meshStandardMaterial color="#fff" />
      </RoundedBox>
      <RoundedBox args={[5.4, 0.2, 1.8]} radius={0.06} position={[0, 0.52, 0]}>
        <meshStandardMaterial color={PINK} />
      </RoundedBox>
      <mesh position={[0, 0.8, 0.7]}>
        <boxGeometry args={[5.1, 0.1, 0.1]} />
        <meshStandardMaterial color={BERRY} />
      </mesh>
    </group>
  );
}

function Table({ x, z }) {
  return (
    <group position={[x, -0.6, z]}>
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.9, 0.9, 0.16, 20]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.9, 12]} />
        <meshStandardMaterial color={BERRY} />
      </mesh>
    </group>
  );
}

function Rug() {
  return (
    <mesh position={[0, -1.1, 1.2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[4.6, 2.2]} />
      <meshStandardMaterial color="#f9d7e6" />
    </mesh>
  );
}

function Plant({ x, z }) {
  return (
    <group position={[x, -0.8, z]}>
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.8, 10]} />
        <meshStandardMaterial color={TERRACOTTA} />
      </mesh>
      <mesh position={[0, 1.1, 0]} castShadow>
        <sphereGeometry args={[0.35, 18, 18]} />
        <meshStandardMaterial color={LEAF} />
      </mesh>
      <mesh position={[0.22, 1.32, 0.04]} castShadow>
        <sphereGeometry args={[0.25, 18, 18]} />
        <meshStandardMaterial color={LEAF_LIGHT} />
      </mesh>
      <mesh position={[-0.2, 1.18, -0.12]} castShadow>
        <sphereGeometry args={[0.2, 18, 18]} />
        <meshStandardMaterial color={LEAF} />
      </mesh>
    </group>
  );
}

function Sign() {
  return (
    <group position={[0, 1.1, -1.8]}>
      <RoundedBox args={[3.4, 0.8, 0.18]} radius={0.08}>
        <meshStandardMaterial color={PINK} />
      </RoundedBox>
      <Text position={[0, 0, 0.12]} fontSize={0.28} color="#fff" anchorX="center" anchorY="middle">
        Brew & Bloom
      </Text>
    </group>
  );
}

function Shelf() {
  return (
    <group position={[0, 0.8, -1.2]}>
      <RoundedBox args={[3.6, 0.12, 0.2]} radius={0.04} position={[0, 0, 0]}>
        <meshStandardMaterial color={BERRY} />
      </RoundedBox>
      {[ -1.2, -0.4, 0.4, 1.2 ].map((x) => (
        <mesh key={x} position={[x, -0.14, 0.1]}>
          <boxGeometry args={[0.8, 0.26, 0.12]} />
          <meshStandardMaterial color={x % 2 ? "#fff" : PINK} />
        </mesh>
      ))}
    </group>
  );
}

function Kettle({ upgraded }) {
  const color = upgraded ? PINK : "#d9d1d5";
  return (
    <group position={[-2.2, -0.05, 0.2]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.34, 0.34, 0.8, 18]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0.5, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.7, 12]} />
        <meshStandardMaterial color={BERRY} />
      </mesh>
      {upgraded && (
        <mesh position={[0.1, 0.8, 0]}>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshStandardMaterial color="#ffd166" emissive="#ffd166" emissiveIntensity={0.4} />
        </mesh>
      )}
    </group>
  );
}

function Machine({ color, position }) {
  return (
    <group position={position}>
      <RoundedBox args={[0.8, 0.8, 0.8]} radius={0.08} castShadow>
        <meshStandardMaterial color={color} />
      </RoundedBox>
      <mesh position={[0.2, 0.2, 0.2]}>
        <boxGeometry args={[0.28, 0.3, 0.2]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
    </group>
  );
}

function Equipment({ owned }) {
  return (
    <group>
      <Kettle upgraded={owned.includes("better-kettle")} />
      {owned.includes("espresso-machine") ? <Machine color={BERRY} position={[0.3, -0.05, 0.2]} /> : <EmptySlot position={[0.3, -0.05, 0.2]} />}
      {owned.includes("pro-grinder") ? <Machine color={PINK} position={[1.3, -0.05, 0.2]} /> : <EmptySlot position={[1.3, -0.05, 0.2]} />}
      {owned.includes("filter-set") ? <Machine color="#fff" position={[2.3, -0.05, 0.2]} /> : <EmptySlot position={[2.3, -0.05, 0.2]} />}
    </group>
  );
}

function EmptySlot({ position }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.72, 0.62, 0.72]} />
        <meshStandardMaterial color="#f0d9e2" transparent opacity={0.6} />
      </mesh>
      <Text position={[0, 0.05, 0.38]} fontSize={0.24} color={BERRY} anchorX="center" anchorY="middle">
        ?
      </Text>
    </group>
  );
}

function CustomerModel({ order, outcome }) {
  const mood = outcome === "served" ? "❤️" : outcome === "walkout" ? "💢" : DRINK_ICON[order.recipe.id];

  return (
    <group position={[1.8, -0.1, 1.15]}>
      <mesh position={[0, -0.45, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.6, 18]} />
        <meshStandardMaterial color="#d7aa92" transparent opacity={0.3} />
      </mesh>
      <mesh position={[0, 0.7, 0]} castShadow>
        <sphereGeometry args={[0.48, 18, 18]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      <Text position={[0, 0.74, 0.03]} fontSize={0.26} color={BERRY} anchorX="center" anchorY="middle">
        {mood}
      </Text>
      <Text position={[0, -0.15, 0.03]} fontSize={0.9} color={BERRY} anchorX="center" anchorY="middle">
        {order.customer.emoji}
      </Text>
    </group>
  );
}

function CafeInterior({ owned, level, order, outcome }) {
  const has = (key) => owned.includes(key);
  const wallpaper = has("pink-wallpaper");

  return (
    <>
      <color attach="background" args={["#fff8fb"]} />
      <ambientLight intensity={1.3} color="#fff7ef" />
      <directionalLight position={[4, 6, 2]} intensity={1.8} color="#fff1d6" castShadow />
      <spotLight position={[0, 5, 0]} angle={0.38} penumbra={0.7} intensity={1.2} color="#ffe9a8" />

      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
        <planeGeometry args={[16, 16]} />
        <meshStandardMaterial color={FLOOR} />
      </mesh>

      <mesh position={[0, 1.35, -2.9]} receiveShadow>
        <boxGeometry args={[8.5, 5.8, 0.18]} />
        <meshStandardMaterial color={wallpaper ? "#ffd5e8" : WALL} />
      </mesh>

      <mesh position={[-4.24, 1.2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[6.4, 5.5, 0.18]} />
        <meshStandardMaterial color="#f5dfe9" />
      </mesh>

      <mesh position={[1.5, 2.4, -2.6]} receiveShadow>
        <boxGeometry args={[4.3, 0.14, 0.14]} />
        <meshStandardMaterial color={BERRY} />
      </mesh>

      <Sign />
      <Shelf />
      <Counter />
      <Equipment owned={owned} />
      {has("tea-rug") && <Rug />}
      <Table x={2.7} z={1.2} />
      {has("extra-table") && <Table x={-2.8} z={1.4} />}
      {has("gallery-pictures") && (
        <group position={[0, 1.7, -2.7]}>
          {[-1.2, -0.4, 0.4, 1.2].map((x) => (
            <mesh key={x} position={[x, 0, 0.12]}>
              <boxGeometry args={[0.7, 0.65, 0.08]} />
              <meshStandardMaterial color="#fffafc" />
            </mesh>
          ))}
        </group>
      )}
      {has("fairy-lights") && (
        <group position={[0, 2.8, -2.5]}>
          {[-2.8, -1.8, -0.8, 0.2, 1.2, 2.2, 3.2].map((x) => (
            <mesh key={x} position={[x, 0, 0]}>
              <sphereGeometry args={[0.06, 10, 10]} />
              <meshStandardMaterial emissive="#ffe9a8" emissiveIntensity={1.1} color="#ffe9a8" />
            </mesh>
          ))}
        </group>
      )}

      {level >= 2 && (
        <group position={[-2.8, 0.8, -2.3]}>
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.8, 10]} />
            <meshStandardMaterial color={TERRACOTTA} />
          </mesh>
          <mesh position={[0, 1.1, 0]}>
            <sphereGeometry args={[0.34, 20, 20]} />
            <meshStandardMaterial color={LEAF_LIGHT} />
          </mesh>
        </group>
      )}

      <Plant x={-2.9} z={-1.9} />
      <Plant x={-3.4} z={-1.4} />
      {order && <CustomerModel order={order} outcome={outcome} />}
    </>
  );
}

export default function CafeScene({ owned, level, order, outcome }) {
  const has = (key) => owned.includes(key);
  const wallpaper = has("pink-wallpaper");

  const features = [
    wallpaper && "pink wallpaper",
    has("better-kettle") && "a pink kettle",
    has("tea-rug") && "a cozy rug",
    has("gallery-pictures") && "framed pictures",
    has("fairy-lights") && "soft fairy lights",
    has("espresso-machine") && "an espresso machine",
    has("pro-grinder") && "a pro grinder",
    has("filter-set") && "a filter coffee set",
    has("extra-table") && "an extra table",
    level >= 2 && "plants on the windowsill",
  ].filter(Boolean);

  return (
    <div className="scene" style={{ height: 320 }}>
      <Canvas shadows camera={{ position: [0, 1.8, 7.5], fov: 42 }}>
        <Suspense fallback={null}>
          <CafeInterior owned={owned} level={level} order={order} outcome={outcome} />
        </Suspense>
        <OrbitControls enablePan={false} enableZoom={false} maxPolarAngle={Math.PI / 2.2} minPolarAngle={Math.PI / 3.2} />
      </Canvas>
      <div className="sr-only" aria-live="polite">
        {`Your cafe at level ${level}${features.length ? `, with ${features.join(", ")}` : ""}.`}
      </div>
    </div>
  );
}
