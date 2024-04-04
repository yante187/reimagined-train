class Particle {
  constructor(x, y, life, s, dir, c = [150, 255, 255]) {
    this.x = x;
    this.y = y;
    
    this.id = Math.random();
    
    this.size = Math.random() * 5.25 + 3;
        
    this.life = life * 1.1;
    this.start = performance.now();
    this.ogStart = performance.now();
    
    this.dir = dir;
    
    this.xspeed = s;
    this.yspeed = s;
    
    this.color = c;
  }
  
  tick(dt) {
    if (playing) {
      this.x += this.xspeed * Math.cos(this.dir) * dt;
      this.y += this.yspeed * Math.sin(this.dir) * dt;
    } else {
      this.start = this.ogStart + (performance.now() - pauseTime);
    }
    
    if (performance.now() - this.start > this.life)
      particlesList = particlesList.filter(p => p.id != this.id);
  }
  
  render() {
    let opacity = (performance.now() - this.start);
    
    opacity = 1 - opacity / this.life;
    
    let renderSize = map(opacity, 0, 1, 0.35, 1);
    
    fill(...this.color, opacity * 255);
    
    rect(this.x, this.y, this.size * renderSize, this.size * renderSize);
  }
}

let particlesList = [];

const particleEffect = (p, x, y, s) => {
  for (let i = 0; i < p; i++) {
    particlesList.push(new Particle(x, y, Math.random() * 450 + 150, s, Math.random() * Math.PI));
  }
}