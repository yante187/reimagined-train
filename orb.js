const collectDelay = 2000;

class Orb {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    
    this.collected = false;
    
    this.size = 15;
    
    setInterval(() => {
      if (!this.collected && playing)
        particlesList.push(new Particle(x, y, Math.random() * 500 + 250, Math.random() * 50 + 25, Math.random() * 2 * Math.PI, [255]));
    }, 100);
  }
  
  show() {
    push();
    
    translate(this.x, this.y);
    
    rotate(Math.PI / 4);
    
    fill(25);
    
    rect(-this.size / 2 - 4, -this.size / 2 - 4, this.size + 8, this.size + 8);
    
    if (!this.collected) {
      fill(255);
    
      rect(-this.size / 2, -this.size / 2, this.size, this.size);
    }
    
    pop();
  }
  
  checks() {
    if (!canDash && !this.collected && Math.hypot(player.pos.x + player.width / 2 - this.x, player.pos.y + player.height / 2 - this.y) < player.width / 2 + 30) {    
      this.collected = true;
      
      canDash = true;

      setTimeout(() => (this.collected = false), collectDelay);
    }
  }
}

let orbsList = [];