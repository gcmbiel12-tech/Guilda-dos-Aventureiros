const assert = require('node:assert/strict');
const { GuildService, MISSIONS, CAMPAIGN, RARITIES } = require('../guilda-domain.js');

const SAMPLE_SIZE = 20000;
function seededRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value = (1664525 * value + 1013904223) >>> 0;
    return value / 4294967296;
  };
}
function percentile(values, p) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor((sorted.length - 1) * p)];
}
function makeRoster({ level, scrolls, size, random }) {
  const state = { level, scrolls, nextId: 1 };
  const guild = new GuildService(state, { random });
  return Array.from({ length: size }, () => guild.createAdventurer())
    .sort((a, b) => b.power - a.power);
}
function evaluate(mission, parties) {
  let success = 0;
  let expectedLosses = 0;
  let expectedReplacementCost = 0;
  for (const party of parties) {
    const power = party.reduce((sum, hero) => sum + hero.power, 0);
    const chance = mission.successChance(power);
    success += chance;
    expectedLosses += (1 - chance) * mission.risk * party.length;
    expectedReplacementCost += (1 - chance) * mission.risk *
      party.reduce((sum, hero) => sum + hero.cost, 0);
  }
  const probability = success / parties.length;
  const durationMinutes = mission.dur / 60;
  return {
    success: probability,
    expectedLosses: expectedLosses / parties.length,
    grossGoldPerMinute: mission.gold * probability / durationMinutes,
    netGoldPerMinute: (mission.gold * probability -
      expectedReplacementCost / parties.length) / durationMinutes
  };
}

let passed = 0;
function test(name, run) {
  run();
  passed++;
  console.log('PASS ' + name);
}

const random = seededRandom(20261101);
const rarityCounts = new Map(RARITIES.map(r => [r.name, 0]));
const powerSamples = [];
const costSamples = [];
for (let i = 0; i < SAMPLE_SIZE; i++) {
  const [hero] = makeRoster({ level: 1, scrolls: 0, size: 1, random });
  rarityCounts.set(hero.rar, rarityCounts.get(hero.rar) + 1);
  powerSamples.push(hero.power);
  costSamples.push(hero.cost);
}
const rarityPct = RARITIES.map(r => rarityCounts.get(r.name) / SAMPLE_SIZE * 100);
const meanPower = powerSamples.reduce((a, b) => a + b, 0) / SAMPLE_SIZE;
const meanCost = costSamples.reduce((a, b) => a + b, 0) / SAMPLE_SIZE;

test('geração mantém as probabilidades de raridade configuradas', () => {
  const expected = RARITIES.map(r => r.w);
  rarityPct.forEach((observed, i) => assert.ok(
    Math.abs(observed - expected[i]) < 0.8,
    RARITIES[i].name + ': observado ' + observed.toFixed(2) + '%'
  ));
});

test('baseline de geração permanece dentro da faixa histórica', () => {
  assert.ok(meanPower > 13.5 && meanPower < 15);
  assert.ok(meanCost > 110 && meanCost < 125);
  assert.ok(percentile(powerSamples, 0.5) >= 10 && percentile(powerSamples, 0.5) <= 12);
});

const earlyRandom = seededRandom(3102026);
const earlyRosters = Array.from({ length: SAMPLE_SIZE }, () =>
  makeRoster({ level: 1, scrolls: 0, size: 4, random: earlyRandom }));
const earlyCampaign = CAMPAIGN.map(m => evaluate(m,
  earlyRosters.map(roster => roster.slice(0, 2))));

test('progressão inicial de campanha tem dificuldade crescente', () => {
  const rates = earlyCampaign.map(x => x.success);
  assert.ok(rates[0] > 0.90 && rates[0] < 0.96);
  assert.ok(rates[1] > 0.62 && rates[1] < 0.72);
  assert.ok(rates[2] > 0.40 && rates[2] < 0.49);
  assert.ok(rates[3] > 0.28 && rates[3] < 0.36);
  assert.ok(rates[0] > rates[1] && rates[1] > rates[2] && rates[2] > rates[3]);
});

const advancedRandom = seededRandom(20261101);
const advancedRosters = Array.from({ length: SAMPLE_SIZE }, () =>
  makeRoster({ level: 4, scrolls: 0, size: 11, random: advancedRandom }));
const advancedParties = advancedRosters.map(roster => roster.slice(0, 5));
const advancedCampaign = CAMPAIGN.map(m => evaluate(m, advancedParties));

test('grupo máximo de nível 4 sem prestígio ainda enfrenta risco relevante no final', () => {
  assert.ok(advancedCampaign[1].success > 0.90);
  assert.ok(advancedCampaign[2].success > 0.80 && advancedCampaign[2].success < 0.95);
  assert.ok(advancedCampaign[3].success > 0.60 && advancedCampaign[3].success < 0.74);
  assert.ok(advancedCampaign[3].expectedLosses > 0.9);
});

const prestigeRandom = seededRandom(20261101);
const prestigeRosters = Array.from({ length: SAMPLE_SIZE }, () =>
  makeRoster({ level: 4, scrolls: 3, size: 11, random: prestigeRandom }));
const prestigeParties = prestigeRosters.map(roster => roster.slice(0, 5));
const prestigeCampaign = CAMPAIGN.map(m => evaluate(m, prestigeParties));

test('prestígio aumenta poder e reduz a atrição esperada da campanha final', () => {
  assert.ok(prestigeCampaign[3].success > advancedCampaign[3].success + 0.15);
  assert.ok(prestigeCampaign[3].expectedLosses < advancedCampaign[3].expectedLosses * 0.6);
});

const tower = evaluate(MISSIONS[4], advancedParties);
const dragon = evaluate(MISSIONS[3], advancedParties);
test('contratos de alto nível recompensam mais por minuto, mas elevam exposição a perdas', () => {
  assert.ok(tower.grossGoldPerMinute > MISSIONS[0].gold / (MISSIONS[0].dur / 60));
  assert.ok(tower.expectedLosses > dragon.expectedLosses);
});

const legendaryChancePerRefresh = 1 - Math.pow(1 - 0.04, 4);
test('renovação gratuita de quatro candidatos mantém o risco de reroll documentado', () => {
  assert.ok(legendaryChancePerRefresh > 0.14 && legendaryChancePerRefresh < 0.16);
  assert.ok(1 - Math.pow(1 - legendaryChancePerRefresh, 10) > 0.80);
});

console.log('BASELINE ' + JSON.stringify({
  sampleSize: SAMPLE_SIZE,
  rarityPct: rarityPct.map(x => +x.toFixed(2)),
  meanPower: +meanPower.toFixed(2),
  medianPower: percentile(powerSamples, 0.5),
  meanHireCost: +meanCost.toFixed(2),
  earlyCampaign: earlyCampaign.map(x => ({
    successPct: +(x.success * 100).toFixed(1),
    expectedLosses: +x.expectedLosses.toFixed(3)
  })),
  level4Campaign: advancedCampaign.map(x => ({
    successPct: +(x.success * 100).toFixed(1),
    expectedLosses: +x.expectedLosses.toFixed(3)
  })),
  level4ThreePrestigesFinal: {
    successPct: +(prestigeCampaign[3].success * 100).toFixed(1),
    expectedLosses: +prestigeCampaign[3].expectedLosses.toFixed(3)
  },
  level4MissionEconomy: {
    towerGoldPerMinute: +tower.grossGoldPerMinute.toFixed(1),
    towerNetAfterExpectedReplacementPerMinute: +tower.netGoldPerMinute.toFixed(1),
    towerExpectedLosses: +tower.expectedLosses.toFixed(3),
    dragonExpectedLosses: +dragon.expectedLosses.toFixed(3)
  },
  freeRefreshLegendaryChancePct: +(legendaryChancePerRefresh * 100).toFixed(2),
  chanceAtLeastOneLegendaryAfter10RefreshesPct: +((1 - Math.pow(1 - legendaryChancePerRefresh, 10)) * 100).toFixed(1)
}));
console.log('OK: ' + passed + '/7 testes de baseline econômico aprovados.');
