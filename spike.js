class Spike {
  constructor(x, y, move) {
    this.x = x;
    this.y = y;
    this.move = move;
    this.rotation = 0;
    
    setInterval(() => {
      if (playing)
        particlesList.push(new Particle(this.x, this.y, Math.random() * 600 + 150, Math.random() * 50 + 35, Math.random() * 2 * Math.PI, [255, 0, 0]));
    }, 45);
  }
  
  step(dt) {
    this.rotation += spikeRotateSpeed * dt;
    const newPosition = this.move(this.x, this.y);
    this.x = newPosition.x;
    this.y = newPosition.y;
    
    if (!player.dead && Math.hypot(player.pos.x + player.width / 2 - this.x, player.pos.y + player.height / 2 - this.y) < spikeRadius + 5) {
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
  
  render() {
    fill(255, 0, 0);
    
    push();
    translate(this.x, this.y);
    rotate(this.rotation);
    triangle(spikeRadius * Math.cos(this.rotation), spikeRadius * Math.sin(this.rotation), spikeRadius * Math.cos(2/3 * Math.PI + this.rotation), spikeRadius * Math.sin(2/3 * Math.PI + this.rotation), spikeRadius * Math.cos(4/3 * Math.PI + this.rotation), spikeRadius * Math.sin(4/3 * Math.PI + this.rotation));
    triangle(spikeRadius * Math.cos(this.rotation + Math.PI), spikeRadius * Math.sin(this.rotation + Math.PI), spikeRadius * Math.cos(2/3 * Math.PI + this.rotation + Math.PI), spikeRadius * Math.sin(2/3 * Math.PI + this.rotation + Math.PI), spikeRadius * Math.cos(4/3 * Math.PI + this.rotation + Math.PI), spikeRadius * Math.sin(4/3 * Math.PI + this.rotation + Math.PI));
    pop();
    
    // hitbox
//     fill(255, 0, 0);
//     circle(player.pos.x + player.width / 2, player.pos.y + player.height / 2, 3, 3);
    
//     noFill();
//     stroke(255, 0, 0);
//     circle(this.x, this.y, spikeRadius + 25, spikeRadius + 25);
    
    fill(255);
  }
}

let spikesList = [];