let loadedLevel;

const levels = [
  {
    spawn: { x: -100, y: 345 }, // ceil index 0, left index 1, bottom index 2
    platforms: [[-3500, -3150, 7000, 2950, [0]], [-1375, -600, 1200, 1200, [0]], [-3500, 525, 7000, 3500, [0]], [475, 231, 175, 25], [845, -600, 1200, 1200, [0]], [235, 437, 200, 150, [0]], [235, 155, 200, 126, [0]], [15, -40, 220, 35], [435, -40, 220, 35], [15, 109, 145, 35], [-120, 100, 85, 25, [false], (x, y) => {
      return { x: x, y: Math.sin(Timer.now() / 375) * 100 + 38 };
    }, { x: false, y: true, vel: Math.cos(Timer.now() / 375) * 100 / 375 }, [[-5, -5, 32, 32, 4, 2], [27, -5, 32, 32, 5, 2], [59, -5, 32, 32, 5, 2]]]],
    orbs: [[700, 365]],
    pads: [],
    lava: [[-175, 521, 410, 4], [15, -5, 220, 4, Math.PI / 2], [15, 105, 145, 4, -Math.PI / 2], [235, 151, 35, 4, -Math.PI / 2], [235, 281, 200, 4, Math.PI / 2], [435, 521, 410, 4], [235, -27, 200, 10], [235, -27, 200, 10, Math.PI / 2], [655, -40, 4, 35, 0, true]],
    spikes: [[335, 0, (x, y) => {
      return { x: x, y: Math.sin(Timer.now() / 165) * 45 - 115 };
    }]],
    setOff: (x, y, w, h) => {
      xOffset = x - (w / scaleFactor - w / scaleFactor / 2.25) + 40;
      yOffset = h / scaleFactor - (y + 250);
    }
  }
]

const loadLevel = idx => {
  loadedLevel = idx;
  
  vanillaPlayer.pos.x = levels[idx].spawn.x;
  vanillaPlayer.pos.y = levels[idx].spawn.y;
  
  platformsList = levels[idx].platforms.map(info => new Platform(...info));
  orbsList = levels[idx].orbs.map(info => new Orb(...info));
  padsList = levels[idx].pads.map(info => new Pad(...info));
  lavaList = levels[idx].lava.map(info => new Lava(...info));
  spikesList = levels[idx].spikes.map(info => new Spike(...info));
}