const BG_COLOR = "#231f20";
const PLAYER_COLOR = "#c2c2c2";

const gameScreen = document.getElementById("gameScreen");
const initialScreen = document.getElementById("initialScreen");
const newGameBtn = document.getElementById("newGameButton");
const joinGameBtn = document.getElementById("joinGameButton");
const gameCodeInput = document.getElementById("gameCodeInput");
const gameCodeDisplay = document.getElementById("gameCodeDisplay");
const socket = io("http://localhost:3000/");
let canvas, ctx;
let playerNumber;

newGameBtn.addEventListener("click", newGame);
joinGameBtn.addEventListener("click", joinGame);

socket.on("init", handleInit);
socket.on("gameState", handleGameState);
socket.on("gameCode", handleGameCode);

function newGame() {
  socket.emit("newGameNow");
  init();
}

function joinGame() {
  const code = gameCodeInput.value;
  socket.emit("joinGame", code);
  init();
}
function handleInit(number) {
  playerNumber = number;
}

function init() {
  initialScreen.style.display = "none";
  gameScreen.style.display = "block";
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  canvas.width = canvas.height = 500;

  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  document.addEventListener("keydown", keydown);
}

let gameState = {
  player: {
    pos: {
      x: 5,
      y: 10,
    },
    vel: {
      x: 0,
      y: 0,
    },
    body: {
      x: 5,
      y: 10,
    },
  },
  gridsize: 20,
};

function keydown(e) {
  socket.emit("keydown", e.keyCode);
}

function paintGame(state) {
  // console.log("paintGame");
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const size = state.gridsize;

  paintPlayer(state.players[0], size, PLAYER_COLOR);
  paintPlayer(state.players[1], size, "red");
}

function paintPlayer(playerState, size, color) {
  // console.log("paintPlayer");
  const body = playerState.body;

  ctx.fillStyle = color;

  ctx.fillRect(body.x * size, body.y * size, size, size);
}

// requestAnimationFrame(() => paintGame(gameState));
function handleGameState(gameState) {
  gameState = JSON.parse(gameState);

  paintGame(gameState);
}

function handleGameCode(gameCode) {
  gameCodeDisplay.innerText = gameCode;
}
