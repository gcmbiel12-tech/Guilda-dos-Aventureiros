const assert = require('node:assert/strict');
const {
  Adventurer, Mission, CampaignMission, CLASSES, RARITIES, NAMES, MISSIONS, CAMPAIGN
} = require('../guilda-domain.js');

let passed = 0;
function test(name, run) {
  run();
  passed++;
  console.log('PASS ' + name);
}

test('catálogos preservam classes, raridades, missões e campanha', () => {
  assert.equal(CLASSES.length, 5);
  assert.equal(RARITIES.length, 4);
  assert.equal(MISSIONS.length, 5);
  assert.equal(CAMPAIGN.length, 4);
});

test('Adventurer calcula seguro e transita entre estados operacionais', () => {
  const adventurer = new Adventurer({
    id: 1, name: 'Thorin', cls: 'Guerreiro', rar: 'Comum', power: 13, cost: 30
  });
  assert.equal(adventurer.insuranceCost, 26);
  assert.equal(adventurer.isIdle(), true);
  adventurer.markOnMission();
  assert.equal(adventurer.isOnMission(), true);
  adventurer.markIdle();
  assert.equal(adventurer.isIdle(), true);
});

test('seguro é consumido uma única vez', () => {
  const adventurer = new Adventurer({
    id: 2, name: 'Lyra', cls: 'Mago', rar: 'Raro', power: 20, cost: 90, insured: true
  });
  assert.equal(adventurer.consumeInsurance(), true);
  assert.equal(adventurer.insured, false);
  assert.equal(adventurer.consumeInsurance(), false);
});

test('restauração valida campos e IDs duplicados', () => {
  const used = new Set();
  const valid = { id: 3, name: NAMES[0], cls: CLASSES[0], rar: RARITIES[0].name, power: 8, cost: 30 };
  assert.ok(Adventurer.fromSaved(valid, used) instanceof Adventurer);
  assert.equal(Adventurer.fromSaved(valid, used), null);
  assert.equal(Adventurer.fromSaved({ ...valid, id: 4, name: 'Desconhecido' }, used), null);
  assert.equal(Adventurer.fromSaved({ ...valid, id: 5, power: 0 }, used), null);
});

test('serialização preserva os dados e restaura status como ocioso', () => {
  const adventurer = new Adventurer({
    id: 6, name: 'Mira', cls: 'Clérigo', rar: 'Épico', power: 30, cost: 220,
    insured: true, status: 'mission', hpTimer: 42
  });
  const restored = Adventurer.fromSaved(JSON.parse(JSON.stringify(adventurer)));
  assert.equal(restored.id, 6);
  assert.equal(restored.insured, true);
  assert.equal(restored.hpTimer, 42);
  assert.equal(restored.isIdle(), true);
});

test('Mission limita chance de sucesso e aplica recompensas com multiplicador', () => {
  const mission = new Mission({ name: 'Teste', req: 10, gold: 35, rep: 2, risk: 0.1, dur: 1 });
  assert.equal(mission.successChance(0), 0.1);
  assert.equal(mission.successChance(100), 0.95);
  const state = { gold: 10, totalGold: 50, rep: 1 };
  const reward = mission.applyRewards(state, 1.5);
  assert.deepEqual(reward, { gold: 53, campaignAdvanced: false });
  assert.deepEqual(state, { gold: 63, totalGold: 103, rep: 3 });
});

test('CampaignMission avança somente a etapa correspondente', () => {
  const state = { gold: 0, totalGold: 0, rep: 0, campaignStage: 0 };
  const first = CAMPAIGN[0].applyRewards(state, 1);
  assert.equal(first.campaignAdvanced, true);
  assert.equal(state.campaignStage, 1);
  const repeated = CAMPAIGN[0].applyRewards(state, 1);
  assert.equal(repeated.campaignAdvanced, false);
  assert.equal(state.campaignStage, 1);
  const second = new CampaignMission(1, {
    name: 'Segunda', req: 20, gold: 10, rep: 2, risk: 0.2, dur: 1
  });
  assert.equal(second.applyRewards(state, 1).campaignAdvanced, true);
  assert.equal(state.campaignStage, 2);
});

console.log('OK: ' + passed + '/7 testes unitários de domínio aprovados.');
