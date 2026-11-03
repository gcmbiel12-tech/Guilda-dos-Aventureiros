(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.GuildaJourney = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  class JourneyService {
    constructor({ state, save = () => {}, render = () => {}, log = () => {},
      multiplier = () => 1, campaign = [], random = () => Math.random(),
      now = () => Date.now() }) {
      this.state = state;
      this.save = save;
      this.render = render;
      this.log = log;
      this.multiplier = multiplier;
      this.campaign = campaign;
      this.random = random;
      this.now = now;
    }
    dispatch(m) {
      const state = this.state;
      if (!m || !Number.isFinite(m.dur) || m.dur <= 0) return;
      if (state.sel.length === 0) {
        this.log('Selecione ao menos um aventureiro no roster.');
        return;
      }
      const party = state.sel.map(id => state.roster.find(a => a.id === id)).filter(a => a && a.isIdle());
      if (!party.length || party.length !== state.sel.length) {
        this.log('O grupo selecionado não está mais disponível.');
        state.sel = [];
        this.save();
        this.render();
        return;
      }
      const start = this.now();
      party.forEach(a => a.markOnMission());
      state.active.push({ m, party: party.map(a => a.id), end: start + m.dur * 1000, start, dur: m.dur * 1000 });
      state.sel = [];
      this.log('Grupo despachado para: ' + m.name);
      this.save();
      this.render();
    }
    resolveMission(mi) {
      const state = this.state;
      const am = state.active[mi];
      if (!am || !am.m || !Array.isArray(am.party)) return false;
      const party = am.party.map(id => state.roster.find(a => a.id === id)).filter(Boolean);
      const power = party.reduce((sum, a) => sum + a.power, 0);
      const success = this.random() < am.m.successChance(power);
      if (success) {
        const reward = am.m.applyRewards(state, this.multiplier());
        if (reward.campaignAdvanced) {
          this.log(state.campaignStage === this.campaign.length
            ? 'VITÓRIA! O Rei Demônio foi derrotado! A lenda da guilda será lembrada para sempre.'
            : 'Vitória na campanha! Etapa concluída: ' + am.m.name + '. Próxima etapa desbloqueada.');
        } else {
          this.log('Sucesso em "' + am.m.name + '"! +' + reward.gold + ' ouro, +' + am.m.rep + ' reputação.');
        }
      } else {
        let msg = 'Fracasso em "' + am.m.name + '". ';
        party.forEach(a => {
          if (this.random() < am.m.risk) {
            if (a.consumeInsurance()) msg += a.name + ' ficou gravemente ferido mas sobreviveu (seguro usado). ';
            else {
              state.roster = state.roster.filter(r => r.id !== a.id);
              msg += a.name + ' não resistiu... ';
            }
          }
        });
        this.log(msg);
      }
      party.forEach(a => { if (state.roster.includes(a)) a.markIdle(); });
      state.active.splice(mi, 1);
      this.save();
      return true;
    }
  }

  return { JourneyService };
});
