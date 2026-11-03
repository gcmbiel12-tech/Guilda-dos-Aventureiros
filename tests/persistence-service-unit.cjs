const assert = require('node:assert/strict');
const { Adventurer, MISSIONS, CAMPAIGN } = require('../guilda-domain.js');
const { PersistenceService } = require('../guilda-persistence.js');

let passed = 0;
function test(name, run) { run(); passed++; console.log('PASS ' + name); }
function hero(id = 1, options = {}) {
  return new Adventurer({ id, name: id === 1 ? 'Thorin' : 'Lyra', cls: 'Guerreiro', rar: 'Comum', power: 20, cost: 30, ...options });
}
function state(overrides = {}) {
  return {
    gold: 120, rep: 0, level: 1, scrolls: 0, totalGold: 0, nextId: 1,
    roster: [], tavern: [], active: [], sel: [], campaignStage: 0, ...overrides
  };
}
function memoryStorage(initial = null) {
  let value = initial;
  return {
    getItem(key) { assert.equal(key, 'guildaSave'); return value; },
    setItem(key, next) { assert.equal(key, 'guildaSave'); value = next; },
    get value() { return value; }
  };
}
function service(storage) {
  return new PersistenceService({ Adventurer, missions: MISSIONS, campaign: CAMPAIGN, storage });
}

test('ausência de salvamento não altera o estado inicial', () => {
  const target = state({ gold: 250 });
  assert.equal(service(memoryStorage(null)).load(target), false);
  assert.equal(target.gold, 250);
  assert.deepEqual(target.roster, []);
});

test('grava formato v2, chave e campos persistidos', () => {
  const storage = memoryStorage();
  const source = state({ gold: 321, rep: 7, level: 2, scrolls: 3, totalGold: 450, nextId: 4,
    roster: [hero()], tavern: [hero(2)], active: [], sel: [1], campaignStage: 2 });
  assert.equal(service(storage).save(source), true);
  const saved = JSON.parse(storage.value);
  assert.deepEqual(Object.keys(saved), ['version', 'gold', 'rep', 'level', 'scrolls', 'totalGold', 'nextId', 'roster', 'tavern', 'active', 'sel', 'campaignStage']);
  assert.equal(saved.version, 2);
  assert.equal(saved.gold, 321);
  assert.equal(saved.roster[0].id, 1);
});

test('round-trip restaura recursos, aventureiros e seleção', () => {
  const storage = memoryStorage();
  const original = state({ gold: 321, rep: 7, level: 2, scrolls: 3, totalGold: 450, nextId: 4,
    roster: [hero()], tavern: [hero(2)], sel: [1], campaignStage: 2 });
  service(storage).save(original);
  const restored = state();
  assert.equal(service(storage).load(restored), true);
  assert.deepEqual([restored.gold, restored.rep, restored.level, restored.scrolls, restored.totalGold, restored.campaignStage], [321, 7, 2, 3, 450, 2]);
  assert.equal(restored.roster[0] instanceof Adventurer, true);
  assert.equal(restored.tavern[0].id, 2);
  assert.deepEqual(restored.sel, [1]);
  assert.equal(restored.nextId, 4);
});

test('migra salvamento legado sem descartar valores padrão', () => {
  const restored = state({ gold: 120 });
  assert.equal(service(memoryStorage(JSON.stringify({ scrolls: 2, campaignStage: 3 }))).load(restored), true);
  assert.equal(restored.scrolls, 2);
  assert.equal(restored.campaignStage, 3);
  assert.equal(restored.gold, 120);
});

test('restaura jornada por catálogo e marca equipe ocupada', () => {
  const saved = { ...state({ roster: [hero()], active: [{ m: { name: 'Patrulha na Floresta' }, party: [1], start: 100, dur: 15000, end: 15100 }] }) };
  const restored = state();
  assert.equal(service(memoryStorage(JSON.stringify(saved))).load(restored), true);
  assert.equal(restored.active[0].m, MISSIONS[0]);
  assert.equal(restored.roster[0].isOnMission(), true);
});

test('restaura etapa de campanha pelo campaignStep', () => {
  const saved = state({ roster: [hero()], active: [{ m: { name: CAMPAIGN[1].name, campaignStep: 1 }, party: [1], start: 0, dur: 100, end: 100 }] });
  const restored = state();
  service(memoryStorage(JSON.stringify(saved))).load(restored);
  assert.equal(restored.active[0].m, CAMPAIGN[1]);
});

test('descarta aventureiros inválidos e IDs duplicados entre roster e taverna', () => {
  const saved = state({ roster: [hero(), hero(1, { name: 'Nome Inválido' })], tavern: [hero(1), hero(3)] });
  const restored = state();
  service(memoryStorage(JSON.stringify(saved))).load(restored);
  assert.deepEqual(restored.roster.map(item => item.id), [1]);
  assert.deepEqual(restored.tavern.map(item => item.id), [3]);
  assert.equal(restored.nextId, 4);
});

test('filtra grupos ativos inválidos, IDs repetidos e seleção de aventureiros ocupados', () => {
  const saved = state({ roster: [hero(), hero(2)], sel: [1, 2, 999], active: [
    { m: { name: 'Patrulha na Floresta' }, party: [1, 1], start: 0, dur: 100, end: 100 },
    { m: { name: 'Caçada a Goblins' }, party: [1, 2], start: 0, dur: 100, end: 100 },
    { m: { name: 'Missão desconhecida' }, party: [2], start: 0, dur: 100, end: 100 },
    { m: { name: 'Patrulha na Floresta' }, party: [2], start: 0, dur: 0, end: 100 }
  ] });
  const restored = state();
  service(memoryStorage(JSON.stringify(saved))).load(restored);
  assert.equal(restored.active.length, 2);
  assert.deepEqual(restored.active.map(item => item.party), [[1], [2]]);
  assert.deepEqual(restored.sel, []);
  assert.equal(restored.roster[0].isOnMission(), true);
  assert.equal(restored.roster[1].isOnMission(), true);
});

test('normaliza limites numéricos e campanha', () => {
  const saved = { gold: -5, rep: NaN, level: 0, scrolls: -1, totalGold: -10, nextId: 0, campaignStage: 99 };
  const restored = state({ gold: 200, rep: 8, level: 3, scrolls: 2, totalGold: 50, nextId: 5 });
  service(memoryStorage(JSON.stringify(saved))).load(restored);
  assert.deepEqual([restored.gold, restored.rep, restored.level, restored.scrolls, restored.totalGold, restored.nextId, restored.campaignStage], [200, 8, 3, 2, 50, 5, 4]);
});

test('JSON corrompido e estrutura inválida retornam false', () => {
  const originalWarn = console.warn;
  console.warn = () => {};
  try {
    assert.equal(service(memoryStorage('{')).load(state()), false);
    assert.equal(service(memoryStorage('null')).load(state()), false);
    assert.equal(service(memoryStorage('[]')).load(state()), true);
  } finally { console.warn = originalWarn; }
});

test('falhas de leitura e gravação do storage são tratadas sem propagar exceção', () => {
  const broken = { getItem() { throw new Error('read denied'); }, setItem() { throw new Error('write denied'); } };
  const instance = service(broken);
  const originalWarn = console.warn;
  console.warn = () => {};
  try {
    assert.equal(instance.load(state()), false);
    assert.equal(instance.save(state()), false);
  } finally { console.warn = originalWarn; }
});

console.log('OK: ' + passed + '/11 testes unitários de PersistenceService aprovados.');
