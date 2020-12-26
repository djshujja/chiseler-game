const BG_COLOR = "#231f20";
const PLAYER_COLOR = "#c2c2c2";

const gameScreen = document.getElementById("gameScreen");

let canvas, ctx;

const socket = io("http://localhost:3000/");

socket.on("init", handleInit);
socket.on("gameState", handleGameState);

function handleInit(msg) {
  console.log(msg);
}

function init() {
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
  // switch (e.keyCode) {
  //   case 38: {
  //     gameState.player.body.y += -1;
  //     break;
  //   }
  //   case 40: {
  //     //down
  //     gameState.player.body.y += 1;
  //     break;
  //   }
  //   case 37: {
  //     //left
  //     gameState.player.body.x += -1;
  //     break;
  //   }
  //   case 39: {
  //     //right
  //     gameState.player.body.x += 1;
  //     break;
  //   }
  // }
  // paintGame(gameState);
  socket.emit("keydown", e.keyCode);
}

init();

function paintGame(state) {
  // console.log("paintGame");
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const size = state.gridsize;

  paintPlayer(state.player, size, PLAYER_COLOR);
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
