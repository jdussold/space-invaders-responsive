class Invader {
  constructor({ position }) {
    this.velocity = {
      x: 0,
      y: 0,
    };

    this.position = position;

    // Loading invader image
    const image = new Image();
    image.src = "./img/invader.png";
    image.onload = () => {
      const scale = 1;
      this.image = image;
      this.width = image.width * scale;
      this.height = image.height * scale;
      this.imageLoaded = true;
    };
  }

  // Drawing invader on the canvas
  draw() {
    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  // Updating invader's position, based on velocity, and redrawing it
  update({ velocity }) {
    if (this.imageLoaded) {
      this.position.x += velocity.x;
      this.position.y += velocity.y;
      this.draw();

      // Checking for collision with player
      if (this.collidesWithPlayer()) {
        this.handleCollisionWithPlayer();
      }
    }
  }

  // Check for collision with player
  collidesWithPlayer() {
    return !(
      player.position.x > this.position.x + this.width ||
      player.position.x + player.width < this.position.x ||
      player.position.y > this.position.y + this.height ||
      player.position.y + player.height < this.position.y
    );
  }

  // Handle collision with player
  handleCollisionWithPlayer() {
    audio.explosion.mute();
    setTimeout(() => {
      endGame();
    }, 0);

    createParticles({
      object: player,
      color: "#E7C4C5",
      fades: true,
    });
  }

  // Creating a new invader projectile and adding it to the invaderProjectiles array
  shoot(invaderProjectiles) {
    audio.enemyShoot.play();
    invaderProjectiles.push(
      new InvaderProjectile({
        position: {
          x: this.position.x + this.width / 2,
          y: this.position.y + this.height,
        },
        velocity: {
          x: 0,
          y: 2,
        },
      })
    );
  }
}
