class InvaderProjectile {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;

    this.width = 5;
    this.height = 20;
  }

  // Drawing invader projectile on the canvas
  draw() {
    c.fillStyle = "purple";
    c.fillRect(
      this.position.x - this.width / 2,
      this.position.y,
      this.width,
      this.height
    );
  }

  // Updating invader projectile's position and redrawing it
  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

  // Creating a new invader projectile and adding it to the invaderProjectiles array
  shoot(InvaderProjectiles) {
    InvaderProjectiles.push(
      new InvaderProjectile({
        position: {
          x: this.position.x + this.width / 2,
          y: this.position.y + this.height,
        },
        velocity: {
          x: 0,
          y: 5,
        },
      })
    );
  }
}
