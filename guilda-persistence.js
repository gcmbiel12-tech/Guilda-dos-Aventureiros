(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.GuildaPersistence = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  class PersistenceService {
    constructor({ Adventurer, missions, campaign, storageKey = 'guildaSave', version = 2, storage = null }) {
      if (typeof Adventurer !== 'function' || !Array.isArray(missions) || !Array.isArray(campaign)) {
        throw new TypeError('PersistenceService exige Adventurer, missions e campaign.');
      }
      this.Adventurer = Adventurer;
      this.missions = missions;
      this.campaign = campaign;
      this.storageKey = storageKey;
      this.version = version;
      this.storage = storage;
    }

    restoreMission(saved) {
      if (!saved || typeof saved.name !== 'string') return null;
      if (Number.isInteger(saved.campaignStep)) return this.campaign[saved.campaignStep] || null;
      return this.missions.find(mission => mission.name === saved.name) || null;
    }

    load(target) {
      try {
        const storage = this.storage || localStorage;
        const raw = storage.getItem(this.storageKey);
        if (!raw) return false;
        const saved = JSON.parse(raw);
        if (!saved || typeof saved !== 'object') return false;

        target.gold = Number.isFinite(saved.gold) && saved.gold >= 0 ? saved.gold : target.gold;
        target.rep = Number.isFinite(saved.rep) && saved.rep >= 0 ? saved.rep : target.rep;
        target.level = Number.isInteger(saved.level) && saved.level >= 1 ? saved.level : target.level;
        target.scrolls = Number.isInteger(saved.scrolls) && saved.scrolls >= 0 ? saved.scrolls : target.scrolls;
        target.totalGold = Number.isFinite(saved.totalGold) && saved.totalGold >= 0 ? saved.totalGold : target.totalGold;
        target.nextId = Number.isInteger(saved.nextId) && saved.nextId >= 1 ? saved.nextId : target.nextId;
        target.campaignStage = Number.isInteger(saved.campaignStage)
          ? Math.max(0, Math.min(this.campaign.length, saved.campaignStage))
          : target.campaignStage;

        const usedIds = new Set();
        target.roster = Array.isArray(saved.roster)
          ? saved.roster.map(adventurer => this.Adventurer.fromSaved(adventurer, usedIds)).filter(Boolean)
          : [];
        target.tavern = Array.isArray(saved.tavern)
          ? saved.tavern.map(adventurer => this.Adventurer.fromSaved(adventurer, usedIds)).filter(Boolean)
          : [];

        const rosterIds = new Set(target.roster.map(adventurer => adventurer.id));
        const claimedIds = new Set();
        target.active = Array.isArray(saved.active) ? saved.active.map(active => {
          const mission = this.restoreMission(active && active.m);
          if (!mission || !Array.isArray(active.party) || !Number.isFinite(active.start) ||
              !Number.isFinite(active.dur) || active.dur <= 0 ||
              !Number.isFinite(active.end) || active.end < active.start) return null;
          const party = [...new Set(active.party)].filter(id => rosterIds.has(id) && !claimedIds.has(id));
          if (!party.length) return null;
          party.forEach(id => claimedIds.add(id));
          return { m: mission, party, start: active.start, dur: active.dur, end: active.end };
        }).filter(Boolean) : [];

        const activeIds = new Set(target.active.flatMap(active => active.party));
        target.roster.forEach(adventurer => {
          if (activeIds.has(adventurer.id)) adventurer.markOnMission();
        });
        target.sel = Array.isArray(saved.sel)
          ? saved.sel.filter(id => rosterIds.has(id) && !activeIds.has(id))
          : [];

        const maxId = Math.max(0, ...target.roster.map(adventurer => adventurer.id), ...target.tavern.map(adventurer => adventurer.id));
        target.nextId = Math.max(target.nextId, maxId + 1);
        return true;
      } catch (error) {
        console.warn('Não foi possível carregar o salvamento da guilda.', error);
        return false;
      }
    }

    save(source) {
      try {
        const storage = this.storage || localStorage;
        storage.setItem(this.storageKey, JSON.stringify({
          version: this.version,
          gold: source.gold,
          rep: source.rep,
          level: source.level,
          scrolls: source.scrolls,
          totalGold: source.totalGold,
          nextId: source.nextId,
          roster: source.roster,
          tavern: source.tavern,
          active: source.active,
          sel: source.sel,
          campaignStage: source.campaignStage
        }));
        return true;
      } catch (error) {
        console.warn('Não foi possível salvar o progresso da guilda.', error);
        return false;
      }
    }
  }

  return { PersistenceService };
});
