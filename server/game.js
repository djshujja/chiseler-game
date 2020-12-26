const GRID_SIZE = 20;

const gameState = {
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
  gridsize: GRID_SIZE,
};

function gameLoop(state) {
  if (!state) {
    return;
  }

  const player = state.player;

  player.pos.x = player.vel.x;
  player.pos.y = player.vel.y;

  return false;
}

function getUpdateVelocity(keyCode) {
  switch (keyCode) {
    case 38: {
      //up
      gameState.player.body.y += -1;
      break;
    }
    case 40: {
      //down
      gameState.player.body.y += 1;
      break;
    }
    case 37: {
      //left
      gameState.player.body.x += -1;
      break;
    }
    case 39: {
      //right
      gameState.player.body.x += 1;
      break;
    }
  }
}

module.exports = {
  gameState,
  getUpdateVelocity,
  gameLoop,
};
