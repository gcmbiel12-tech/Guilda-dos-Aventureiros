(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.GuildaSpriteView = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const SHEETS = Object.freeze({ idle: 'NPC/Guerreiro/Guerreiro, ocioso.png', attack: 'NPC/Guerreiro/Guerreiro, ataque.png', death: 'NPC/Guerreiro/Guerreiro, morrendo.png' });
  function avatar(adventurer, motion = 'idle', now = Date.now()) {
    if (!adventurer || typeof adventurer !== 'object') throw new TypeError('SpriteView requires an adventurer');
    if (adventurer.cls !== 'Guerreiro') return null;
    const action = motion === 'attack' ? 'attack' : motion === 'death' ? 'death' : 'idle';
    const period = action === 'attack' ? 800 : 1200;
    const phase = action === 'death' ? 0 : ((Number(adventurer.id) || 0) * 137) % period;
    const elapsed = Math.max(0, Number(now) || 0);
    const delay = action === 'death' ? (elapsed ? -elapsed : 0) : -((elapsed + phase) % period);
    return { src: SHEETS[action], action, frameWidth: 128, frameHeight: 128, frames: 8, duration: period, delay, loop: action !== 'death', className: 'npc-sprite npc-sprite--' + action, style: '--sprite-delay:' + delay + 'ms' };
  }
  return { avatar, SHEETS };
});
