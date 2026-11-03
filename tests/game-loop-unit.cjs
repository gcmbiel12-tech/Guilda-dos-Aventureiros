const assert = require('node:assert/strict');
const { GameLoop } = require('../guilda-loop.js');

let passed = 0;
function test(name, run) { run(); passed++; console.log('PASS ' + name); }
function setup({ active = [], now = 100, interval = 25 } = {}) {
  const state = { active: [...active] };
  const events = { resolved: [], renders: 0, scheduled: [], cancelled: [] };
  const loop = new GameLoop({
    state,
    now: () => now,
    interval,
    resolveMission(index) {
      events.resolved.push(state.active[index].id);
      state.active.splice(index, 1);
      return true;
    },
    render: () => events.renders++,
    schedule(callback, delay) {
      const timer = { callback, delay };
      events.scheduled.push(timer);
      return timer;
    },
    cancel(timer) { events.cancelled.push(timer); },
  });
  return { state, events, loop };
}

test('tick resolve apenas jornadas vencidas e percorre indices em ordem segura', () => {
  const { state, events, loop } = setup({
    active: [{ id: 'a', end: 90 }, { id: 'b', end: 80 }, { id: 'c', end: 120 }],
  });
  assert.equal(loop.tick(), 2);
  assert.deepEqual(events.resolved, ['b', 'a']);
  assert.deepEqual(state.active.map(item => item.id), ['c']);
  assert.equal(events.renders, 1);
});

test('tick usa um unico instante de referencia e sempre renderiza', () => {
  let calls = 0;
  const state = { active: [{ id: 1, end: 10 }, { id: 2, end: 11 }] };
  const loop = new GameLoop({
    state, now: () => { calls++; return 10; },
    resolveMission: () => true, render: () => {},
    schedule: () => null, cancel: () => {},
  });
  loop.tick();
  assert.equal(calls, 1);
});

test('start executa o primeiro tick imediatamente e evita iniciar duas vezes', () => {
  const { events, loop } = setup();
  assert.equal(loop.start(), true);
  assert.equal(loop.start(), false);
  assert.equal(events.renders, 1);
  assert.equal(events.scheduled.length, 1);
  assert.equal(events.scheduled[0].delay, 25);
});

test('callback agendado executa tick e agenda a proxima iteracao', () => {
  const { events, loop } = setup();
  loop.start();
  events.scheduled[0].callback();
  assert.equal(events.renders, 2);
  assert.equal(events.scheduled.length, 2);
  assert.equal(loop.running, true);
});

test('stop cancela o timer pendente e impede nova iteracao', () => {
  const { events, loop } = setup();
  loop.start();
  const pending = events.scheduled[0];
  assert.equal(loop.stop(), true);
  assert.equal(loop.stop(), false);
  assert.deepEqual(events.cancelled, [pending]);
  pending.callback();
  assert.equal(events.renders, 1);
  assert.equal(events.scheduled.length, 1);
  assert.equal(loop.running, false);
});

test('valida dependencias e intervalo', () => {
  assert.throws(() => new GameLoop({ state: {}, resolveMission() {}, render() {} }), /state.active/);
  assert.throws(() => new GameLoop({ state: { active: [] }, render() {} }), /resolveMission/);
  assert.throws(() => new GameLoop({ state: { active: [] }, resolveMission() {}, render() {}, interval: -1 }), /interval/);
});

console.log('OK: ' + passed + '/6 testes unitários de GameLoop aprovados.');
