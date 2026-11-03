const assert = require('node:assert/strict');
const { Adventurer, GuildService, CLASSES, NAMES } = require('../guilda-domain.js');

let passed = 0;
function test(name, run) {
  run();
  passed++;
  console.log('PASS ' + name);
}
function createState(overrides = {}) {
  return {
    gold: 120, rep: 0, level: 1, scrolls: 0, totalGold: 0, nextId: 1,
    roster: [], tavern: [], active: [], sel: [], campaignStage: 0,
    ...overrides
  };
}
function adventurer(id, overrides = {}) {
  return new Adventurer({
    id, name: NAMES[0], cls: CLASSES[0], rar: 'Comum', power: 10, cost: 30,
    ...overrides
  });
}

test('limites, custo do salão e multiplicador permanecem iguais', () => {
  const state = createState({ level: 2, scrolls: 2 });
  const service = new GuildService(state);
  assert.equal(service.partyMax(), 3);
  assert.equal(service.rosterMax(), 7);
  assert.equal(service.hallCost(), 160);
  assert.equal(service.multiplier(), 1.3);
});

test('geração determinística mantém fórmula, catálogo e incremento de ID', () => {
  const state = createState();
  const service = new GuildService(state, { random: () => 0 });
  const created = service.createAdventurer();
  assert.ok(created instanceof Adventurer);
  assert.deepEqual(
    { id: created.id, name: created.name, cls: created.cls, rar: created.rar, power: created.power, cost: created.cost },
    { id: 1, name: NAMES[0], cls: CLASSES[0], rar: 'Comum', power: 6, cost: 39 }
  );
  assert.equal(state.nextId, 2);
});

test('renovação gera exatamente quatro aventureiros com IDs únicos', () => {
  const state = createState();
  const service = new GuildService(state, { random: () => 0 });
  const tavern = service.refreshTavern();
  assert.equal(tavern.length, 4);
  assert.deepEqual(tavern.map(item => item.id), [1, 2, 3, 4]);
  assert.equal(state.nextId, 5);
});

test('seleção alterna IDs, respeita limite e rejeita aventureiro ocupado', () => {
  const first = adventurer(1);
  const second = adventurer(2);
  const third = adventurer(3);
  third.markOnMission();
  const state = createState({ roster: [first, second, third], level: 1 });
  const service = new GuildService(state);
  assert.deepEqual(service.toggleSelection(1), { ok: true, selected: true });
  assert.deepEqual(service.toggleSelection(2), { ok: true, selected: true });
  assert.deepEqual(service.toggleSelection(3), { ok: false, code: 'unavailable' });
  assert.deepEqual(service.toggleSelection(1), { ok: true, selected: false });
  assert.deepEqual(state.sel, [2]);
});

test('seleção não excede capacidade do grupo', () => {
  const state = createState({ roster: [adventurer(1), adventurer(2), adventurer(3)] });
  const service = new GuildService(state);
  service.toggleSelection(1);
  service.toggleSelection(2);
  assert.deepEqual(service.toggleSelection(3), { ok: false, code: 'party-full' });
  assert.deepEqual(state.sel, [1, 2]);
});

test('seguro valida disponibilidade e saldo e consome ouro uma vez', () => {
  const insured = adventurer(1, { insured: true });
  const target = adventurer(2, { power: 13 });
  const state = createState({ gold: 10, roster: [insured, target] });
  const service = new GuildService(state);
  assert.deepEqual(service.insure(1), { ok: false, code: 'unavailable' });
  assert.deepEqual(service.insure(2), { ok: false, code: 'insufficient-gold', cost: 26 });
  state.gold = 26;
  const result = service.insure(2);
  assert.equal(result.ok, true);
  assert.equal(result.cost, 26);
  assert.equal(target.insured, true);
  assert.equal(state.gold, 0);
  assert.equal(service.insure(2).code, 'unavailable');
});

test('contratação trata falta de ouro, roster cheio e contratação válida', () => {
  const candidate = adventurer(4, { cost: 80 });
  const state = createState({ gold: 30, tavern: [candidate] });
  const service = new GuildService(state);
  assert.deepEqual(service.hire(0), { ok: false, code: 'insufficient-gold' });
  state.gold = 120;
  state.roster = Array.from({ length: service.rosterMax() }, (_, i) => adventurer(i + 1));
  assert.deepEqual(service.hire(0), { ok: false, code: 'roster-full' });
  state.roster.pop();
  const result = service.hire(0);
  assert.equal(result.ok, true);
  assert.equal(state.gold, 40);
  assert.equal(state.roster.at(-1), candidate);
  assert.equal(state.tavern.length, 0);
});

test('melhoria do salão respeita custo e aumenta nível', () => {
  const state = createState({ gold: 99 });
  const service = new GuildService(state);
  assert.deepEqual(service.upgradeHall(), { ok: false, code: 'insufficient-gold', cost: 100 });
  state.gold = 100;
  assert.deepEqual(service.upgradeHall(), { ok: true, cost: 100, level: 2 });
  assert.equal(state.gold, 0);
  assert.equal(service.hallCost(), 160);
});

test('prestígio exige 400 ouro total e preserva o cálculo/reset', () => {
  const state = createState({
    gold: 900, rep: 12, level: 4, scrolls: 2, totalGold: 399,
    roster: [adventurer(1)], active: [{ party: [1] }], sel: [1]
  });
  const service = new GuildService(state);
  assert.deepEqual(service.prestige(), { ok: false, code: 'insufficient-total-gold' });
  state.totalGold = 400;
  const result = service.prestige();
  assert.equal(result.ok, true);
  assert.equal(result.gain, 3);
  assert.equal(result.multiplier, 1.75);
  assert.deepEqual(
    { gold: state.gold, rep: state.rep, level: state.level, scrolls: state.scrolls, totalGold: state.totalGold },
    { gold: 120, rep: 0, level: 1, scrolls: 5, totalGold: 0 }
  );
  assert.deepEqual(state.roster, []);
  assert.deepEqual(state.active, []);
  assert.deepEqual(state.sel, []);
});

console.log('OK: ' + passed + '/9 testes unitários do serviço da Guilda aprovados.');
