const io = require("socket.io")({
  cors: {
    origin: "http://localhost:5500",
  },
});

const { gameState, gameLoop, getUpdateVelocity } = require("./game");

io.on("connection", (client) => {
  console.log("connected!");
  client.on("keydown", handleKeydown);
  client.emit("init", { data: "Hello Socket Io!" });
  client.on("newGame", handleNewGame);

  const state = gameState;
  function handleNewGame() {}

  function handleKeydown(keyCode) {
    try {
      keyCode = parseInt(keyCode);
    } catch (e) {
      console.error(e);
      return;
    }

    const vel = getUpdateVelocity(keyCode);

    if (vel) {
      state.player.vel = vel;
    }
  }

  startGame(client, state);
});

function startGame(client, state) {
  const intervalId = setInterval(() => {
    const winner = gameLoop(state);
    if (!winner) {
      client.emit("gameState", JSON.stringify(state));
    } else {
      client.emit("gameOver");
      clearInterval(intervalId);
    }
  }, 1000 / 10);
}

io.listen(3000);
