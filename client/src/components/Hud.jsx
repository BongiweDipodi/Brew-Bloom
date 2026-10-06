export default function Hud({ state }) {
  const { player, level, levelBounds } = state;
  const span = levelBounds.to - levelBounds.from;
  const progress = Math.min(100, ((player.reputation - levelBounds.from) / span) * 100);

  return (
    <div className="hud">
      <div className="hud-item">
        <span className="hud-label">Coins</span>
        <span className="hud-value">🪙 {player.coins}</span>
      </div>
      <div className="hud-item hud-level">
        <span className="hud-label">Level {level}</span>
        <div className="xp" role="progressbar" aria-label="Progress to next level" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
          <div className="xp-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="hud-note">{levelBounds.to - player.reputation} reputation to level {level + 1}</span>
      </div>
      <div className="hud-item">
        <span className="hud-label">Served</span>
        <span className="hud-value">{player.servedCount}</span>
      </div>
    </div>
  );
}
