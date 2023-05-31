// Selecting elements from the DOM
const scoreEL = document.querySelector("#scoreEL");
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

// Setting canvas width and height
canvas.width = 1024;
canvas.height = 576;

// Creating instances of various classes
let player = new Player();
let projectiles = [];
let grids = [];
let invaderProjectiles = [];
let particles = [];

let gridSpeedModifier = 1;

let keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  space: {
    pressed: false,
  },
  touchLeft: {
    pressed: false,
  },
  touchRight: {
    pressed: false,
  },
  touchShoot: {
    pressed: false,
  },
};

let frames = 0;
let game = {
  over: false,
  active: false,
};

let score = 0;
let fps = 60;
let fpsInterval = 1000 / fps;
let msPrev = window.performance.now();

function init() {
  player = new Player();
  projectiles = [];
  grids = [];
  invaderProjectiles = [];
  particles = [];
  gridSpeedModifier = 1;
  keys = {
    a: {
      pressed: false,
    },
    d: {
      pressed: false,
    },
    space: {
      pressed: false,
    },
    touchLeft: {
      pressed: false,
    },
    touchRight: {
      pressed: false,
    },
    touchShoot: {
      pressed: false,
    },
  };

  frames = 0;
  game = {
    over: false,
    active: true,
  };
  score = 0;
  scoreEL.innerHTML = score.toLocaleString();

  for (let i = 0; i < 100; i++) {
    particles.push(
      new Particle({
        position: {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
        },
        velocity: {
          x: 0,
          y: 0.25,
        },
        radius: Math.random() * 2,
        color: "white",
      })
    );
  }

  createEnemyGrid();
}

function createEnemyGrid() {
  grids.push(new Grid());
}

// Manually create the first enemy grid
createEnemyGrid();

// Creating particles for stars
for (let i = 0; i < 100; i++) {
  particles.push(
    new Particle({
      position: {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
      },
      velocity: {
        x: 0,
        y: 0.25,
      },
      radius: Math.random() * 2,
      color: "white",
    })
  );
}

// Function to create particles for visual effects
function createParticles({ object, color, fades }) {
  for (let i = 0; i < 15; i++) {
    particles.push(
      new Particle({
        position: {
          x: object.position.x + object.width / 2,
          y: object.position.y + object.height / 2,
        },
        velocity: {
          x: (Math.random() - 0.5) * 2,
          y: (Math.random() - 0.5) * 2,
        },
        radius: Math.random() * 5,
        color: color || "#AB14FF",
        fades,
      })
    );
  }
}

// Function to end the game
// Makes player disappear
function endGame() {
  audio.gameOver.play();
  player.opacity = 0;
  game.over = true;
  player.destroy();

  // stops game altogether
  setTimeout(() => {
    game.active = false;
    audio.backgroundMusic.stop();
    document.querySelector("#restartScreen").style.display = "flex";
    document.querySelector("#finalScore").innerHTML = score.toLocaleString();
  }, 0);

  // stops player particles from generating
  createParticles({
    object: player,
    color: "#E7C4C5",
    fades: true,
  });
}

// Animation function
function animate() {
  if (!game.active) return;
  requestAnimationFrame(animate);

  const msNow = window.performance.now();
  const elapsed = msNow - msPrev;

  if (elapsed < fpsInterval) return;

  msPrev = msNow - (elapsed % fpsInterval);

  // Clearing the canvas
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  // Updating and drawing player
  player.update();
  for (let i = (player.particles && player.particles.length) - 1; i >= 0; i--) {
    const particle = player.particles[i];
    particle.update();
  }

  // Updating and drawing particles
  particles.forEach((particle, i) => {
    if (particle.position.y - particle.radius >= canvas.height) {
      particle.position.x = Math.random() * canvas.width;
      particle.position.y = -particle.radius;
    }
    if (particle.opacity <= 0) {
      setTimeout(() => {
        particles.splice(i, 1);
      }, 0);
    } else {
      particle.update();
    }
  });

  // Updating and drawing invader projectiles
  invaderProjectiles.forEach((invaderProjectile, index) => {
    if (
      invaderProjectile.position.y + invaderProjectile.height >=
      canvas.height
    ) {
      setTimeout(() => {
        invaderProjectiles.splice(index, 1);
      }, 0);
    } else invaderProjectile.update();

    if (
      invaderProjectile.position.y + invaderProjectile.height >=
        player.position.y &&
      invaderProjectile.position.x + invaderProjectile.width >=
        player.position.x &&
      invaderProjectile.position.x <= player.position.x + player.width
    ) {
      setTimeout(() => {
        invaderProjectiles.splice(index, 1);
        endGame();
      }, 0);

      createParticles({
        object: player,
        color: "#E7C4C5",
        fades: true,
      });
    }
  });

  // Updating and drawing projectiles
  projectiles.forEach((projectile, index) => {
    if (projectile.position.y + projectile.radius <= 0) {
      setTimeout(() => {
        projectiles.splice(index, 1);
      }, 0);
    } else {
      projectile.update();
    }
  });

  // Updating and drawing grids
  grids.forEach((grid, gridIndex) => {
    grid.update();

    // Randomly shooting invader projectiles
    if (frames % 100 === 0 && grid.invaders.length > 0) {
      grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(
        invaderProjectiles
      );
    }

    grid.invaders.forEach((invader, i) => {
      invader.update({ velocity: grid.velocity });

      projectiles.forEach((projectile, p) => {
        if (
          projectile.position.y - projectile.radius <=
            invader.position.y + invader.height &&
          projectile.position.x + projectile.radius >= invader.position.x &&
          projectile.position.x - projectile.radius <
            +invader.position.x + invader.width &&
          projectile.position.y + projectile.radius >= invader.position.y
        ) {
          setTimeout(() => {
            const invaderFound = grid.invaders.find(
              (invader2) => invader2 === invader
            );
            const projectileFound = projectiles.find(
              (projectile2) => projectile2 === projectile
            );

            if (invaderFound && projectileFound) {
              score += 100;
              scoreEL.innerHTML = score.toLocaleString();

              // Displaying score labels
              const scoreLabel = document.createElement("label");
              scoreLabel.innerHTML = 100;
              scoreLabel.style.position = "absolute";
              scoreLabel.style.color = "white";
              scoreLabel.style.top = invader.position.y + "px";
              scoreLabel.style.left = invader.position.x + "px";
              scoreLabel.style.userSelect = "none";

              document.querySelector("#parentDiv").appendChild(scoreLabel);

              // Animating score labels
              gsap.to(scoreLabel, {
                opacity: 0,
                y: -30,
                duration: 0.75,
                onComplete: () => {
                  document.querySelector("#parentDiv").removeChild(scoreLabel);
                },
              });

              createParticles({
                object: invader,
                fades: true,
              });

              // Projectile hits an enemy
              audio.explosion.play();
              grid.invaders.splice(i, 1);
              projectiles.splice(p, 1);

              if (grid.invaders.length > 0) {
                const firstInvader = grid.invaders[0];
                const lastInvader = grid.invaders[grid.invaders.length - 1];

                grid.width =
                  lastInvader.position.x -
                  firstInvader.position.x +
                  lastInvader.width;
                grid.position.x = firstInvader.position.x;
              } else {
                setTimeout(() => {
                  createEnemyGrid();
                }, 1000); // Adds a 1 second delay before spawning a new grid of enemies
                audio.gridClear.play();
                grids.splice(gridIndex, 1);
                gridSpeedModifier += 0.1;
              }
            }
          }, 0);
        }
      });
    });
  });

  // Handling player movements based on key presses
  if ((keys.a.pressed || keys.touchLeft.pressed) && player.position.x >= 0) {
    player.velocity.x = -5;
    player.rotation = -0.25;
  } else if (
    (keys.d.pressed || keys.touchRight.pressed) &&
    player.position.x + player.width <= canvas.width
  ) {
    player.velocity.x = 5;
    player.rotation = 0.25;
  } else {
    player.velocity.x = 0;
    player.rotation = 0;
  }

  frames++;
}

function startGame() {
  audio.start.play();
  audio.backgroundMusic.play();
  document.querySelector("#startScreen").style.display = "none";
  document.querySelector("#scoreContainer").style.display = "block";
  init();
  animate();
}

function restartGame() {
  audio.start.play();
  audio.backgroundMusic.play();
  document.querySelector("#restartScreen").style.display = "none";
  document.querySelector("#scoreContainer").style.display = "block";
  init();
  animate();
}

document.querySelector("#startButton").addEventListener("click", startGame);

document.querySelector("#restartButton").addEventListener("click", restartGame);

// Event listeners for keydown and keyup events
addEventListener("keydown", ({ key }) => {
  if (!game.active || game.over) return;

  switch (key) {
    case "a":
    case "ArrowLeft":
      keys.a.pressed = true;
      break;
    case "d":
    case "ArrowRight":
      keys.d.pressed = true;
      break;
    case " ":
      if (!keys.space.pressed) {
        keys.space.pressed = true;
        audio.shoot.play();
        projectiles.push(
          new Projectile({
            position: {
              x: player.position.x + player.width / 2,
              y: player.position.y,
            },
            velocity: {
              x: 0,
              y: -5,
            },
          })
        );
      }
      break;
  }
});

addEventListener("keyup", ({ key }) => {
  if (!game.active || game.over) return;
  switch (key) {
    case "a":
    case "ArrowLeft":
      keys.a.pressed = false;
      player.velocity.x = 0;
      break;
    case "d":
    case "ArrowRight":
      keys.d.pressed = false;
      player.velocity.x = 0;
      break;
    case " ":
      keys.space.pressed = false;
      break;
  }
});

// Touch event listeners
let touchTimer = null;

// Touch event listeners
canvas.addEventListener("touchstart", (event) => {
  if (!game.active || game.over) return;
  event.preventDefault();
  const { pageX } = event.touches[0];

  touchTimer = setTimeout(() => {
    // On long press, move the player
    if (pageX < canvas.width / 2) {
      keys.touchLeft.pressed = true;
    } else {
      keys.touchRight.pressed = true;
    }
    touchTimer = null;
  }, 200); // 200ms delay to distinguish between tap and long press

  // Shoot immediately on touch start
  handleTouchShoot();
});

canvas.addEventListener("touchend", (event) => {
  if (!game.active || game.over) return;
  event.preventDefault();

  // If touchTimer is still valid, it was a quick tap for shooting
  if (touchTimer) {
    clearTimeout(touchTimer);
    touchTimer = null;
  } else {
    // Otherwise, it was a long press for moving
    keys.touchLeft.pressed = false;
    keys.touchRight.pressed = false;
  }

  keys.touchShoot.pressed = false; // Reset the touchShoot property
});

canvas.addEventListener("touchmove", (event) => {
  if (!game.active || game.over) return;
  event.preventDefault();
});

canvas.addEventListener("touchcancel", (event) => {
  if (!game.active || game.over) return;
  event.preventDefault();
  keys.touchLeft.pressed = false;
  keys.touchRight.pressed = false;
  keys.touchShoot.pressed = false; // Reset the touchShoot property
});

// Function to handle touch events and perform shooting action
function handleTouchShoot() {
  if (!keys.touchShoot.pressed) {
    keys.touchShoot.pressed = true;
    audio.shoot.play();
    projectiles.push(
      new Projectile({
        position: {
          x: player.position.x + player.width / 2,
          y: player.position.y,
        },
        velocity: {
          x: 0,
          y: -5,
        },
      })
    );
  }
}
