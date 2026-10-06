import { useState } from "react";

export default function Welcome({ onStart, error }) {
  const [name, setName] = useState("");

  function submit(e) {
    e.preventDefault();
    if (name.trim()) onStart(name.trim());
  }

  return (
    <form className="welcome" onSubmit={submit}>
      <h1>Brew &amp; Bloom</h1>
      <p>Run a tiny cafe. Serve customers, earn coins, and grow your shop.</p>
      <label htmlFor="cafe-name">Your name</label>
      <input
        id="cafe-name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={30}
        autoFocus
      />
      <button type="submit" disabled={!name.trim()}>Open the cafe</button>
      {error && <p className="error" role="alert">{error}</p>}
    </form>
  );
}
