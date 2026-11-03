const assert = require('node:assert/strict');
const { avatar, SHEETS } = require('../guilda-sprite-view.js');
let checks = 0; const warrior = { id: 3, cls: 'Guerreiro' }; const idle = avatar(warrior, 'journey', 5000);
assert.equal(idle.action, 'idle'); checks++; assert.equal(idle.frames, 8); checks++; assert.equal(idle.frameWidth, 128); checks++; assert.equal(idle.frameHeight, 128); checks++; assert.equal(idle.src, SHEETS.idle); checks++; assert.match(idle.style, /^--sprite-delay:-\d+ms$/); checks++;
const attack = avatar(warrior, 'attack', 5000); assert.equal(attack.action, 'attack'); checks++; assert.equal(attack.src, SHEETS.attack); checks++; assert.equal(attack.duration, 800); checks++;
const death = avatar(warrior, 'death', 0); assert.equal(death.action, 'death'); checks++; assert.equal(death.src, SHEETS.death); checks++; assert.equal(death.duration, 1200); checks++; assert.equal(death.loop, false); checks++; assert.equal(death.delay, 0); checks++; assert.equal(avatar(warrior, 'death', 500).delay, -500); checks++;
assert.equal(avatar({ id: 4, cls: 'Mago' }, 'idle', 0), null); checks++; assert.equal(avatar({ id: 4, cls: 'Arqueiro' }, 'attack', 0), null); checks++; assert.throws(() => avatar(null), TypeError); checks++; assert.equal(avatar(warrior, 'idle', 1200).delay, avatar(warrior, 'idle', 2400).delay); checks++;
console.log('Sprite view: ' + checks + ' checks passed.');
