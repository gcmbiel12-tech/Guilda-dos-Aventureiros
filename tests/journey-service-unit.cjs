const assert = require('node:assert/strict');
const { Adventurer, Mission, CampaignMission, CAMPAIGN } = require('../guilda-domain.js');
const { JourneyService } = require('../guilda-journey.js');

let passed = 0;
function test(name, run) { run(); passed++; console.log('PASS ' + name); }
function hero(id = 1, options = {}) {
  return new Adventurer({ id, name: id === 1 ? 'Thorin' : 'Lyra', cls: 'Guerreiro', rar: 'Comum', power: 20, cost: 30, ...options });
}
function setup({ random = () => 0, now = () => 1000, roster = [hero()], sel = [1], active = [] } = {}) {
  const state = { gold: 120, totalGold: 0, rep: 0, campaignStage: 0, roster, sel, active };
  const events = { logs: [], saves: 0, renders: 0 };
  const service = new JourneyService({
    state, campaign: CAMPAIGN, random, now, multiplier: () => 1.5,
    log: message => events.logs.push(message),
    save: () => events.saves++,
    render: () => events.renders++
  });
  return { state, events, service };
}
function mission(options = {}) {
  return new Mission({ name: 'Patrulha de teste', req: 10, gold: 40, rep: 2, risk: 0, dur: 5, ...options });
}
function activeFor(heroId, m = mission()) { return { m, party: [heroId], start: 1000, end: 6000, dur: 5000 }; }

test('despacho valida grupo, marca estado e usa relógio injetado', () => {
  const { state, events, service } = setup({ now: () => 5000 });
  service.dispatch(mission());
  assert.equal(state.roster[0].isOnMission(), true);
  assert.deepEqual(state.sel, []);
  assert.deepEqual(state.active[0], { m: state.active[0].m, party: [1], start: 5000, end: 10000, dur: 5000 });
  assert.equal(events.saves, 1);
  assert.equal(events.renders, 1);
  assert.match(events.logs[0], /Grupo despachado/);
});

test('despacho sem seleção não altera estado nem salva', () => {
  const { state, events, service } = setup({ sel: [] });
  service.dispatch(mission());
  assert.equal(state.active.length, 0);
  assert.equal(events.saves, 0);
  assert.match(events.logs[0], /Selecione ao menos/);
});

test('seleção inválida é limpa e a interface é atualizada', () => {
  const { state, events, service } = setup({ sel: [999] });
  service.dispatch(mission());
  assert.deepEqual(state.sel, []);
  assert.equal(events.saves, 1);
  assert.equal(events.renders, 1);
  assert.match(events.logs[0], /não está mais disponível/);
});

test('sucesso aplica multiplicador, recompensa, libera equipe e conclui jornada', () => {
  const h = hero();
  h.markOnMission();
  const { state, events, service } = setup({ roster: [h], sel: [], active: [activeFor(1)], random: () => 0 });
  assert.equal(service.resolveMission(0), true);
  assert.equal(state.gold, 180);
  assert.equal(state.totalGold, 60);
  assert.equal(state.rep, 2);
  assert.equal(h.isIdle(), true);
  assert.equal(state.active.length, 0);
  assert.equal(events.saves, 1);
  assert.match(events.logs[0], /Sucesso em/);
});

test('falha consome seguro, preserva aventureiro e o libera', () => {
  const h = hero(1, { insured: true });
  h.markOnMission();
  const { state, events, service } = setup({ roster: [h], sel: [], active: [activeFor(1, mission({ risk: 1 }))], random: () => 0.99 });
  service.resolveMission(0);
  assert.equal(h.insured, false);
  assert.equal(h.isIdle(), true);
  assert.deepEqual(state.roster, [h]);
  assert.equal(state.active.length, 0);
  assert.match(events.logs[0], /seguro usado/);
});

test('falha sem seguro remove aventureiro e encerra jornada', () => {
  const h = hero();
  h.markOnMission();
  const { state, events, service } = setup({ roster: [h], sel: [], active: [activeFor(1, mission({ risk: 1 }))], random: () => 0.99 });
  service.resolveMission(0);
  assert.deepEqual(state.roster, []);
  assert.equal(state.active.length, 0);
  assert.match(events.logs[0], /não resistiu/);
});

test('vitória da campanha avança somente a etapa correspondente', () => {
  const h = hero();
  h.markOnMission();
  const { state, events, service } = setup({ roster: [h], sel: [], active: [activeFor(1, CAMPAIGN[0])], random: () => 0 });
  service.resolveMission(0);
  assert.equal(state.campaignStage, 1);
  assert.equal(state.gold, 390);
  assert.match(events.logs[0], /Vitória na campanha/);
});

test('índice de jornada inexistente não altera o estado', () => {
  const { state, events, service } = setup();
  assert.equal(service.resolveMission(5), false);
  assert.equal(state.active.length, 0);
  assert.equal(events.saves, 0);
});

console.log('OK: ' + passed + '/8 testes unitários de JourneyService aprovados.');
