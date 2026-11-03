(function (root, factory) {
  const domain = factory();
  if (typeof module === 'object' && module.exports) module.exports = domain;
  if (root) root.GuildaDomain = domain;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const CLASSES = ['Guerreiro', 'Mago', 'Ladino', 'Clérigo', 'Arqueiro'];
  const RARITIES = [
    { name: 'Comum', mult: 1, cost: 30, w: 55 },
    { name: 'Raro', mult: 1.7, cost: 90, w: 28 },
    { name: 'Épico', mult: 2.8, cost: 220, w: 13 },
    { name: 'Lendário', mult: 4.6, cost: 500, w: 4 }
  ];
  const NAMES = ['Thorin', 'Lyra', 'Kael', 'Mira', 'Dorn', 'Sana', 'Fendrel', 'Yuna', 'Borin', 'Vesna', 'Taryn', 'Orin', 'Elowen', 'Griff', 'Nessa'];

  class Adventurer {
    constructor({ id, name, cls, rar, power, cost, insured = false, status = 'idle', hpTimer = 0 }) {
      this.id = id;
      this.name = name;
      this.cls = cls;
      this.rar = rar;
      this.power = power;
      this.cost = cost;
      this.insured = Boolean(insured);
      this.status = status;
      this.hpTimer = hpTimer;
    }
    static fromSaved(raw, usedIds = new Set()) {
      if (!raw || !Number.isInteger(raw.id) || raw.id < 1 || usedIds.has(raw.id) ||
          !NAMES.includes(raw.name) || !Number.isFinite(raw.power) || raw.power <= 0 ||
          !Number.isFinite(raw.cost) || raw.cost < 0 || !CLASSES.includes(raw.cls) ||
          !RARITIES.some((rarity) => rarity.name === raw.rar)) return null;
      usedIds.add(raw.id);
      return new Adventurer({ ...raw, insured: Boolean(raw.insured), status: 'idle' });
    }
    get insuranceCost() { return Math.round(this.power * 2); }
    isIdle() { return this.status === 'idle'; }
    isOnMission() { return this.status === 'mission'; }
    markOnMission() { this.status = 'mission'; }
    markIdle() { this.status = 'idle'; }
    consumeInsurance() {
      if (!this.insured) return false;
      this.insured = false;
      return true;
    }
    toJSON() {
      return {
        id: this.id, name: this.name, cls: this.cls, rar: this.rar, power: this.power,
        cost: this.cost, insured: this.insured, status: this.status, hpTimer: this.hpTimer
      };
    }
  }

  class Mission {
    constructor(config) { Object.assign(this, config); }
    successChance(power) { return Math.min(0.95, power / this.req * 0.85 + 0.1); }
    applyRewards(state, multiplier) {
      const gold = Math.round(this.gold * multiplier);
      state.gold += gold;
      state.totalGold += gold;
      state.rep += this.rep;
      return { gold, campaignAdvanced: false };
    }
  }

  class CampaignMission extends Mission {
    constructor(step, config) { super(config); this.campaignStep = step; }
    applyRewards(state, multiplier) {
      const reward = super.applyRewards(state, multiplier);
      if (this.campaignStep === state.campaignStage) {
        state.campaignStage++;
        reward.campaignAdvanced = true;
      }
      return reward;
    }
  }

  class GuildService {
    constructor(state, { random = () => Math.random() } = {}) {
      this.state = state;
      this.random = random;
    }
    multiplier() { return 1 + this.state.scrolls * 0.15; }
    partyMax() { return Math.min(5, 1 + this.state.level); }
    rosterMax() { return 3 + this.state.level * 2; }
    hallCost() { return Math.round(100 * Math.pow(1.6, this.state.level - 1)); }
    createAdventurer() {
      const total = RARITIES.reduce((sum, rarity) => sum + rarity.w, 0);
      let roll = this.random() * total;
      let rarity = RARITIES[0];
      for (const candidate of RARITIES) {
        if (roll < candidate.w) { rarity = candidate; break; }
        roll -= candidate.w;
      }
      const cls = CLASSES[Math.floor(this.random() * CLASSES.length)];
      const name = NAMES[Math.floor(this.random() * NAMES.length)];
      const power = Math.round((6 + this.random() * 6) * rarity.mult * this.multiplier());
      return new Adventurer({
        id: this.state.nextId++, name, cls, rar: rarity.name, power,
        cost: Math.round(rarity.cost * (1 + this.state.level * 0.3))
      });
    }
    refreshTavern() {
      this.state.tavern = Array.from({ length: 4 }, () => this.createAdventurer());
      return this.state.tavern;
    }
    toggleSelection(id) {
      const adventurer = this.state.roster.find(item => item.id === id);
      if (!adventurer || !adventurer.isIdle()) return { ok: false, code: 'unavailable' };
      const index = this.state.sel.indexOf(id);
      if (index >= 0) {
        this.state.sel.splice(index, 1);
        return { ok: true, selected: false };
      }
      if (this.state.sel.length >= this.partyMax()) return { ok: false, code: 'party-full' };
      this.state.sel.push(id);
      return { ok: true, selected: true };
    }
    insure(id) {
      const adventurer = this.state.roster.find(item => item.id === id);
      if (!adventurer || !adventurer.isIdle() || adventurer.insured) return { ok: false, code: 'unavailable' };
      const cost = adventurer.insuranceCost;
      if (this.state.gold < cost) return { ok: false, code: 'insufficient-gold', cost };
      this.state.gold -= cost;
      adventurer.insured = true;
      return { ok: true, adventurer, cost };
    }
    hire(index) {
      const adventurer = this.state.tavern[index];
      if (!adventurer) return { ok: false, code: 'missing-adventurer' };
      if (this.state.gold < adventurer.cost) return { ok: false, code: 'insufficient-gold' };
      if (this.state.roster.length >= this.rosterMax()) return { ok: false, code: 'roster-full' };
      this.state.gold -= adventurer.cost;
      this.state.roster.push(adventurer);
      this.state.tavern.splice(index, 1);
      return { ok: true, adventurer };
    }
    upgradeHall() {
      const cost = this.hallCost();
      if (this.state.gold < cost) return { ok: false, code: 'insufficient-gold', cost };
      this.state.gold -= cost;
      this.state.level++;
      return { ok: true, cost, level: this.state.level };
    }
    prestige() {
      if (this.state.totalGold < 400) return { ok: false, code: 'insufficient-total-gold' };
      const gain = Math.floor(Math.sqrt(this.state.totalGold / 40));
      this.state.scrolls += gain;
      this.state.gold = 120;
      this.state.totalGold = 0;
      this.state.rep = 0;
      this.state.level = 1;
      this.state.roster = [];
      this.state.active = [];
      this.state.sel = [];
      return { ok: true, gain, multiplier: this.multiplier() };
    }
  }

  const MISSIONS = [
    new Mission({ name: 'Patrulha na Floresta', dur: 15, req: 8, gold: 35, rep: 1, risk: 0.15 }),
    new Mission({ name: 'Caçada a Goblins', dur: 30, req: 16, gold: 80, rep: 2, risk: 0.25 }),
    new Mission({ name: 'Ruínas Antigas', dur: 60, req: 30, gold: 200, rep: 4, risk: 0.35 }),
    new Mission({ name: 'Covil do Dragão Jovem', dur: 120, req: 55, gold: 500, rep: 9, risk: 0.5 }),
    new Mission({ name: 'Torre Amaldiçoada', dur: 200, req: 85, gold: 1100, rep: 16, risk: 0.6 })
  ];
  const CAMPAIGN = [
    new CampaignMission(0, { name: 'I — As Terras Corrompidas', desc: 'Rompa o cerco dos demônios nas fronteiras.', dur: 45, req: 25, gold: 180, rep: 5, risk: 0.25 }),
    new CampaignMission(1, { name: 'II — Fortaleza das Cinzas', desc: 'Derrote o comandante demoníaco.', dur: 90, req: 55, gold: 450, rep: 10, risk: 0.4 }),
    new CampaignMission(2, { name: 'III — O Abismo Rubro', desc: 'Atravesse o portal e enfraqueça o exército infernal.', dur: 150, req: 95, gold: 1000, rep: 20, risk: 0.5 }),
    new CampaignMission(3, { name: 'IV — Rei Demônio', desc: 'A batalha final pelo destino do reino.', dur: 240, req: 150, gold: 2500, rep: 50, risk: 0.65 })
  ];

  return { Adventurer, Mission, CampaignMission, GuildService, CLASSES, RARITIES, NAMES, MISSIONS, CAMPAIGN };
});
