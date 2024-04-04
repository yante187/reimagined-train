class Lava {
  constructor(x, y, w, h, dir = -Math.PI / 2, flipped = false) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.flipped = flipped;
    
    this.dir = dir;
    
    setInterval(() => {
      if (playing) {
        if (!this.flipped) {
          if (Math.random() < 0.4) particlesList.push(new Particle(x + Math.random() * this.width - 3, y + this.height / 2 + Math.sin(dir) * this.height / 1.5, Math.random() * 350 + 150, Math.random() * 70 + 15, dir, [255, 47, 0]));
          if (Math.random() < 0.4) particlesList.push(new Particle(x + Math.random() * this.width - 3, y + this.height / 2 + Math.sin(dir) * this.height / 1.5, Math.random() * 350 + 200, Math.random() * 70 + 20, dir, [237, 202, 0]));
          if (Math.random() < 0.4) particlesList.push(new Particle(x + Math.random() * this.width - 3, y + this.height / 2 + Math.sin(dir) * this.height / 1.5, Math.random() * 400 + 150, Math.random() * 45 + 15, dir, [25]));
        } else {
          if (Math.random() < 0.4) particlesList.push(new Particle(x + this.width / 2 - Math.cos(dir) * this.width / 1.5, y + Math.random() * this.height - 3, Math.random() * 350 + 150, Math.random() * 70 + 15, dir, [255, 47, 0]));
          if (Math.random() < 0.4) particlesList.push(new Particle(x + this.width / 2 - Math.cos(dir) * this.width / 1.5, y + Math.random() * this.height - 3, Math.random() * 350 + 200, Math.random() * 70 + 20, dir, [237, 202, 0]));
          if (Math.random() < 0.4) particlesList.push(new Particle(x + this.width / 2 - Math.cos(dir) * this.width / 1.5, y + Math.random() * this.height - 3, Math.random() * 400 + 150, Math.random() * 45 + 15, dir, [25]));
        }
      }
    
    }, 175);
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
    if (!player.dead && this.isColliding(player.pos.x, player.pos.y, player.width, player.height)) {      
      
      // die

      player.dead = true;
      player.deathTime = performance.now();
      player.ogDeathTime = player.deathTime;
      
      currentDeathMessage = getDeathMessage();

      timers.push(new Timer(() => {
        if (player.dead) {
          player = JSON.parse(JSON.stringify(vanillaPlayer));

          levels[loadedLevel].setOff(player.pos.x, player.pos.y, width, height);
        }
      }, playerRespawnTime));
      
      for (let i = 0; i < 65; i++)
        particlesList.push(new Particle(Math.random() * player.width + player.pos.x, Math.random() * player.height + player.pos.y, Math.random() * 500 + 75, Math.random() * 150 + 25, Math.random() * 2 * Math.PI, [255]));
    }
  }
  
  show() {
    fill(255, 98, 0);
    
    rect(this.x, this.y, this.width, this.height);
  }
}

let lavaList = [];