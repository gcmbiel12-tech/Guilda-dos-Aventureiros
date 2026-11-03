# Testes de regressão

Suíte persistente do jogo **Guilda dos Aventureiros**.

## Comando único

Após instalar as dependências de desenvolvimento:

```sh
npm test
```

O comando executa, nesta ordem:

1. `tests/check-syntax.cjs` — valida os quatro módulos locais e o JavaScript inline do HTML com `node --check`.
2. `tests/domain-unit.cjs` — executa 7 testes unitários de domínio sem DOM.
3. `tests/guild-service-unit.cjs` — executa 9 testes unitários de `GuildService` sem DOM.
4. `tests/journey-service-unit.cjs` — executa 8 testes unitários determinísticos de `JourneyService` sem DOM.
5. `tests/game-loop-unit.cjs` — executa 6 testes unitários de `GameLoop`, com relógio e agendador injetados.
6. `tests/economy-balance.cjs` - executa 7 verificações determinísticas de equilíbrio, geração, risco e progressão com 20 mil amostras.
7. `tests/persistence-service-unit.cjs` — executa 11 testes unitários de `PersistenceService` sem DOM.
8. `tests/guilda-regression.cjs` - abre o jogo em um perfil temporário do Puppeteer e executa os 13 cenários de regressão; o cenário de interface verifica poder do grupo, chance de sucesso e explicação do risco em missões comuns e campanha.

Também é possível executar separadamente:

```sh
npm run test:syntax
npm run test:domain
npm run test:guild
npm run test:journey
npm run test:loop
npm run test:economy
npm run test:persistence
npm run test:regression
```

## Requisitos

- Node.js `>=22.12.0`, versão mínima exigida pelo Puppeteer 25.16.0.
- As dependências de desenvolvimento são instaladas com `npm ci` quando o `package-lock.json` estiver disponível, ou com `npm install` para gerar/atualizar o lockfile.
- O `npm install` do Puppeteer 25.16.0 baixa o navegador compatível durante a instalação; em versões recentes do npm, o `postinstall` pode ficar pendente por política de scripts, caso em que é preciso aprovar/executar o script ou instalar o navegador antes de rodar a suíte.
- O jogo não exige bibliotecas externas em runtime; para abrir localmente, mantenha o HTML e os quatro módulos (`guilda-domain.js`, `guilda-journey.js`, `guilda-persistence.js` e `guilda-loop.js`) na mesma pasta.

## Dependência

A suíte usa `puppeteer` apenas como dependência de desenvolvimento. O jogo usa os quatro módulos locais sem dependências externas de runtime.

Em uma instalação limpa e reproduzível:

```sh
npm ci
npm test
```

Use `npm install` apenas quando for necessário criar ou atualizar o `package-lock.json`; sem lockfile, a instalação não é totalmente reproduzível. O runner resolve somente a dependência declarada em `node_modules` local; se ela estiver ausente, a execução falha com instrução para executar `npm install`.

A suíte exige exatamente `13` cenários de integração. Se a quantidade mudar sem atualizar `EXPECTED_SCENARIOS` no runner, a execução falha mesmo que os cenários restantes passem.

## Cenários cobertos

1. Carregamento inicial, balões de NPC, formato `guildaSave` v2 e ausência de rolagem horizontal em viewports de 320 px e 390 px.
2. Conclusão e recompensa de missão comum.
3. Falha com seguro: seguro consumido e aventureiro preservado.
4. Falha sem seguro: aventureiro removido.
5. Persistência de jornada em andamento após recarga.
6. Campanha, etapa 1.
7. Campanha, etapa 2.
8. Campanha, etapa 3.
9. Campanha, etapa 4 e vitória.
10. Migração de salvamento legado.
11. Recuperação de JSON corrompido.
12. Rejeição de IDs duplicados entre roster e taverna.
13. Fluxo de interface: seleção por teclado (Enter/Espaço), estado acessível `aria-pressed`, despacho desabilitado sem seleção, seguro acionável por teclado sem alternar seleção acidentalmente, contratação e melhoria do salão.

## Limitações

- Os cenários usam salvamentos sintéticos e controlam `Math.random` quando o resultado precisa ser determinístico.
- A conclusão de missão é testada com timestamps no passado; não há espera real de 15 s.
- `Adventurer`, `Mission`, `CampaignMission`, `GuildService`, `JourneyService`, `GameLoop` e `PersistenceService` têm testes unitários puros.
- `GameLoop` é testado com relógio e agendador falsos; não cobre sessões longas em tempo real.
- Os quatro capítulos da campanha são cobertos em cenários/salvamentos independentes, não em uma sessão contínua.
- A suíte não cobre equilíbrio econômico.
- A suíte não altera os backups ou o perfil normal do navegador; o perfil de teste é temporário e removido ao final.
