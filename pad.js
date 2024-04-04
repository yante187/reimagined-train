class Pad {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 35;
    this.height = 4;
    
    setInterval(() => {
      particlesList.push(new Particle(x + Math.random() * this.width - 3, y - 2, Math.random() * 150 + 275, Math.random() * 35 + 40, -Math.PI / 2));
    }, 50);
  }
  
  isColliding(x, y, w, h) {
    return (
      this.x < x + w &&
      this.x + this.width > x &&
      this.y < y + h &&
      this.y + this.height > y
    )
  }
  
  checks() {
    if (this.isColliding(player.pos.x, player.pos.y, player.width, player.height)) {
      player.vel.y = jumpForce * 1.75;
      
      canDash = true;
      
      player.trail = true;
      player.lastTrail = [player.pos.x, player.pos.y, true];
      dd
      setTimeout(() => (player.trail = false), 185);
    }
  }
  
  show() {
    fill(255);
    
    rect(this.x, this.y, this.width, this.height);
  }
}

// const padsList = [new Pad(-125, 390)];
let padsList = [];