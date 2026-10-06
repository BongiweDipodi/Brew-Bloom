import { useMemo, useRef, useState } from "react";

function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Give this component a `key` that changes per order so it resets cleanly.
export default function TapBrew({ recipe, onComplete, showHint = true }) {
  const [done, setDone] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [wrongId, setWrongId] = useState(null);
  const startedAt = useRef(Date.now());
  const buttons = useMemo(() => shuffle(recipe.steps), [recipe]);
  const finished = done === recipe.steps.length;
  const stars = 3 - Math.min(mistakes, 2);

  function tap(step) {
    if (finished) return;
    if (step.id === recipe.steps[done].id) {
      const next = done + 1;
      setDone(next);
      if (next === recipe.steps.length) {
        onComplete({ mistakes, timeMs: Date.now() - startedAt.current });
      }
    } else {
      setMistakes((m) => m + 1);
      setWrongId(step.id);
      setTimeout(() => setWrongId(null), 350);
    }
  }

  return (
    <section className="tb" aria-label={`Make a ${recipe.name}`}>
      <h2 className="tb-title">{recipe.name}</h2>

      {showHint && (
        <ol className="tb-ticket">
          {recipe.steps.map((s, i) => (
            <li key={s.id} className={i < done ? "is-done" : i === done ? "is-next" : ""}>
              {s.label}
            </li>
          ))}
        </ol>
      )}

      <div className="tb-grid">
        {buttons.map((s) => {
          const used = recipe.steps.findIndex((r) => r.id === s.id) < done;
          return (
            <button
              key={s.id}
              className={`tb-btn ${wrongId === s.id ? "is-wrong" : ""}`}
              onClick={() => tap(s)}
              disabled={used || finished}
            >
              <span className="tb-icon" aria-hidden="true">{s.icon}</span>
              {s.label}
            </button>
          );
        })}
      </div>

      <p className="tb-status" role="status">
        {finished
          ? `Done! ${"★".repeat(stars)}${"☆".repeat(3 - stars)}`
          : `Step ${done + 1} of ${recipe.steps.length}. Mistakes: ${mistakes}`}
      </p>
    </section>
  );
}
