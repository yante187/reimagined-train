let timers = [];

let totalPausedTime = 0;

class Timer {  
  constructor(fn, timer) {
    this.fn = fn;
    this.timer = timer;
    this.start = performance.now();
    this.ogStart = this.start;
    this.id = Math.random();
  }
  
  static addPauseTime() {
    totalPausedTime += performance.now() - pauseTime;
  }
  
  static now() {
    return performance.now() - totalPausedTime;  
  }
  
  tick() {
    if (playing) {
      if (performance.now() - this.start >= this.timer) {
        this.fn();
        timers = timers.filter(t => t.id != this.id);
      }
    } else (this.start = this.ogStart + performance.now() - pauseTime)
  }
}