class Grid {
  constructor() {
    this.position = {
      x: 0,
      y: 0,
    };

    this.velocity = {
      x: 3 * gridSpeedModifier,
      y: 0,
    };

    this.invaders = [];
    this.generateInvaders();
  }

  // Generate invaders randomly within a grid
  generateInvaders() {
    const columns = Math.floor(Math.random() * 10 + 5);
    const rows = Math.floor(Math.random() * 5 + 1);

    this.width = columns * 45 - 20;
    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        this.invaders.push(
          new Invader({
            position: {
              x: x * 45,
              y: y * 45,
            },
          })
        );
      }
    }
  }

  // Update grid's position and velocity
  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    this.velocity.y = 0;

    // Reverse the direction of the grid if it reaches the canvas boundaries
    if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
      this.reverseDirection();
    }

    // Check if any invader has reached the bottom of the canvas
    const invaderBottom = Math.max(
      ...this.invaders.map((invader) => invader.position.y + invader.height)
    );
    if (invaderBottom >= canvas.height) {
      endGame();
    }
  }

  // Reverse the direction of the grid
  reverseDirection() {
    this.velocity.x = -this.velocity.x;
    this.velocity.y += 45;
  }
}
