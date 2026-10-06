async function request(path, options) {
  const res = await fetch(`/api${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Request failed");
  return data;
}

const post = (path, body) =>
  request(path, { method: "POST", body: JSON.stringify(body ?? {}) });

export const createPlayer = (name) => post("/players", { name });
export const getPlayer = (id) => request(`/players/${id}`);
export const getUpgrades = () => request("/upgrades");
export const serveOrder = (id, body) => post(`/players/${id}/serve`, body);
export const walkout = (id) => post(`/players/${id}/walkout`);
export const buyUpgrade = (id, key) => post(`/players/${id}/upgrades`, { key });
