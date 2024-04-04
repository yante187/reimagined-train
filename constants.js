let player;

let pixelSize = 4;
let tileSize = pixelSize * 16;

const vanillaPlayer = {
  pos: {
    x: 0,
    y: 0,
  },

  vel: {
    x: 0,
    y: 0,
  },

  width: 35,
  height: 45,

  grounded: true,
  orbed: false,

  jumpThisFrame: true,
  dashThisFrame: false,

  isDashing: false,
  dashId: false,
  
  trail: false,
  lastTrail: false,

  dead: false,
  deathTime: false,
  ogDeathTime: false
};

let backgroundImg;

let animFrames = [];

let ghost;
let ghostDash;
let inverseDash;

let currentFrame = 0;
let framePerSec = 5.5;
let lastFrame = 0;

let gamepadJumpLastFrame = false;
let gamepadDashLastFrame = false;

const spikeRotateSpeed = 1.2;
const spikeRadius = 30;

let pauseTime = 0;
let playing = true;
let level = 1;
let menu = false;

let cloneDist = 55;

const getDist = (dx, dy) => Math.hypot(dx, dy);

const frameSubsteps = 5;

const scaleFactor = 1.35;

const coyoteTime = 60;
let lastCoyote = false;

let currentDeathMessage;
const deathMessages = ["Y u die?", "Try harder.", "LOL", "XD", "Did he died?", "What?!", "So far, so bad", "Wrong way!", "Get better..", "Almost..", "Game Over!", "Denied.", "You lose!", "Hehe..", "plz fix bug !1", "That's tough."];

const getDeathMessage = () => deathMessages[Math.floor(Math.random() * deathMessages.length)];

// rockets

const rockets = [];

const rocketSpeed = 1000;

const rocketSize = 7;

// physics

const playerRespawnTime = 4000;

let gravity = 2250;

const speed = 12000;

const jumpForce = -663;

let dampingX = 27;
const dampingY = 0.5;

let canDash = true;

const dashForce = 2;

const cloneLife = 450;

// camera

let xOffset = 0;
let yOffset = 100;

// game stats info

const statsDisplayRate = 75;

let lastStatsUpdate = 0;

let stats = {
  fps: 0,
  particles: 0,
  speed: 0,
  pos: { x: 0, y: 0 }
};