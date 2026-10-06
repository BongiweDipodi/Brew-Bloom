import { useEffect, useRef, useState } from "react";

// Shows who is waiting, what they want, and how patient they still are.
// Remount with a new `key` for each customer.
export default function Customer({ customer, drinkName, patienceSec, paused, onWalkout }) {
  const [left, setLeft] = useState(patienceSec);
  const fired = useRef(false);
  const walkoutRef = useRef(onWalkout);

  useEffect(() => {
    walkoutRef.current = onWalkout;
  });

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => setLeft((l) => Math.max(0, l - 0.1)), 100);
    return () => clearInterval(timer);
  }, [paused]);

  useEffect(() => {
    if (left <= 0 && !paused && !fired.current) {
      fired.current = true;
      walkoutRef.current();
    }
  }, [left, paused]);

  const share = left / patienceSec;
  const mood = share > 0.5 ? "calm" : share > 0.25 ? "restless" : "angry";

  return (
    <div className="customer">
      <div className="customer-face" aria-hidden="true">{customer.emoji}</div>
      <div className="customer-body">
        <p className="customer-name">{customer.name}</p>
        <p className="customer-say">{customer.say(drinkName)}</p>
        <div
          className={`patience patience-${mood}`}
          role="progressbar"
          aria-label="Customer patience"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(share * 100)}
        >
          <div className="patience-fill" style={{ width: `${share * 100}%` }} />
        </div>
      </div>
    </div>
  );
}
