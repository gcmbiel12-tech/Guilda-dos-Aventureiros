/*
 * Suíte de regressão persistente da Guilda dos Aventureiros.
 *
 * Uso: npm test
 * Ou diretamente: node tests/guilda-regression.cjs [caminho-do-html]
 *
 * A suíte abre o HTML em um perfil temporário do Puppeteer, injeta salvamentos
 * sintéticos antes da execução do jogo e controla Math.random apenas nos testes
 * que dependem de sucesso ou falha. Ela não modifica o HTML, os backups nem o
 * localStorage do perfil normal do usuário.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { pathToFileURL } = require('url');

const EXPECTED_SCENARIOS = 13;
const PROJECT_PACKAGE = path.join(__dirname, '..', 'package.json');

function expectedPuppeteerVersion() {
  try {
    const pkg = JSON.parse(fs.readFileSync(PROJECT_PACKAGE, 'utf8'));
    return pkg.devDependencies && pkg.devDependencies.puppeteer || null;
  } catch (_) {
    return null;
  }
}

function resolvePuppeteer() {
  const projectRoot = path.join(__dirname, '..');
  const expectedVersion = expectedPuppeteerVersion();

  let resolvedPath;
  try {
    resolvedPath = require.resolve('puppeteer', { paths: [projectRoot] });
  } catch (error) {
    throw new Error(
      'Puppeteer ' + (expectedVersion || '') + ' nao encontrado em node_modules. ' +
      'Execute `npm install` antes de `npm test` para instalar a dependencia declarada em package.json.'
    );
  }

  let library;
  try {
    library = require(resolvedPath);
  } catch (error) {
    throw new Error('Falha ao carregar o Puppeteer local: ' + (error.stack || error.message || error), { cause: error });
  }

  try {
    const installed = require(path.join(path.dirname(resolvedPath), 'package.json'));
    if (expectedVersion && installed.version !== expectedVersion) {
      throw new Error(
        'Versao do Puppeteer instalada (' + installed.version + ') difere da declarada (' + expectedVersion + '). ' +
        'Execute `npm ci` ou `npm install` para sincronizar.'
      );
    }
  } catch (error) {
    if (error && /difere da declarada/.test(error.message || '')) throw error;
  }

  return { library, source: 'node_modules local' };
}
const ADV = (id, overrides = {}) => ({
  id,
  name: id === 2 ? 'Lyra' : 'Thorin',
  cls: 'Guerreiro',
  rar: 'Comum',
  power: 100,
  cost: 30,
  insured: false,
  status: 'idle',
  ...overrides,
});

const TAVERN = [ADV(2, { name: 'Lyra' })];

const mission = (name, party, start, end, extra = {}) => ({
  m: { name, ...extra },
  party,
  start,
  dur: end - start,
  end,
});

const save = (overrides = {}) => ({
  version: 2,
  gold: 120,
  rep: 0,
  level: 1,
  scrolls: 0,
  totalGold: 0,
  nextId: 3,
  roster: [ADV(1)],
  tavern: TAVERN,
  active: [],
  sel: [],
  campaignStage: 0,
  ...overrides,
});

const CAMPAIGN_REWARDS = [
  { gold: 180, rep: 5 },
  { gold: 450, rep: 10 },
  { gold: 1000, rep: 20 },
  { gold: 2500, rep: 50 },
];

async function main() {
  const htmlPath = path.resolve(process.argv[2] || path.join(__dirname, '..', 'Guilda dos Aventureiros.html'));
  if (!fs.existsSync(htmlPath)) {
    throw new Error('HTML não encontrado: ' + htmlPath);
  }

  const { library: puppeteer, source } = resolvePuppeteer();
  console.log('Puppeteer:', source);

  const fileUrl = pathToFileURL(htmlPath).href;
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'guilda-regression-'));
  const results = [];
  const allPageErrors = [];
  let browser;

  const record = (name, ok, details) => results.push({ name, ok, details });

  try {
    browser = await puppeteer.launch({
      headless: true,
      userDataDir,
      args: ['--no-sandbox', '--disable-gpu'],
    });

    async function scenario(name, rawSave, rng = [], after) {
      const page = await browser.newPage();
      const errors = [];
      page.on('pageerror', (error) => errors.push('pageerror: ' + error.message));
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push('console.error: ' + message.text());
      });

      try {
        await page.evaluateOnNewDocument(({ rawSave, rng }) => {
          try {
            if (rawSave === null) localStorage.removeItem('guildaSave');
            else localStorage.setItem('guildaSave', rawSave);
            localStorage.setItem('__guildaTestRng', JSON.stringify(rng));
          } catch (_) {
            // O teste falhará na leitura do estado se o localStorage não existir.
          }

          const original = Math.random;
          Math.random = function () {
            try {
              const raw = localStorage.getItem('__guildaTestRng');
              if (raw) {
                const queue = JSON.parse(raw);
                if (Array.isArray(queue) && queue.length) {
                  const value = queue.shift();
                  localStorage.setItem('__guildaTestRng', JSON.stringify(queue));
                  return value;
                }
              }
            } catch (_) {
              // Usa o gerador original se o controle de RNG falhar.
            }
            return original();
          };
        }, { rawSave, rng });

        await page.goto(fileUrl, { waitUntil: 'load' });
        await page.waitForSelector('#gold', { timeout: 5000 });
        await page.waitForFunction(() => document.readyState === 'complete' && !!document.getElementById('log'), { timeout: 5000 });
        await new Promise((resolve) => setTimeout(resolve, 450));
        // Força a persistência do estado restaurado, como o jogo faz em pagehide.
        await page.evaluate(() => window.dispatchEvent(new Event('pagehide')));

        const read = async () => page.evaluate(() => {
          const raw = localStorage.getItem('guildaSave');
          return {
            save: raw ? JSON.parse(raw) : null,
            goldText: document.getElementById('gold').textContent,
            repText: document.getElementById('rep').textContent,
            campaignText: document.getElementById('campaign').textContent,
            rosterCards: document.querySelectorAll('#roster .card').length,
            tavernCards: document.querySelectorAll('#tavern .card').length,
            tavernInteractive: document.querySelector('#tavern .card')?.getAttribute('role') === 'button',
            dispatchDisabledWithoutSelection: document.querySelector('#missions .mission button')?.disabled === true,
            logIsLiveRegion: document.getElementById('log').getAttribute('aria-live') === 'polite',
            tavernAvatars: document.querySelectorAll('#tavern .npc-avatar, #tavern .npc-sprite').length,
            tavernDialogues: document.querySelectorAll('#tavern .npc-dialogue[data-motion=\"recruit\"]').length,
            rosterDialogues: document.querySelectorAll('#roster .npc-dialogue').length,
            busyDialogue: document.querySelector('#roster .card.busy .npc-dialogue')?.dataset.motion || '',
            tavernAnimation: document.querySelector('#tavern .npc-avatar') ? getComputedStyle(document.querySelector('#tavern .npc-avatar')).animationName : '',
            rosterAvatars: document.querySelectorAll('#roster .npc-avatar').length,
            busyAvatarMotion: document.querySelector('#roster .card.busy .npc-avatar')?.classList.contains('npc-avatar--journey') || false,
            busySprite: !!document.querySelector('#journeys .npc-sprite--idle'),
            confrontationSprite: !!document.querySelector('#journeys .npc-sprite--attack'),
            busyCards: document.querySelectorAll('#roster .card.busy').length,
            journeyCount: document.querySelectorAll('#journeys .journey').length,
            expeditionResult: document.querySelector('#journeys .expedition-result')?.textContent || '',
            expeditionResultSuccess: document.querySelector('#journeys .expedition-result')?.dataset.success || '',
            casualtyCount: document.querySelectorAll('#journeys .expedition-result__casualty').length,
            deathSprites: document.querySelectorAll('#journeys .expedition-result .npc-sprite--death').length,
            casualtyNames: Array.from(document.querySelectorAll('#journeys .expedition-result__casualty span:last-child')).map(el => el.textContent),
            deathSpriteAnimation: document.querySelector('#journeys .npc-sprite--death') ? getComputedStyle(document.querySelector('#journeys .npc-sprite--death')).animationName : '',
            deathSpriteBackground: document.querySelector('#journeys .npc-sprite--death') ? getComputedStyle(document.querySelector('#journeys .npc-sprite--death')).backgroundImage : '',
            saveHasTransientOutcome: !!raw && Object.prototype.hasOwnProperty.call(JSON.parse(raw), 'lastExpeditionResult'),
            expeditionScene: document.querySelector('#journeys .expedition-scene')?.dataset.atmosphere || '',
            expeditionPhase: document.querySelector('#journeys .expedition-scene')?.dataset.phase || '',
            expeditionBeat: document.querySelector('#journeys .expedition-scene__beat')?.textContent || '',
            log: document.getElementById('log').textContent,
          };
        });

        let state = await read();
        if (after) state = await after(page, state, read);
        return { state, errors };
      } catch (error) {
        errors.push('scenario error: ' + (error && (error.stack || error.message) || error));
        return { state: { save: null, goldText: '', repText: '', campaignText: '', rosterCards: 0, tavernCards: 0, busyCards: 0, journeyCount: 0, log: '' }, errors };
      } finally {
        allPageErrors.push(...errors.map((error) => `${name}: ${error}`));
        await page.close();
      }
    }

    // 1. Carregamento inicial, sem salvamento anterior.
    {
      const { state, errors } = await scenario('carregamento inicial', null, [], async (page, initialState) => {
        const mobileWidths = [];
        for (const width of [320, 390]) {
          await page.setViewport({ width, height: 844 });
          await page.reload({ waitUntil: 'load' });
          await page.waitForSelector('#gold', { timeout: 5000 });
          mobileWidths.push(await page.evaluate(() => ({ width: window.innerWidth, scrollWidth: document.documentElement.scrollWidth, fits: document.documentElement.scrollWidth <= window.innerWidth })));
        }
        initialState.mobileWidths = mobileWidths;
        return initialState;
      });
      record('carregamento inicial', state.save?.version === 2 && state.save?.tavern?.length === 4 && state.tavernAvatars === 4 && state.tavernDialogues === 4 && state.tavernAnimation.includes('npc-sway') && state.rosterCards === 0 && state.tavernInteractive && state.dispatchDisabledWithoutSelection && state.logIsLiveRegion && state.mobileWidths?.length === 2 && state.mobileWidths.every(item => item.fits) && errors.length === 0, {
        version: state.save?.version,
        tavern: state.save?.tavern?.length,
        tavernAvatars: state.tavernAvatars,
        tavernDialogues: state.tavernDialogues,
        tavernAnimation: state.tavernAnimation,
        rosterCards: state.rosterCards,
        errors,
      });
    }

    // 2. Missão comum: restauração, conclusão e recompensa.
    {
      const now = Date.now();
      const spec = save({ active: [mission('Patrulha na Floresta', [1], now - 20000, now - 5000)] });
      const { state, errors } = await scenario('missão comum', JSON.stringify(spec), [0.0]);
      record('missão comum: conclusão e recompensa', errors.length === 0 && state.save?.active.length === 0 && state.save?.gold === 155 && state.save?.rep === 1 && state.save?.totalGold === 35 && state.save?.roster[0]?.status === 'idle' && state.goldText === '155' && state.expeditionResult.includes('Expedição bem-sucedida') && state.expeditionResultSuccess === 'true' && state.journeyCount === 0 && state.log.includes('Sucesso'), {
        gold: state.save?.gold,
        rep: state.save?.rep,
        totalGold: state.save?.totalGold,
        active: state.save?.active.length,
        rosterStatus: state.save?.roster[0]?.status,
        journeyCount: state.journeyCount,
        log: state.log,
        errors,
      });
    }

    // 3. Falha com seguro: consome o seguro e preserva o aventureiro.
    {
      const now = Date.now();
      const spec = save({ roster: [ADV(1, { power: 1, insured: true })], active: [mission('Patrulha na Floresta', [1], now - 20000, now - 5000)] });
      const { state, errors } = await scenario('falha com seguro', JSON.stringify(spec), [0.99, 0.0]);
      record('falha: seguro consumido e aventureiro preservado', errors.length === 0 && state.save?.active.length === 0 && state.save?.roster.length === 1 && state.save?.roster[0]?.insured === false && state.save?.roster[0]?.status === 'idle' && state.save?.gold === 120 && state.log.includes('seguro usado') && state.log.includes('sobreviveu') && state.casualtyCount === 0 && state.deathSprites === 0, {
        rosterLength: state.save?.roster.length,
        insured: state.save?.roster[0]?.insured,
        rosterStatus: state.save?.roster[0]?.status,
        gold: state.save?.gold,
        log: state.log,
        errors,
      });
    }

    // 4. Falha sem seguro: remove o aventureiro.
    {
      const now = Date.now();
      const spec = save({ roster: [ADV(1, { power: 1 })], active: [mission('Patrulha na Floresta', [1], now - 20000, now - 5000)] });
      const { state, errors } = await scenario('falha sem seguro', JSON.stringify(spec), [0.99, 0.0], async (page, initialState) => {
        await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
        const reducedMotion = await page.$eval('#journeys .npc-sprite--death', element => ({ animation: getComputedStyle(element).animationName, backgroundPosition: getComputedStyle(element).backgroundPosition }));
        return { ...initialState, reducedMotionAnimation: reducedMotion.animation, reducedMotionBackgroundPosition: reducedMotion.backgroundPosition };
      });
      record('falha: perda sem seguro', errors.length === 0 && state.save?.active.length === 0 && state.save?.roster.length === 0 && state.save?.gold === 120 && state.log.includes('não resistiu') && state.casualtyCount === 1 && state.deathSprites === 1 && state.casualtyNames.includes('Thorin') && state.deathSpriteAnimation === 'sprite-death' && state.deathSpriteBackground.includes('morrendo') && state.reducedMotionAnimation === 'none' && state.reducedMotionBackgroundPosition.includes('-272px') && !state.saveHasTransientOutcome, {
        rosterLength: state.save?.roster.length,
        active: state.save?.active.length,
        gold: state.save?.gold,
        log: state.log,
        errors,
      });
    }

    // 5. Jornada em andamento sobrevive à recarga.
    {
      const spec = save({ active: [mission('Patrulha na Floresta', [1], Date.now(), Date.now() + 60000)] });
      const { state, errors } = await scenario('jornada em andamento', JSON.stringify(spec), [], async (page, firstState, read) => {
        if (firstState.save?.active.length !== 1 || firstState.journeyCount !== 1) return firstState;
        await page.reload({ waitUntil: 'load' });
        await page.waitForSelector('#gold', { timeout: 5000 });
        await page.waitForFunction(() => document.readyState === 'complete' && !!document.getElementById('log'), { timeout: 5000 });
        await new Promise((resolve) => setTimeout(resolve, 450));
        await page.evaluate(() => window.dispatchEvent(new Event('pagehide')));
        return read();
      });
      record('persistência de jornada em andamento', errors.length === 0 && state.save?.active.length === 1 && state.save?.active[0]?.party?.[0] === 1 && state.save?.roster[0]?.status === 'mission' && state.journeyCount === 1 && state.expeditionScene === 'ruins' && state.expeditionPhase === 'departure' && state.expeditionBeat === 'Chegando às ruínas' && state.busyCards === 1 && state.busyDialogue === 'journey' && state.busySprite && !state.confrontationSprite, {
        active: state.save?.active.length,
        party: state.save?.active[0]?.party,
        rosterStatus: state.save?.roster[0]?.status,
        journeyCount: state.journeyCount,
        busyCards: state.busyCards,
        busyAvatarMotion: state.busyAvatarMotion,
        busySprite: state.busySprite,
        busyDialogue: state.busyDialogue,
        errors,
      });
    }

    // 6. Os quatro capítulos da campanha avançam em sequência.
    for (let step = 0; step < 4; step += 1) {
      const start = Date.now() - 20000;
      const spec = save({
        roster: [ADV(1, { power: 1000 })],
        campaignStage: step,
        active: [mission('campaign', [1], start, start + 15000, { campaignStep: step })],
      });
      const { state, errors } = await scenario(`campanha ${step + 1}`, JSON.stringify(spec), [0.0]);
      const expected = CAMPAIGN_REWARDS[step];
      const victory = step === 3 ? state.campaignText.includes('Rei Demônio foi derrotado') : true;
      record(`campanha etapa ${step + 1}: avanço`, errors.length === 0 && state.save?.campaignStage === step + 1 && state.save?.active.length === 0 && state.save?.gold === 120 + expected.gold && state.save?.rep === expected.rep && victory && state.expeditionResult.includes(step===3?'A Guilda salvou o reino!':'Etapa da campanha concluída'), {
        campaignStage: state.save?.campaignStage,
        gold: state.save?.gold,
        rep: state.save?.rep,
        active: state.save?.active.length,
        victory,
        errors,
      });
    }

    // 7. Migração de salvamento legado.
    {
      const legacy = JSON.stringify({ scrolls: 2, campaignStage: 3 });
      const { state, errors } = await scenario('migração legada', legacy, []);
      record('migração de salvamento legado', errors.length === 0 && state.save?.version === 2 && state.save?.scrolls === 2 && state.save?.campaignStage === 3 && state.save?.tavern.length === 4, {
        version: state.save?.version,
        scrolls: state.save?.scrolls,
        campaignStage: state.save?.campaignStage,
        tavern: state.save?.tavern?.length,
        errors,
      });
    }

    // 8. Recuperação de JSON corrompido.
    {
      const { state, errors } = await scenario('JSON corrompido', '{', []);
      record('recuperação de JSON corrompido', errors.length === 0 && state.save?.version === 2 && state.goldText === '120' && state.save?.tavern.length === 4, {
        version: state.save?.version,
        goldText: state.goldText,
        tavern: state.save?.tavern?.length,
        errors,
      });
    }

    // 9. IDs duplicados entre roster e taverna são rejeitados.
    {
      const spec = {
        version: 2, gold: 120, rep: 0, level: 1, scrolls: 0, totalGold: 0, nextId: 3,
        roster: [ADV(1, { power: 10 })],
        tavern: [
          ADV(1, { power: 10 }),
          ADV(2, { name: 'Lyra', cls: 'Mago', rar: 'Raro', power: 20, cost: 90 }),
        ],
        active: [], sel: [], campaignStage: 0,
      };
      const { state, errors } = await scenario('IDs duplicados', JSON.stringify(spec), []);
      record('IDs duplicados entre roster e taverna', errors.length === 0 && state.save?.roster.length === 1 && state.save?.tavern.length === 1 && state.save?.tavern[0]?.id === 2 && state.rosterCards === 1 && state.tavernCards === 1, {
        roster: state.save?.roster.map((adventurer) => adventurer.id),
        tavern: state.save?.tavern.map((adventurer) => adventurer.id),
        rosterCards: state.rosterCards,
        tavernCards: state.tavernCards,
        errors,
      });
    }

    // 10. Fluxo de interface: seleção, despacho, contratação, seguro e salão.
    {
      const spec = save({
        gold: 500,
        roster: [ADV(1, { power: 100 })],
        tavern: [ADV(2, { name: 'Lyra', cls: 'Mago', rar: 'Raro', power: 50, cost: 30 })],
        active: [],
        sel: [],
      });
      const { state, errors } = await scenario('fluxo de interface', JSON.stringify(spec), [], async (page, _state, read) => {
        const initiallyDisabled = await page.$eval('#missions .mission button', button => button.disabled);
        await page.focus('#roster .card');
        await page.keyboard.press('Enter');
        const selectedByEnter = await page.$eval('#roster .card', card => card.getAttribute('aria-pressed') === 'true');
        await page.focus('#roster .card');
        await page.keyboard.press('Space');
        const deselectedBySpace = await page.$eval('#roster .card', card => card.getAttribute('aria-pressed') === 'false');
        await page.focus('#roster .card');
        await page.keyboard.press('Enter');
        const selectedByKeyboard = await page.$eval('#roster .card', card => card.getAttribute('aria-pressed') === 'true');
        const assessmentText = await page.$eval('#missions .mission', card => card.innerText);
        const campaignAssessmentText = await page.$eval('#campaign .mission:not(.locked)', card => card.innerText);
        await page.evaluate(() => document.querySelector('#missions .mission button').click());
        await page.evaluate(() => document.querySelector('#tavern .card').click());
        await page.focus('#roster .card:nth-child(2) button');
        await page.keyboard.press('Space');
        await page.evaluate(() => document.getElementById('upgradeHall').click());
        const result = await read();
        result.initiallyDisabled = initiallyDisabled;
        result.selectedByEnter = selectedByEnter;
        result.deselectedBySpace = deselectedBySpace;
        result.selectedByKeyboard = selectedByKeyboard;
        result.assessmentText = assessmentText;
        result.campaignAssessmentText = campaignAssessmentText;
        return result;
      });
      record('fluxo de interface: seleção, despacho, contratação, seguro e salão', errors.length === 0 &&
        state.initiallyDisabled === true && state.selectedByEnter && state.deselectedBySpace && state.selectedByKeyboard &&
        state.assessmentText.includes('Poder selecionado: 100') &&
        state.assessmentText.includes('Chance de sucesso:') &&
        state.assessmentText.includes('Risco individual após fracasso:') &&
        state.campaignAssessmentText.includes('Poder selecionado: 100') &&
        state.campaignAssessmentText.includes('Chance de sucesso:') &&
        state.save?.active.length === 1 &&
        state.save?.active[0]?.party?.[0] === 1 &&
        state.save?.roster.length === 2 &&
        state.save?.roster[0]?.status === 'mission' &&
        state.save?.roster[1]?.insured === true &&
        state.save?.tavern.length === 0 &&
        state.save?.gold === 270 &&
        state.save?.level === 2 &&
        state.save?.sel.length === 0 &&
        state.rosterCards === 2 &&
        state.rosterDialogues === 2 &&
        state.busyCards === 1 &&
        state.journeyCount === 1, {
        active: state.save?.active.length,
        party: state.save?.active[0]?.party,
        roster: state.save?.roster.map((adventurer) => ({ id: adventurer.id, status: adventurer.status, insured: adventurer.insured })),
        tavern: state.save?.tavern.length,
        gold: state.save?.gold,
        level: state.save?.level,
        sel: state.save?.sel,
        rosterCards: state.rosterCards,
        rosterDialogues: state.rosterDialogues,
        busyCards: state.busyCards,
        journeyCount: state.journeyCount,
        assessmentText: state.assessmentText,
        campaignAssessmentText: state.campaignAssessmentText,
        errors,
      });
    }

    const failed = results.filter((result) => !result.ok);
    const countMismatch = results.length !== EXPECTED_SCENARIOS;
    const summary = {
      total: results.length,
      expected: EXPECTED_SCENARIOS,
      passed: results.length - failed.length,
      failed: failed.length,
      pageErrors: allPageErrors.length,
      results,
    };
    console.log(JSON.stringify(summary, null, 2));

    if (failed.length || allPageErrors.length || countMismatch) {
      const countDetails = countMismatch ? ` Esperado: ${EXPECTED_SCENARIOS}; executado: ${results.length}.` : '';
      console.error(`FALHOU: ${failed.length} cenário(s), ${allPageErrors.length} erro(s) de página.${countDetails}`);
      process.exitCode = 1;
    } else {
      console.log(`OK: ${results.length}/${EXPECTED_SCENARIOS} cenários aprovados, 0 erros de página.`);
    }
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (_) {
        // O navegador pode já ter sido encerrado após uma falha.
      }
    }
    fs.rmSync(userDataDir, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error('Erro fatal na suíte de regressão:', error.stack || error.message || error);
  process.exitCode = 1;
});
