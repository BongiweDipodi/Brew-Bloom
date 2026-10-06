import "dotenv/config";
import express from "express";
import cors from "cors";
import gameRoutes from "./routes/game.js";

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api", gameRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong" });
});

const port = process.env.PORT ?? 4000;
app.listen(port, () => console.log(`Brew & Bloom API running on http://localhost:${port}`));
