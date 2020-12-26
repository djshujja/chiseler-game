const io = require("socket.io")({
  cors: {
    origin: "http://localhost:5500",
  },
});

const { emit } = require("process");
const { initGame, gameLoop, getUpdateVelocity } = require("./game");
const { makeid } = require("./utils");

const state = {};
const clientRooms = {};

io.on("connection", (client) => {
  client.on("keydown", handleKeydown);
  client.on("newGameNow", handleNewGame);
  client.on("joinGame", handleJoinGame);

  function handleNewGame() {
    let roomName = makeid(5);
    clientRooms[client.id] = roomName;
    client.emit("gameCode", roomName);
    state[roomName] = initGame();
    client.join(roomName);
    client.playerNumber = 1;
    client.emit("init", 1);
  }

  function handleJoinGame(gameCode) {
    const room = io.sockets.adapter.rooms[gameCode];
    // console.log(room);
    let allUsers;

    if (room) {
      allUsers = room.sockets;
    }

    let numClients = 0;

    if (allUsers) {
      numClients = Object.keys(allUsers).length;
    }

    // if (numClients === 0) {
    //   console.log("Unknown Game");
    //   return;
    // } else if (numClients > 1) {
    //   console.log("Too Many Players");
    //   return;
    // }

    clientRooms[client.id] = gameCode;
    client.join(gameCode);

    client.playerNumber = 2;

    client.emit("init", 2);

    startGame(gameCode);
  }

  client.emit("init", { data: "Hello Socket Io!" });
  client.on("newGame", handleNewGame);

  function handleKeydown(keyCode) {
    const roomName = clientRooms[client.id];

    if (!roomName) {
      console.log("No Room Name");
      return;
    }

    try {
      keyCode = parseInt(keyCode);
    } catch (e) {
      console.error(e);
      return;
    }
    const body_x = state[roomName].players[client.playerNumber - 1].body.x;
    const body_y = state[roomName].players[client.playerNumber - 1].body.y;
    const vel = getUpdateVelocity(keyCode, body_x, body_y);

    if (vel) {
      state[roomName].players[client.playerNumber - 1].body = vel;
      // state.player.vel = vel;
    }
  }

  // startGame(client, state);
});

function startGame(roomName) {
  const intervalId = setInterval(() => {
    const winner = gameLoop(state[roomName]);

    if (!winner) {
      emitGameState(roomName, state[roomName]);

      // client.emit("gameState", JSON.stringify(state));
    } else {
      emitGameOver(roomName, winner);
      state[roomName] = null;
      // client.emit("gameOver");
      clearInterval(intervalId);
    }
  }, 1000 / 10);
}

function emitGameState(roomName, state) {
  io.sockets.in(roomName).emit("gameState", JSON.stringify(state));
}

function emitGameOver(roomName, winner) {
  io.sockets.in(roomName).emit("gameOver", JSON.stringify({ winner }));
}

io.listen(3000);
