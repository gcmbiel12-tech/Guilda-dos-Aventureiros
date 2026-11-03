(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.GuildaExpeditionView = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const CAMPAIGN_SCENES = [
    { title: 'As Terras Corrompidas', icon: '&#127795;', atmosphere: 'forest', encounter: 'Cerco demon\u00edaco', beats: ['A fronteira do reino', 'O cerco se aproxima', 'Rompendo as linhas inimigas'] },
    { title: 'Fortaleza das Cinzas', icon: '&#127984;', atmosphere: 'ruins', encounter: 'Comandante demon\u00edaco', beats: ['A fortaleza ao longe', 'O comandante aparece', 'A defesa finalmente cede'] },
    { title: 'O Abismo Rubro', icon: '&#127755;', atmosphere: 'dark', encounter: 'Ex\u00e9rcito infernal', beats: ['O portal se abre', 'A energia do abismo cresce', 'O ex\u00e9rcito perde sua for\u00e7a'] },
    { title: 'Rei Dem\u00f4nio', icon: '&#128081;', atmosphere: 'citadel', encounter: 'Rei Dem\u00f4nio', beats: ['Diante do trono sombrio', 'O \u00faltimo inimigo se revela', 'O confronto pelo destino do reino'] },
  ];
  const COMMON_SCENES = [
    { title: 'Estrada da aventura', icon: '&#127793;', atmosphere: 'road', beats: ['Deixando a seguran\u00e7a da Guilda', 'Explorando a regi\u00e3o', 'Retornando com o resultado'] },
    { title: 'Territ\u00f3rio selvagem', icon: '&#127795;', atmosphere: 'forest', beats: ['Seguindo as trilhas', 'Um perigo se aproxima', 'A trilha de volta'] },
    { title: 'Ru\u00ednas esquecidas', icon: '&#128511;', atmosphere: 'ruins', beats: ['Chegando \u00e0s ru\u00ednas', 'Investigando o local', 'Reunindo a equipe'] },
  ];
  function snapshot(active, now = Date.now()) {
    if (!active || !active.m || !Number.isFinite(active.start) || !Number.isFinite(active.dur) || active.dur <= 0) throw new TypeError('ExpeditionView requires a valid active journey');
    const elapsed = Math.max(0, now - active.start);
    const progress = Math.max(0, Math.min(100, elapsed / active.dur * 100));
    const phase = progress < 18 ? 'departure' : progress < 62 ? 'exploration' : progress < 88 ? 'objective' : 'return';
    const phaseIndex = phase === 'departure' ? 0 : phase === 'return' ? 2 : 1;
    const campaignStep = Number.isInteger(active.m.campaignStep) ? active.m.campaignStep : -1;
    const isCampaign = campaignStep >= 0;
    const scene = isCampaign ? CAMPAIGN_SCENES[Math.min(campaignStep, CAMPAIGN_SCENES.length - 1)] : COMMON_SCENES[(Number(active.m.req) || 0) % COMMON_SCENES.length];
    return {
      progress, phase, phaseIndex, isCampaign, campaignStep, scene,
      beat: scene.beats[phaseIndex],
      phaseLabel: ({ departure: 'Partindo da Guilda', exploration: 'Explorando e enfrentando perigos', objective: isCampaign ? 'Confronto decisivo' : 'Concluindo o objetivo', return: 'Retornando \u00e0 Guilda' })[phase],
      atmosphere: scene.atmosphere, encounter: isCampaign ? scene.encounter : null,
      isConfrontation: isCampaign && phase === 'objective',
    };
  }
  function outcome({ mission, campaignStageBefore, campaignStageAfter, goldBefore, goldAfter, repBefore, repAfter, now = Date.now() }) {
    const isCampaign = Number.isInteger(mission && mission.campaignStep);
    const success = goldAfter > goldBefore || repAfter > repBefore || campaignStageAfter > campaignStageBefore;
    const finalVictory = isCampaign && campaignStageAfter >= CAMPAIGN_SCENES.length;
    return {
      success, isCampaign, campaignStep: isCampaign ? mission.campaignStep : -1,
      finalVictory, missionName: mission && mission.name || 'Expedi\u00e7\u00e3o',
      title: finalVictory ? 'A Guilda salvou o reino!' : success ? (isCampaign ? 'Etapa da campanha conclu\u00edda' : 'Expedi\u00e7\u00e3o bem-sucedida') : 'Expedi\u00e7\u00e3o malsucedida',
      timestamp: now,
    };
  }
  return { snapshot, outcome, CAMPAIGN_SCENES, COMMON_SCENES };
});
