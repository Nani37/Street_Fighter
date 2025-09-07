const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
});

let gameState = {
    p1_health: 100,
    p2_health: 100,
    timer: 60,
    winner: null,
};

app.get("/game", (req, res) => {
  res.json(gameState);
});

app.post("/game", (req, res) => {
    gameState = { ...gameState, ...req.body };
  res.json({ message:"Game state updated", gameState });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});