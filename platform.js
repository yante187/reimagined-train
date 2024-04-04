class Platform {
  constructor(x, y, w, h, c = false, move = false, moveDir = { x: false, y: false, vel: false }, tiles = []) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.color = c;
    this.shouldRender = (c !== false && c[0] !== false);
    this.id = Math.random();
    this.move = move;
    this.isMoving = (this.move !== false);
    this.moveDir = moveDir;
    this.riding = false;
    this.tiles = tiles;
  }
  
  isColliding(x, y, w, h) {
    return (
      this.x < x + w &&
      this.x + this.width > x &&
      this.y < y + h &&
      this.y + this.height > y
    )
  }
  
  step() {
    if (this.move !== false && playing) {
      const newPosition = this.move(this.x, this.y);

      this.x = newPosition.x;
      this.y = newPosition.y;
    }
  }

  show() {
    if (this.shouldRender) {
      fill(this.color);
      rect(this.x, this.y, this.width, this.height);
    }

    if (this.tiles.length > 0)
      for (const tile of this.tiles)
        image(tileSet, this.x + tile[0], this.y + tile[1], tile[2], tile[3], tileSize * tile[4], tileSize * tile[5], tileSize, tileSize);
  }
}

const collidingWithMap = (x, y, w, h) => {
  for (const platform of platformsList)
    if (platform.isColliding(x, y, w, h)) return true;

  return false;
}

const collidingPlatform = (x, y, w, h) => {
  const collidingPlatforms = [];
  
  for (const platform of platformsList)
    if (platform.isColliding(x, y, w, h)) collidingPlatforms.push(platform);
  
  return collidingPlatforms;
}

let platformsList = [];
