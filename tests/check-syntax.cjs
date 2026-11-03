const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const htmlPath = path.resolve(__dirname, '..', 'Guilda dos Aventureiros.html');
const domainPath = path.resolve(__dirname, '..', 'guilda-domain.js');
const journeyPath = path.resolve(__dirname, '..', 'guilda-journey.js');
const persistencePath = path.resolve(__dirname, '..', 'guilda-persistence.js');
const loopPath = path.resolve(__dirname, '..', 'guilda-loop.js');
const expeditionViewPath = path.resolve(__dirname, '..', 'guilda-expedition-view.js');
const spriteViewPath = path.resolve(__dirname, '..', 'guilda-sprite-view.js'); const sedeNavigationPath = path.resolve(__dirname, '..', 'NPC', 'Sede', 'sede-navigation.js');
const html = fs.readFileSync(htmlPath, 'utf8');
const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
  .map((match) => match[1])
  .filter((script) => script.trim().length > 0);

if (!scripts.length) {
  console.error('Nenhum JavaScript inline encontrado em ' + htmlPath);
  process.exit(1);
}

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'guilda-syntax-'));
let failed = false;
try {
  for (const [name, file] of [['guilda-domain.js', domainPath], ['guilda-journey.js', journeyPath], ['guilda-persistence.js', persistencePath], ['guilda-loop.js', loopPath], ['guilda-expedition-view.js', expeditionViewPath], ['guilda-sprite-view.js', spriteViewPath], ['NPC/Sede/sede-navigation.js', sedeNavigationPath]]) {
    const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
    if (result.error || result.status !== 0) {
      console.error('Sintaxe inválida em ' + name + ':');
      console.error(result.stderr || result.stdout || result.error?.message || '(sem detalhes)');
      failed = true;
    } else {
      console.log('Sintaxe OK: ' + name + ' verificado.');
    }
  }

  scripts.forEach((script, index) => {
    const file = path.join(tempDir, `inline-${index + 1}.js`);
    fs.writeFileSync(file, script, 'utf8');
    const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
    if (result.error) {
      console.error(`Falha ao executar node --check no script ${index + 1}: ${result.error.message}`);
      failed = true;
      return;
    }
    if (result.status !== 0) {
      console.error(`Sintaxe inválida no script inline ${index + 1}:`);
      console.error(result.stderr || result.stdout || '(sem detalhes)');
      failed = true;
    }
  });
} finally {
  fs.rmSync(tempDir, { recursive: true, force: true });
}

if (failed) process.exit(1);
console.log(`Sintaxe OK: ${scripts.length} script(s) inline verificado(s).`);
