let canvas;

let canvasRect;

let facingDir = 0;

let clonesList = [];

let barlow;
let tileSet;
let spawnImg;

let debug = true;

function preload() {
  barlow = loadFont("barlow.otf");
  spawnImg = loadImage("spawn_.png");
  backgroundImg = loadImage("background.png");
  ghost = loadImage("ghost.png");
  ghostDash = loadImage("ghost_dash.png");
  inverseDash = loadImage("ghost_invert.png");
  tileSet = loadImage("tileset_.png");
    
  for (let i = 0; i < 9; i++)
    animFrames.push(loadImage(`anim/idle_${i}.png`));
}

function setup() {
  frameRate(9999);
  noStroke();
  
  textFont(barlow);
  
  createCanvas(windowWidth, windowHeight);
    
  canvas = document.querySelector("canvas");
  canvasRect = canvas.getBoundingClientRect();
  
  loadLevel(0);
  
  player = JSON.parse(JSON.stringify(vanillaPlayer));
  
  platformsList.push(new Platform(player.pos.x - player.height * 1.5/4 - 1, player.pos.y + player.height, player.height * 1.5, player.height * 1.5/2.3, [16]));
  levels[loadedLevel].setOff(player.pos.x, player.pos.y, width, height);
}

const createClone = (x, y) => {
  if (!player.dead) {
    const cID = Math.random();
    
    clonesList.push([x, y, facingDir, performance.now(), performance.now(), cID]);

    timers.push(new Timer(() => {
      clonesList = clonesList.filter(c => c[5] != cID);
    }, cloneLife + 25)); 
  }
}

const handleMovement = (dt) => {
  player.pos.x += player.vel.x * dt;
  player.pos.y += player.vel.y * dt;
  
  if (collidingWithMap(player.pos.x, player.pos.y, player.width, player.height)) {
    const colliding = collidingPlatform(player.pos.x, player.pos.y, player.width, player.height);
    
    for (const platform of colliding) {
      const overlapLeft = platform.x - player.pos.x - player.width;
      const overlapRight = platform.x - player.pos.x + platform.width;
      const overlapTop = platform.y - player.pos.y - player.height;
      const overlapBottom = platform.y - player.pos.y + platform.height;

      switch (Math.min(Math.abs(overlapLeft), Math.abs(overlapRight), Math.abs(overlapTop), Math.abs(overlapBottom))) {
        case Math.abs(overlapLeft):
          player.vel.x = 0;
          player.pos.x += overlapLeft;
          break;
        case Math.abs(overlapRight):
          player.vel.x = 0;
          player.pos.x += overlapRight;
          break;
        case Math.abs(overlapTop):
          player.vel.y = 0;
          player.pos.y += overlapTop;
          player.grounded = true;
          canDash = true;
          
          riding = platform.isMoving;
          
          if (riding)
            platform.riding = true;

          break;
        case Math.abs(overlapBottom):
          player.pos.y += overlapBottom + 2;
          player.isDashing = false;
          player.trail = false;
          
          if (platform.isMoving && platform.moveDir.y) {
            player.vel.y *= -0.45;
            player.vel.y += platform.moveDir.vel * 2 * dt * frameSubsteps;
            player.vel.y += gravity * 10 * dt * frameSubsteps;
            player.pos.y += 5;
          } else player.vel.y = 0;
            
          break;
      }
    }
  }
}

let riding = false;

let groundLastFrame = false;

let gamePad;

function draw() {    
  if (Timer.now() - lastFrame > 1 / framePerSec * 1000) {
    lastFrame = Timer.now();
    
    currentFrame++;
    currentFrame %= animFrames.length;
  }
  
  const gamePads = navigator.getGamepads();
  
  if (gamePads.length > 0)
    gamePad = gamePads[0];
  
  scale(scaleFactor);
    
  riding = false;
  
  const dt = deltaTime / 1000;
    
  if (dt > 1/6) return;
  
  // player clone generating

  if (player.trail && playing) {
    if (player.lastTrail[2]) {
      createClone(player.pos.x, player.pos.y);
      player.lastTrail = [player.pos.x, player.pos.y];
    } else if (getDist(player.pos.x - player.lastTrail[0], player.pos.y - player.lastTrail[1]) > cloneDist) {
      createClone(player.pos.x, player.pos.y);
      player.lastTrail = [player.pos.x, player.pos.y];
    }
  }
  
  player.grounded = false;
  
  if (playing) {
    for (const plat of platformsList)
      plat.riding = false;
    
    // handle movement

    for (let i = 0; i < frameSubsteps; i++) {
      if (!player.isDashing) {
        if (!player.dead) player.vel.y += gravity * dt / frameSubsteps;

        player.vel.x *= 1 / (1 + dampingX * dt / frameSubsteps);
        player.vel.y *= 1 / (1 + dampingY * dt / frameSubsteps);
      }

      if (!player.dead) handleMovement(dt / frameSubsteps);
    }
  }
  

  if (!player.dead && playing) {
    // jumping
    
    if (((gamePad && gamePad.buttons[0].pressed) || keyMap[" "] || keyMap.w || keyMap.z) && (player.jumpThisFrame) && (lastCoyote === false || (performance.now() - lastCoyote < coyoteTime) || player.grounded) && !player.isDashing) {
      player.vel.y = jumpForce;

      particleEffect(5, player.pos.x + player.width / 2, player.pos.y + player.height - 15, Math.random() * 150 + 50);
      particleEffect(5, player.pos.x + player.width * 0.625, player.pos.y + player.height - 15, Math.random() * 150 + 50);
      particleEffect(5, player.pos.x + player.width * 0.275, player.pos.y + player.height - 15, Math.random() * 150 + 50);

      player.jumpThisFrame = false;
    }

    if ((keyMap.shift || keyMap.x || (gamePad && gamePad.buttons[2].pressed)) && player.dashThisFrame && canDash) {
      const any = (gamePad && (Math.abs(gamePad.axes[0]) > 0.25 || Math.abs(gamePad.axes[1]) > 0.25)) || keyMap.a || keyMap.arrowleft || keyMap.d || keyMap.arrowright || keyMap.w || keyMap.arrowup || keyMap.s || keyMap.arrowdown;

      if (any) {
        const isDiag = (keyMap.a || keyMap.arrowleft || keyMap.d || keyMap.arrowright || (gamePad && Math.abs(gamePad.axes[0]) > 0.25)) && (keyMap.w || keyMap.arrowup || keyMap.s || keyMap.arrowdown || (gamePad && Math.abs(gamePad.axes[1]) > 0.25));
        const dashSpeed = isDiag ? 650 : 875;

        const dirY = +!!(keyMap.s || keyMap.arrowdown || (gamePad && gamePad.axes[1] > 0.25)) - +!!(keyMap.w || keyMap.arrowup || (gamePad && gamePad.axes[1] < 0.25));

        if (keyMap.a || keyMap.arrowleft || keyMap.d || keyMap.arrowright || (gamePad && Math.abs(gamePad.axes[0]) > 0.25)) player.vel.x = facingDir * dashSpeed;
        else player.vel.x = 0;
        if (keyMap.w || keyMap.arrowup || keyMap.s || keyMap.arrowdown || (gamePad && Math.abs(gamePad.axes[1]) > 0.25)) player.vel.y = dirY * dashSpeed;
        else player.vel.y = 0;

        player.isDashing = true;

        player.trail = true;
        player.lastTrail = [player.pos.x, player.pos.y, true];

        let dashId = Math.random()

        player.dashId = dashId;

        timers.push(new Timer(() => {
          if (player.dashId == dashId && player.isDashing) {
            player.isDashing = false;
            player.trail = false;
            player.vel.y *= 0.2575;
          }
        }, 180));

        player.dashThisFrame = false;

        canDash = false;
      }
    }

    // key presses

    if (!player.isDashing) {
      if (player.grounded) {
        if (keyMap.a || keyMap.arrowleft || (gamePad && gamePad.axes[0] < -0.25)) {
          player.vel.x -= speed * dt;
          facingDir = -1;
        }

        if (keyMap.d || keyMap.arrowright || (gamePad && gamePad.axes[0] > 0.25)) {
          player.vel.x += speed * dt;
          facingDir = 1;
        }
      } else {
        if (player.vel.x <= 0) {
          if (keyMap.a || keyMap.arrowleft || (gamePad && gamePad.axes[0] < -0.25)) {
            player.vel.x -= speed * dt;
            facingDir = -1;
          }

          if (keyMap.d || keyMap.arrowright || (gamePad && gamePad.axes[0] > 0.25)) {
            player.vel.x += speed / 2.5 * dt;
            facingDir = 1;
          }
        } else {
          if (keyMap.a || keyMap.arrowleft || (gamePad && gamePad.axes[0] < -0.25)) {
            player.vel.x -= speed / 2.5 * dt;
            facingDir = -1;
          }

          if (keyMap.d || keyMap.arrowright || (gamePad && gamePad.axes[0] > 0.25)) {
            player.vel.x += speed * dt;
            facingDir = 1;
          }
        }
      }
    }
  }

  
  if (playing) {
    // move camera

    if (player.pos.x - xOffset < width / scaleFactor / 2.25) {
      const newOffset = player.pos.x - width / scaleFactor / 2.25;

      xOffset = lerp(xOffset, newOffset, 6 * dt);
    }
    if (player.pos.x - xOffset > (width / scaleFactor - width / scaleFactor / 2.25)) {
      const newOffset = player.pos.x - (width / scaleFactor - width / scaleFactor / 2.25);

      xOffset = lerp(xOffset, newOffset, 6 * dt);
    }

    if (yOffset > height / scaleFactor - (player.pos.y + 225)) {
      const newOffset = height / scaleFactor - (player.pos.y + 225);

      yOffset = lerp(yOffset, newOffset, 6 * dt);
    }

    if (yOffset < 150 - player.pos.y) {
      const newOffset = 150 - player.pos.y;

      yOffset = lerp(yOffset, newOffset, 6 * dt);
    }
  }
    
  translate(-xOffset, yOffset);
  
  background(300);

//   // handle rockets

//   for (const rocket of rockets) {
//     rocket.update(dt);

//     rocket.show();
//   }
  
  image(backgroundImg, -(backgroundImg.width/backgroundImg.height * (platformsList[2].y - (platformsList[0].y + platformsList[0].height))) / 2 + platformsList[1].x + platformsList[1].width + xOffset * 0.115, platformsList[0].y + platformsList[0].height - yOffset * 0.1 - 75, backgroundImg.width/backgroundImg.height * (platformsList[2].y - (platformsList[0].y + platformsList[0].height)), platformsList[2].y - (platformsList[0].y + platformsList[0].height) + 150);

  // draw platforms

  for (const platform of platformsList) {
    platform.step();
    platform.show();
  }

  // orbs

  for (const orb of orbsList) {
    orb.show();
    if (playing) orb.checks();
  }
  
  // draw clones

  for (const clone of clonesList) {
    if (!playing)
      clone[3] = clone[4] + performance.now() - pauseTime;
    
    const opacity = 0.7 - (performance.now() - clone[3]) / cloneLife;
    
    push();
    
    tint(255, opacity * 255);
        
    translate(clone[0] + player.width / 2, clone[1] + player.height / 2);
    
    if (clone[2] == -1)
      scale(-1, 1);
    
    image(inverseDash, -ghost.width / 2 - 3, -ghost.height / 2 - 15, ghost.width, ghost.height);
    
    pop();
  }

  if (!player.dead) {
     // draw player
    
    push();
    
    translate(player.pos.x + player.width / 2, player.pos.y + player.height / 2);
    
    if (Math.hypot(player.vel.x, player.vel.y) * dt > 0.01) {
      if (facingDir == -1)
        scale(-1, 1);

      image(!canDash ? ghostDash : ghost, -ghost.width / 2 - 3, -ghost.height / 2 - 15, ghost.width, ghost.height);
      
    } else image(animFrames[currentFrame], -animFrames[currentFrame].width / 2 * 0.85 - 3, -animFrames[currentFrame].height / 2 * 0.85 - 15, animFrames[currentFrame].width * 0.85, animFrames[currentFrame].height * 0.85);
    
    
    pop();
  }

  for (const particle of particlesList) {
    particle.tick(dt);
    particle.render();
  }
  
  for (const tile of tilesList) {
    image(tileSet, tile[0], tile[1], tile[2], tile[3], tile[4] * tileSize, tile[5] * tileSize, tileSize, tileSize);
  }

  for (const pad of padsList) {
    if (playing) pad.checks();
    pad.show();
  }

  for (const lava of lavaList) {
    if (playing) lava.checks();
    lava.show();
  }
  
  for (const spike of spikesList) {
    if (playing) spike.step(dt);
    spike.render();
  }

  // display fps

  noStroke();
  textSize(15);
  textAlign(LEFT);
  fill(255);

  if (performance.now() - lastStatsUpdate > statsDisplayRate) {
    lastStatsUpdate = performance.now();

    stats.fps = 1 / (dt);
    stats.particles = particlesList.length;
    stats.speed = Math.hypot(player.vel.x, player.vel.y).toFixed(1);
    stats.pos.x = player.pos.x;
    stats.pos.y = player.pos.y;
  }

  text(`${Math.round(stats.fps, 0)} FPS`, 5 + xOffset, 20 - yOffset);
  text(`${stats.particles} particles`, 5 + xOffset, 35 - yOffset);
  text(`${stats.speed} pixels/second`, 5 + xOffset, 50 - yOffset);
  text(`x: ${stats.pos.x.toFixed(1)}, y: ${stats.pos.y.toFixed(1)}`, 5 + xOffset, 65 - yOffset);
  
  // move platforms and stick
  
  if (playing) {
    if (riding)
      player.pos.y = platformsList.find(p => p.riding).y - player.height;
  }
  
  //
  
  if (player.dead) {
    if (!playing)
      player.deathTime = player.ogDeathTime + (performance.now() - pauseTime);
    else {
      const secondsLeft = 1 + playerRespawnTime / 1000 - Math.round((performance.now() - player.deathTime) / 1000, 0);

      textSize(45);
      textAlign(CENTER);

      text(currentDeathMessage, width / scaleFactor / 2 + xOffset,  height / scaleFactor / 2 - yOffset - 20);
      textSize(30);
      text(`${secondsLeft}s`, width / scaleFactor / 2 + xOffset, height / scaleFactor / 2 - yOffset + 15);
    }
  }
  
  if (!playing) {
    textAlign(CENTER);
    textSize(45);
    text(`PAUSED`, width / scaleFactor / 2 + xOffset,  height / scaleFactor / 2 - yOffset);
  }
  
  image(spawnImg, platformsList[platformsList.length - 1].x, platformsList[platformsList.length - 1].y, platformsList[platformsList.length - 1].width, platformsList[platformsList.length - 1].width / 2.3);
  
  if (playing && groundLastFrame && !player.grounded)
    lastCoyote = performance.now();
  
  groundLastFrame = player.grounded;
  
  for (const timer of timers)
    timer.tick();
  
  if (gamePad && gamePad.buttons[0].pressed && !gamepadJumpLastFrame)
    player.jumpThisFrame = true;
  
  if (gamePad && gamePad.buttons[2].pressed && !gamepadDashLastFrame)
    player.dashThisFrame = true;
  
  gamepadJumpLastFrame = gamePad && gamePad.buttons[0].pressed;
  gamepadDashLastFrame = gamePad && gamePad.buttons[2].pressed;
}

// handling rocket spawns

window.oncontextmenu = e => false;

// window.onclick = e => {
//   if (e.button != 0 || player.dead) return;
  
//   const dx = e.clientX / scaleFactor - (player.pos.x + player.width / 2) + xOffset;
//   const dy = e.clientY / scaleFactor - (player.pos.y + player.height / 3) - yOffset;
  
//   const dir = Math.atan2(dy, dx);
  
//   rockets.push(new Rocket(player.pos.x + player.width / 2, player.pos.y + player.height / 3, dir));
// }

// window resize 

window.onresize = () => {
  resizeCanvas(window.innerWidth, window.innerHeight);
}

// handling keyboard inputs

const keyMap = {};

window.onkeydown = (e) => {
  if (e.key.toLowerCase() == "r") {
    if (player.dead) {
      player = JSON.parse(JSON.stringify(vanillaPlayer));

      levels[loadedLevel].setOff(player.pos.x, player.pos.y, width, height);
    }
  }
  
  if (e.key.toLowerCase() == "p") {
    playing = !playing;
    if (!playing) {
      pauseTime = performance.now();
      player.ogDeathTime = player.deathTime;
      for (const timer of timers)
        timer.ogStart = timer.start;
      for (const particle of particlesList) {
        particle.ogStart = particle.start;
      }
    } else Timer.addPauseTime();
    return;
  }
  
  if (
      !(
        keyMap[" "] ||
        keyMap.w ||
        keyMap.z
      ) &&
      (e.key == " " ||
        e.key.toLowerCase() == "z" ||
        e.key.toLowerCase() == "w" ||
        e.key == "ArrowUp"
      )
     ) player.jumpThisFrame = true;
  
  if (
      (!keyMap.shift || keyMap.x) && (e.key == "Shift" || e.key.toLowerCase() == "x")
     ) player.dashThisFrame = true;

  keyMap[e.key.toLowerCase()] = true;
}

window.onkeyup = (e) => keyMap[e.key.toLowerCase()] = false;