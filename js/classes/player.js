class Player {
  constructor() {
    // Setting initial velocity, rotation, and opacity
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.position = {
      x: 0,
      y: 0,
    };
    this.rotation = 0;
    this.opacity = 1;

    // Loading player image
    const image = new Image();
    image.src = "./img/spaceship.png";
    this.onImageLoad = () => {
      const scale = 1;
      this.image = image;
      this.width = image.width * scale;
      this.height = image.height * scale;
      this.position = {
        x: canvas.width / 2 - this.width / 2,
        y: canvas.height - this.height - 20,
      };
      this.particles = [];
      this.frames = 0;
      this.imageLoaded = true;
    };
    image.onload = this.onImageLoad;
  }

  // Method to clean up when player is destroyed
  destroy() {
    if (this.image) {
      this.image.onload = null; // Remove the onload event handler
    }
  }

  // Drawing player on the canvas
  draw() {
    c.save();
    c.globalAlpha = this.opacity;
    c.translate(
      player.position.x + player.width / 2,
      player.position.y + player.height / 2
    );
    c.rotate(this.rotation);
    c.translate(
      -player.position.x - player.width / 2,
      -player.position.y - player.height / 2
    );
    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
    c.restore();
  }

  // Updating player's position and redrawing it
  update() {
    if (this.imageLoaded) {
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
      this.draw();
    }
    this.frames++;
    if (!game.over && this.frames % 3 === 0) {
      this.particles.push(
        new Particle({
          position: {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height,
          },
          velocity: {
            x: (Math.random() - 0.5) * 1.5,
            y: 1.5,
          },
          radius: Math.random() * 4,
          color: "white",
          fades: true,
        })
      );
    }
  }
}
