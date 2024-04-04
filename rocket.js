class Rocket {
  constructor(x, y, dir) {
    this.x = x;
    this.y = y;
    
    this.width = rocketSize;
    this.height = rocketSize;
    
    this.dir = dir;
  }
  
  update(dt) {
    this.x += Math.cos(this.dir) * rocketSpeed * dt;
    this.y += Math.sin(this.dir) * rocketSpeed * dt;
  
    for (const platform of platforms) {
      if (platform.isColliding(this.x, this.y, this.width, this.height)) {
        const idx = rockets.indexOf(this);
        rockets.splice(idx, 1);
      }
    }
  }
  
  show() {
    fill(255);
    
    circle(this.x, this.y, this.width, this.height);
  }
}