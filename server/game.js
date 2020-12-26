const GRID_SIZE = 20;

function initGame() {
  const state = createGameState();
  return state;
}

function createGameState() {
  return {
    players: [
      {
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
      {
        pos: {
          x: 18,
          y: 10,
        },
        vel: {
          x: 0,
          y: 0,
        },
        body: {
          x: 8,
          y: 18,
        },
      },
    ],
    gridsize: GRID_SIZE,
  };
}

function gameLoop(state) {
  if (!state) {
    return;
  }

  const player = state.players[0];
  const player2 = state.players[1];

  player.pos.x = player.vel.x;
  player.pos.y = player.vel.y;

  player2.pos.x = player2.vel.x;
  player2.pos.y = player2.vel.y;

  return false;
}

function getUpdateVelocity(keyCode, body_x, body_y) {
  switch (keyCode) {
    case 38: {
      //up
      // gameState.player.body.y += -1;

      return { x: body_x, y: body_y - 1 };
      break;
    }
    case 40: {
      //down
      // return (gameState.player.body.y += 1);
      return { x: body_x, y: body_y + 1 };
      break;
    }
    case 37: {
      //left
      // return (gameState.player.body.x += -1);
      return { x: body_x - 1, y: body_y };
      break;
    }
    case 39: {
      //right
      // gameState.player.body.x += 1;
      return { x: body_x + 1, y: body_y };
      break;
    }
  }
}

module.exports = {
  getUpdateVelocity,
  gameLoop,
  initGame,
};
