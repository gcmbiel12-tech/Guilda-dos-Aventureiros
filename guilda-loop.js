(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.GuildaLoop = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  class GameLoop {
    constructor({
      state,
      resolveMission,
      render,
      now = () => Date.now(),
      schedule = (callback, delay) => setTimeout(callback, delay),
      cancel = handle => clearTimeout(handle),
      interval = 400,
    }) {
      if (!state || !Array.isArray(state.active)) throw new TypeError('GameLoop requires state.active');
      if (typeof resolveMission !== 'function') throw new TypeError('GameLoop requires resolveMission');
      if (typeof render !== 'function') throw new TypeError('GameLoop requires render');
      if (typeof now !== 'function' || typeof schedule !== 'function' || typeof cancel !== 'function') {
        throw new TypeError('GameLoop clock and scheduler dependencies must be functions');
      }
      if (!Number.isFinite(interval) || interval < 0) throw new RangeError('GameLoop interval must be a non-negative number');

      this.state = state;
      this.resolveMission = resolveMission;
      this.render = render;
      this.now = now;
      this.schedule = schedule;
      this.cancel = cancel;
      this.interval = interval;
      this.running = false;
      this.timer = null;
    }

    tick() {
      const now = this.now();
      let resolved = 0;
      for (let i = this.state.active.length - 1; i >= 0; i -= 1) {
        if (now >= this.state.active[i].end && this.resolveMission(i)) resolved += 1;
      }
      this.render();
      return resolved;
    }

    start() {
      if (this.running) return false;
      this.running = true;
      this.tick();
      this.scheduleNext();
      return true;
    }

    scheduleNext() {
      if (!this.running || this.timer !== null) return;
      this.timer = this.schedule(() => {
        this.timer = null;
        if (!this.running) return;
        this.tick();
        this.scheduleNext();
      }, this.interval);
    }

    stop() {
      if (!this.running) return false;
      this.running = false;
      if (this.timer !== null) this.cancel(this.timer);
      this.timer = null;
      return true;
    }
  }

  return { GameLoop };
});
