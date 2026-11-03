# Guilda dos Aventureiros â€” Plano Mestre
Versão: 2.2
Última revisão: 2026-11-03
Status: Fase 2 concluída nos serviços centrais; Fase 3 em andamento. Microanimações, diálogos contextuais, ciclo temporal, acessibilidade básica, navegação ampliada e feedback visual de perdas implementados; 292 verificações unitárias/baseline e 13 cenários Puppeteer aprovados. guildaSave v2 preservado.

## 1. Objetivo
Evoluir o protÃ³tipo existente para um jogo incremental de gerenciamento de guilda, com desenvolvimento conduzido pela IA de forma autÃ´noma sempre que possÃ­vel. Preservar funcionalidades existentes e evitar mudanÃ§as de arquitetura sem justificativa e validaÃ§Ã£o.

## 2. Estado atual confirmado
- A raiz contÃ©m o arquivo `Guilda dos Aventureiros.html`.
- A interface, CSS, estado e aÃ§Ãµes continuam no HTML; entidades e `GuildService` estÃ£o em `guilda-domain.js`; `JourneyService` em `guilda-journey.js`; `PersistenceService` em `guilda-persistence.js`; `GameLoop` em `guilda-loop.js`. Os quatro mÃ³dulos sÃ£o carregados localmente pelo HTML.
- Sistemas existentes: ouro, reputaÃ§Ã£o, nÃ­vel do salÃ£o, pergaminhos/prestÃ­gio, recrutamento, classes, raridades, roster, seleÃ§Ã£o de grupo, seguro, missÃµes temporizadas, jornadas, recompensas e campanha de quatro etapas.
- Interface visual: avatares por classe com microanimaÃ§Ãµes contextuais e balÃµes de fala determinÃ­sticos para recrutamento, ociosidade e missÃµes; sem dependÃªncia externa e com respeito a preferÃªncia por movimento reduzido.
- A persistÃªncia inicial gravava somente `scrolls` e `campaignStage`; foi ampliada para o estado principal e agora usa o formato versionado `v2`, carregado e gravado por `PersistenceService` com a mesma chave `guildaSave`.
- O salvamento ocorre em aÃ§Ãµes relevantes, periodicamente e no evento `pagehide`; as funÃ§Ãµes `load()` e `save()` permanecem como wrappers dos mÃ©todos do serviÃ§o para preservar os pontos de chamada existentes. Jornadas sÃ£o reconstruÃ­das usando os catÃ¡logos de missÃµes para evitar dependÃªncia de identidade de objeto.
- O carregamento valida campos essenciais dos aventureiros por `Adventurer.fromSaved` e rejeita registros com nome, classe, raridade, poder ou custo invÃ¡lidos.
- AlÃ©m do jogo, a raiz contÃ©m os dois backups, os documentos de coordenaÃ§Ã£o, o diretÃ³rio `.git`, `package.json`, `package-lock.json`, `.gitignore` e o diretÃ³rio `tests/`; a suÃ­te persistente usa Puppeteer apenas como dependÃªncia de desenvolvimento, exige Node.js `>=22.12.0` e o jogo continua sem dependÃªncias de runtime.
- A arquitetura ainda mantÃ©m estado, aÃ§Ãµes e interface dentro da IIFE; domÃ­nio, jornadas, persistÃªncia e ciclo temporal estÃ£o em mÃ³dulos locais independentes. `GameLoop` recebe relÃ³gio e agendador por injeÃ§Ã£o e nÃ£o depende de DOM.

## 3. PrincÃ­pios de desenvolvimento
1. Inspecionar o cÃ³digo completo e consultar este plano antes de cada etapa.
2. Preservar a experiÃªncia e as funcionalidades que jÃ¡ existem, salvo quando uma correÃ§Ã£o exigir alteraÃ§Ã£o explÃ­cita.
3. Trabalhar em etapas pequenas, verificÃ¡veis e reversÃ­veis.
4. Usar orientaÃ§Ã£o a objetos onde ela trouxer valor real: entidades com responsabilidade clara, encapsulamento e polimorfismo quando houver comportamentos genuinamente diferentes. Evitar classes artificiais.
5. Separar regras de domÃ­nio da interface gradualmente, sem reescrita total prematura.
6. NÃ£o adicionar dependÃªncias externas sem necessidade demonstrada.
7. NÃ£o afirmar que testes passaram sem executÃ¡-los.
8. Antes de mudanÃ§as grandes, registrar impacto, estratÃ©gia de migraÃ§Ã£o e critÃ©rio de aceitaÃ§Ã£o.
9. Manter cÃ³pia de seguranÃ§a ou controle de versÃ£o antes de refatoraÃ§Ãµes relevantes, quando disponÃ­vel.
10. Pedir intervenÃ§Ã£o do usuÃ¡rio apenas para decisÃµes de produto realmente importantes, custos, credenciais, riscos irreversÃ­veis ou falta de informaÃ§Ã£o essencial.

## 4. Auditoria tÃ©cnica inicial
### Prioridade alta
- [x] Persistir recursos, nÃ­vel, elenco, taverna, identificadores, progresso, seleÃ§Ã£o e jornadas.
- [x] Restaurar jornadas por referÃªncia aos catÃ¡logos, sem depender de identidade de objeto.
- [x] Migrar salvamentos antigos e recuperar JSON corrompido para um estado inicial vÃ¡lido.
- [x] Rejeitar registros de aventureiros com campos essenciais invÃ¡lidos ao carregar.
- [x] Impedir que o mesmo aventureiro seja associado a mais de uma jornada restaurada e rejeitar duraÃ§Ãµes invÃ¡lidas.
- [x] Rejeitar IDs duplicados entre o roster e a taverna durante o carregamento (correÃ§Ã£o preexistente preservada; nÃ£o criada nesta tarefa).
- [x] Testar conclusÃ£o de missÃ£o com timestamps no passado (nÃ£o mede espera real de 15 s), recompensa e avanÃ§o da primeira etapa da campanha.
- [x] Testar falha com risco acionado e consumo do seguro, preservando o aventureiro.
- [x] Testar os quatro capÃ­tulos da campanha em cenÃ¡rios/salvamentos independentes (nÃ£o em sessÃ£o contÃ­nua) e a perda de aventureiros sem seguro (suÃ­te persistente, 2026-10-27).

### Prioridade mÃ©dia
- [x] Verificar regras de sucesso, risco, seguro, recompensa e progressÃ£o da campanha (coberto pela suÃ­te persistente).
- Revisar aÃ§Ãµes de botÃµes e estados desabilitados para evitar gastos ou despachos invÃ¡lidos.
- Melhorar legibilidade e acessibilidade da interface sem alterar desnecessariamente seu estilo.
- [x] Estabelecer testes de regressÃ£o para as principais regras (13 cenÃ¡rios em `tests/`, 2026-10-27).

### Prioridade estrutural
- [x] Iniciar a extraÃ§Ã£o progressiva do domÃ­nio para mÃ³dulo separado sem dependÃªncias externas; o HTML e `guilda-domain.js` precisam permanecer juntos.
- [x] Introduzir `Adventurer` e `PersistenceService` com responsabilidades claras, preservando o formato `guildaSave` v2.
- [x] Introduzir `GuildService` no domÃ­nio para operaÃ§Ãµes da Guilda; o estado segue como objeto simples compartilhado para compatibilidade com o salvamento.
- [x] Extrair despacho e resoluÃ§Ã£o de jornadas para `JourneyService`, mantendo wrappers da UI e o formato de salvamento.
- [x] Criar testes unitÃ¡rios puros para entidades e regras de missÃ£o (7 testes em `tests/domain-unit.cjs`).
- [x] Extrair `JourneyService` para `guilda-journey.js` e criar 8 testes unitÃ¡rios sem DOM.
- [x] Extrair `PersistenceService` para `guilda-persistence.js` com 11 testes unitÃ¡rios sem DOM e compatibilidade para `guildaSave` v2 e migraÃ§Ã£o legada.

## 5. Fases de trabalho
### Fase 0 â€” Baseline e seguranÃ§a
- Confirmar arquivos, ambiente e forma de execuÃ§Ã£o.
- Registrar o estado original e verificar se existe Git ou outra cÃ³pia de seguranÃ§a.
- Definir critÃ©rios de regressÃ£o: recrutamento, seleÃ§Ã£o, despacho, conclusÃ£o, falha, seguro, melhoria e campanha.

### Fase 1 â€” Confiabilidade
- Corrigir persistÃªncia e recuperaÃ§Ã£o de sessÃ£o.
- Tratar migraÃ§Ã£o de salvamentos antigos e dados invÃ¡lidos.
- Testar jornadas em andamento, recarga de pÃ¡gina e recompensas.
CritÃ©rio de saÃ­da: estado vÃ¡lido Ã© restaurado de forma consistente e as regras principais passam nos testes disponÃ­veis.

### Fase 2 â€” DomÃ­nio e arquitetura
- [x] Iniciar a extraÃ§Ã£o de POO com `Adventurer` e `PersistenceService`, mantendo a suÃ­te verde.
- [x] Extrair `Adventurer`, `Mission`, `CampaignMission` e catÃ¡logos para `guilda-domain.js`, com 7 testes unitÃ¡rios sem DOM.
- [ ] Separar as regras de negÃ³cio restantes da renderizaÃ§Ã£o.
- [x] Introduzir `GuildService` em `guilda-domain.js` para geraÃ§Ã£o, seleÃ§Ã£o, contrataÃ§Ã£o, seguro, melhoria e prestÃ­gio; 9 testes unitÃ¡rios sem DOM.
- [x] Extrair `JourneyService` do HTML para `guilda-journey.js`, preservando wrappers e formato de salvamento.
- [x] Preservar o formato simples de execuÃ§Ã£o local: HTML e quatro mÃ³dulos locais, sem dependÃªncias externas em runtime.
CritÃ©rio de saÃ­da: regras centrais podem ser testadas sem depender de manipulaÃ§Ã£o do DOM.

### Fase 3 â€” EquilÃ­brio e experiÃªncia
- [x] Adicionar microanimaÃ§Ãµes contextuais de NPCs na taverna, roster e jornadas; respeitar `prefers-reduced-motion`.
- [x] Adicionar falas contextuais em balÃµes nos cartÃµes de NPCs, sem alterar regras ou persistÃªncia.
- [x] Extrair o ciclo temporal para `guilda-loop.js`, com relÃ³gio e agendador injetÃ¡veis e 6 testes unitÃ¡rios.
- [x] Auditar geraÃ§Ã£o, economia, curva de progressÃ£o, risco, recompensas e prestÃ­gio com simulaÃ§Ã£o determinÃ­stica de 20.000 amostras; baseline protegido em `tests/economy-balance.cjs`. Ajustes de gameplay aguardam decisÃ£o sobre a atualizaÃ§Ã£o gratuita da taverna.
- [x] Melhorar feedback e acessibilidade de aÃ§Ãµes e estados: cartÃµes operÃ¡veis por teclado, foco visÃ­vel, seleÃ§Ã£o anunciada, log como regiÃ£o de status e despacho desabilitado sem grupo.
- [x] Verificar responsividade bÃ¡sica em viewports de 320 px e 390 px sem rolagem horizontal.
- [x] Exibir poder selecionado, chance real de sucesso e significado correto do risco individual nas missÃµes comuns e na etapa desbloqueada da campanha; coberto pelo cenÃ¡rio de interface.
- Complementar auditoria com leitor de tela e validaÃ§Ã£o visual manual em dispositivos reais.
- [ ] Em frente paralela, validar ferramentas e pipeline de animaÃ§Ã£o assistida por IA com um Ãºnico NPC de teste, mantendo a identidade visual atual como referÃªncia e os recursos gerados prÃ©-renderizados/localmente.

#### Experimento de animaÃ§Ã£o assistida por IA
- Escopo do piloto: um aventureiro Guerreiro, uma animaÃ§Ã£o curta de repouso e, se a consistÃªncia passar, um ciclo simples de caminhada. NÃ£o substituir o avatar atual nem integrar ao jogo antes da avaliaÃ§Ã£o.
- Candidato inicial: [SpriteGen](https://spritegen.ai/), por oferecer geraÃ§Ã£o de sprite sheets 2D com referÃªncia de personagem, 6/8/12 quadros e PNG transparente. Antes de usar qualquer resultado na versÃ£o distribuÃ­vel, confirmar a licenÃ§a aplicÃ¡vel Ã  geraÃ§Ã£o e desativar a publicaÃ§Ã£o na galeria, que Ã© o comportamento padrÃ£o informado nos [termos](https://spritegen.ai/terms/).
- Alternativas: [AnimGen](https://animgen.com/), que exporta quadros PNG, sprite sheets com JSON e pacotes para engines; os crÃ©ditos de boas-vindas sÃ£o para avaliaÃ§Ã£o pessoal e uso comercial exige plano/crÃ©ditos pagos ([preÃ§os e licenÃ§a](https://animgen.com/pricing)). [Sloyd](https://www.sloyd.ai/spritesheet-generator) tambÃ©m oferece sprite sheets com quadros consistentes, mas o plano gratuito Ã© de uso pessoal e a licenÃ§a comercial exige plano pago ([preÃ§os](https://www.sloyd.ai/pricing)).
- CritÃ©rios de aceitaÃ§Ã£o: identidade, roupa, paleta, escala e linha dos pÃ©s consistentes; transparÃªncia real; quadros alinhados e sem tremulaÃ§Ã£o; loop sem salto; exportaÃ§Ã£o de PNGs individuais e sheet/metadata; tamanho e desempenho adequados ao jogo; respeito a movimento reduzido.
- NÃ£o contratar planos, comprar crÃ©ditos, criar credenciais nem integrar serviÃ§os externos sem necessidade e autorizaÃ§Ã£o para eventual custo. Preferir primeiro uma avaliaÃ§Ã£o gratuita sem envio de arquivos privados do projeto.
- Salvaguardas autorais obrigatÃ³rias: criar o personagem a partir de briefing textual original; nÃ£o usar nomes, imagens de referÃªncia, silhuetas, roupas, emblemas ou elementos distintivos de personagens/franquias existentes; nÃ£o solicitar imitaÃ§Ã£o de artista ou obra identificÃ¡vel; utilizar apenas referÃªncias prÃ³prias ou com licenÃ§a compatÃ­vel; guardar prompt, data, ferramenta, versÃ£o dos termos e arquivos intermediÃ¡rios; revisar visualmente e pesquisar semelhanÃ§as relevantes antes de incorporar; fazer ediÃ§Ã£o humana e registrar as contribuiÃ§Ãµes. A licenÃ§a comercial declarada pela ferramenta nÃ£o garante exclusividade nem ausÃªncia de semelhanÃ§a/infringÃªncia. No SpriteGen, confirmar a opÃ§Ã£o de ocultar da galeria antes de gerar e conferir no painel apÃ³s a geraÃ§Ã£o.
- A aprovaÃ§Ã£o do piloto serÃ¡ de risco reduzido, nÃ£o uma garantia jurÃ­dica de ausÃªncia absoluta de reivindicaÃ§Ãµes. Em caso de semelhanÃ§a substancial ou dÃºvida sobre um ativo importante, descartar/refazer ou solicitar avaliaÃ§Ã£o jurÃ­dica antes da distribuiÃ§Ã£o comercial.
CritÃ©rio de saÃ­da: regras documentadas, comportamento consistente e ausÃªncia de regressÃµes conhecidas.

### Fase 4 â€” ExpansÃ£o do jogo
- Priorizar novos sistemas apÃ³s estabilizar a base.
- Cada recurso novo deve ter objetivo, regras, integraÃ§Ã£o, critÃ©rios de aceitaÃ§Ã£o e testes.
- NÃ£o ampliar o escopo com mecÃ¢nicas aleatÃ³rias sem avaliar seu impacto no jogo.

## 6. Fluxo autÃ´nomo por tarefa
1. Consultar este plano e o cÃ³digo atual.
2. Identificar a causa ou necessidade concreta.
3. Definir a menor alteraÃ§Ã£o segura.
4. Implementar mantendo compatibilidade.
5. Executar verificaÃ§Ãµes e testes disponÃ­veis.
6. Corrigir falhas encontradas.
7. Atualizar este plano com decisÃµes e resultados reais.
8. Relatar arquivos alterados, testes executados, limitaÃ§Ãµes e prÃ³xima etapa.

## 7. Registro de decisÃµes
- D-001: O arquivo inicial confirmado Ã© `Guilda dos Aventureiros.html`; nÃ£o presumir que exista `index.html`.
- D-002: A evoluÃ§Ã£o serÃ¡ incremental, preservando o protÃ³tipo funcional.
- D-003: POO Ã© uma diretriz, mas a modelagem deve refletir responsabilidades reais e nÃ£o criar complexidade artificial.
- D-004: PersistÃªncia e recuperaÃ§Ã£o de jornadas sÃ£o a primeira prioridade tÃ©cnica.
- D-005: A suÃ­te de testes persistente usa Node.js + Puppeteer como dependÃªncia apenas de desenvolvimento; o jogo usa `guilda-domain.js`, `guilda-journey.js` e `guilda-persistence.js` locais, sem dependÃªncias externas de runtime, e requer HTML e mÃ³dulos lado a lado.
- D-006: A primeira etapa da Fase 2 extrai `Adventurer` e `PersistenceService` dentro do prÃ³prio HTML. `Adventurer` encapsula validaÃ§Ã£o, seguro, status e serializaÃ§Ã£o; `PersistenceService` centraliza leitura e gravaÃ§Ã£o na chave `guildaSave`, versÃ£o 2. Nenhuma regra de economia, risco ou progressÃ£o foi alterada.
- D-008: `guilda-domain.js` Ã© um mÃ³dulo UMD leve: exporta via CommonJS para os testes Node.js e publica `GuildaDomain` no navegador. O HTML deve continuar abrÃ­vel localmente com o mÃ³dulo ao lado, sem dependÃªncias de runtime. O contrato `guildaSave` v2 nÃ£o muda.
- D-009: `GuildService` concentra as regras de gestÃ£o da Guilda sem DOM ou infraestrutura. Recebe o estado compartilhado e RNG injetÃ¡vel; os mÃ©todos retornam resultados estruturados para a UI manter mensagens, salvamento e renderizaÃ§Ã£o. As operaÃ§Ãµes preservam fÃ³rmulas e limites existentes; `guildaSave` v2 permanece inalterado.
- D-010: `PersistenceService` Ã© um mÃ³dulo UMD em `guilda-persistence.js`, recebe `Adventurer`, catÃ¡logos e storage por injeÃ§Ã£o, nÃ£o depende do DOM e preserva a chave `guildaSave`, versÃ£o 2, campos, validaÃ§Ãµes e migraÃ§Ã£o legada.
- D-007: A suÃ­te deve permanecer com exatamente 13 cenÃ¡rios enquanto esse for o baseline acordado; o runner falha se a quantidade mudar. O caminho reproduzÃ­vel Ã© `npm ci` com `package-lock.json` e Node.js `>=22.12.0`. O runner resolve somente a dependÃªncia declarada em `node_modules` local; nÃ£o hÃ¡ fallback para cache global do `npx`. A correÃ§Ã£o preexistente de IDs duplicados no HTML foi preservada, nÃ£o criada nesta tarefa. A conclusÃ£o de missÃ£o Ã© testada com timestamps no passado e nÃ£o mede espera real de 15 s. Os quatro capÃ­tulos da campanha sÃ£o cobertos em salvamentos/cenÃ¡rios independentes, nÃ£o em uma sessÃ£o contÃ­nua. O `git diff --check` nÃ£o verifica arquivos nÃ£o rastreados; a validaÃ§Ã£o do conjunto staged serÃ¡ registrada apenas quando houver stage futuro.

## Registro de execuÃ§Ã£o â€” 2026-11-01
- ExtraÃ­do `GuildService` para `guilda-domain.js`, mantendo o estado atual como objeto simples para compatibilidade com `PersistenceService` e `guildaSave` v2.
- Migradas para o serviÃ§o as fÃ³rmulas de multiplicador, capacidade do grupo/roster, custo do salÃ£o, geraÃ§Ã£o de aventureiros, renovaÃ§Ã£o da taverna, seleÃ§Ã£o, seguro, contrataÃ§Ã£o, melhoria e prestÃ­gio.
- A UI continua responsÃ¡vel por mensagens, persistÃªncia e renderizaÃ§Ã£o; wrappers mantÃªm os pontos de chamada existentes.
- Adicionados 9 testes puros de serviÃ§o da Guilda; `npm test` aprovado com 7 testes de domÃ­nio, 9 testes do serviÃ§o e 13 cenÃ¡rios de regressÃ£o, zero erros de pÃ¡gina.
- `PersistenceService` foi extraÃ­do para `guilda-persistence.js`; a suÃ­te agora inclui 11 testes unitÃ¡rios isolados. A extraÃ§Ã£o preserva o formato de salvamento v2.

## 8. Registro de execuÃ§Ã£o
- 2026-10-27: acesso remoto autorizado e raiz inspecionada.
- 2026-10-27: arquivo HTML de 323 linhas lido integralmente na leitura inicial (o arquivo cresceu depois com as alteraÃ§Ãµes registradas abaixo).
- 2026-10-27: identificada persistÃªncia parcial; plano inicial criado.
- 2026-10-27: criada cÃ³pia de seguranÃ§a `Guilda dos Aventureiros.html.bak` antes da primeira alteraÃ§Ã£o.
- 2026-10-27: persistÃªncia ampliada para recursos, nÃ­vel, elenco, taverna, IDs, seleÃ§Ã£o, progresso e jornadas; restauraÃ§Ã£o de missÃµes normalizada para referÃªncias do catÃ¡logo; salvamento periÃ³dico e no evento `pagehide`.
- 2026-10-27: verificaÃ§Ã£o sintÃ¡tica do JavaScript extraÃ­do executada com Node.js e aprovada apÃ³s as Ãºltimas alteraÃ§Ãµes.
- 2026-10-27: testes automatizados em Chromium/Puppeteer aprovados apÃ³s as alteraÃ§Ãµes de persistÃªncia e validaÃ§Ã£o: carregamento inicial, taverna com quatro opÃ§Ãµes, contrataÃ§Ã£o, seleÃ§Ã£o, despacho e restauraÃ§Ã£o de jornada apÃ³s recarga; ouro, roster, missÃ£o e status ocupado preservados; nenhum erro de pÃ¡gina.
- 2026-10-27: teste automatizado aprovado para migraÃ§Ã£o de salvamento legado (`scrolls`/`campaignStage`) para formato versionado v2.
- 2026-10-27: teste automatizado aprovado para recuperaÃ§Ã£o de JSON de salvamento corrompido, retornando a um estado inicial vÃ¡lido sem erro de pÃ¡gina.
- 2026-10-27: validaÃ§Ã£o de sintaxe JavaScript aprovada novamente apÃ³s as Ãºltimas alteraÃ§Ãµes.
- 2026-10-27: validaÃ§Ã£o adicional no carregamento rejeita aventureiros com nomes fora do catÃ¡logo ou poder/custo invÃ¡lidos; aÃ§Ãµes de seguro, contrataÃ§Ã£o e despacho receberam verificaÃ§Ãµes defensivas.
- 2026-10-27: restauraÃ§Ã£o de jornadas passou a descartar referÃªncias invÃ¡lidas, duraÃ§Ãµes negativas e aventureiros duplicados entre jornadas.
- 2026-10-27: primeira etapa de POO aplicada com `Mission` e `CampaignMission`; recompensas sÃ£o processadas por mÃ©todos de domÃ­nio e a campanha avanÃ§a por sobrescrita polimÃ³rfica de `applyRewards`.
- 2026-10-27: teste automatizado com Chromium/Puppeteer aprovado apÃ³s a refatoraÃ§Ã£o: restauraÃ§Ã£o de missÃ£o comum, conclusÃ£o e recompensa, conclusÃ£o da primeira etapa da campanha, estado sem jornadas pendentes e nenhum erro de pÃ¡gina.
- 2026-10-27: teste automatizado aprovado para falha de missÃ£o com risco acionado: o seguro foi consumido, o aventureiro sobreviveu e nenhum erro de pÃ¡gina ocorreu.
- 2026-10-27: teste de dados invÃ¡lidos aprovado: IDs repetidos entre roster/taverna e aventureiro repetido em jornadas foram filtrados; somente uma jornada vÃ¡lida foi restaurada.
- 2026-10-27: criado backup prÃ©-refatoraÃ§Ã£o `Guilda dos Aventureiros.pre-POO.html.bak`.
- 2026-10-27: criada suÃ­te persistente em `tests/` (`check-syntax.cjs`, `guilda-regression.cjs`, `README.md`), `package.json` e `.gitignore`; `npm test` executa verificaÃ§Ã£o sintÃ¡tica e 13 cenÃ¡rios.
- 2026-10-27: `npm test` aprovado com 13/13 cenÃ¡rios e zero erros de pÃ¡gina; `npm run test:syntax` e `git diff --check` aprovados. A suÃ­te foi adicionada sem alterar a lÃ³gica do jogo; a refatoraÃ§Ã£o posterior de classes estÃ¡ registrada abaixo. Backups intactos; sem commit.
- 2026-10-27: Fase 2 iniciada com a extraÃ§Ã£o de `Adventurer` no HTML: validaÃ§Ã£o de restauraÃ§Ã£o, custo de seguro, status operacional (`isIdle`, `isOnMission`, `markOnMission`, `markIdle`), consumo de seguro e serializaÃ§Ã£o estÃ¡vel. `makeAdv`, carregamento, seguro, seleÃ§Ã£o, despacho, resoluÃ§Ã£o de missÃ£o e renderizaÃ§Ã£o passaram a usar a entidade.
- 2026-10-27: `PersistenceService` extraÃ­do para centralizar `load(target)`/`save(source)` na chave `guildaSave`, versÃ£o 2; wrappers `load()`/`save()` preservam os pontos de chamada. O formato salvo e a restauraÃ§Ã£o de jornadas/catÃ¡logos foram mantidos.
- 2026-10-27: empacotamento de desenvolvimento ajustado: `engines.node` `>=22.12.0`, `package-lock.json` gerado, runner com quantidade esperada de 13 cenÃ¡rios, fallback `npx` limitado Ã  versÃ£o fixada e aviso explÃ­cito quando usado.
- 2026-10-27: `npm test` aprovado apÃ³s a refatoraÃ§Ã£o com 13/13 cenÃ¡rios e zero erros de pÃ¡gina; `npm run test:syntax` aprovado. A suÃ­te cobre carregamento v2, migraÃ§Ã£o legada, JSON corrompido, IDs duplicados, jornada em andamento, seguro, perda sem seguro, campanha e fluxo de interface.
- 2026-10-27: verificaÃ§Ã£o final aprovada: `npm test` 13/13 com `expected: 13` e zero erros de pÃ¡gina; `npm run test:syntax`; `git diff --check` nos arquivos rastreados (nÃ£o verifica arquivos nÃ£o rastreados); checagem de whitespace dos novos arquivos; `package.json`/`package-lock.json` vÃ¡lidos. Backups intactos (`BACKUPS_OK`), HEAD `7353b25`, nada em stage e nenhum commit criado. A validaÃ§Ã£o do conjunto staged serÃ¡ registrada apenas quando houver stage futuro.
- 2026-10-27: validaÃ§Ã£o de instalaÃ§Ã£o concluÃ­da: `npm ci` instalou 27 pacotes (0 vulnerabilidades) e `npm test` passou 13/13 com Puppeteer local, `expected: 13` e zero erros de pÃ¡gina; `npm run test:syntax` passou. O npm 11.20.0 nÃ£o executou o `postinstall` do Puppeteer por polÃ­tica de `install-scripts`; o Chrome veio do cache local.
- 2026-10-28: correÃ§Ãµes de infraestrutura/documentaÃ§Ã£o aplicadas: runner sem fallback global do `npx` e com captura individual de falha; `tests/README.md` atualizado; documentos corrigidos sobre IDs duplicados preservados, timestamps no passado, capÃ­tulos independentes e `git diff --check` em arquivos nÃ£o rastreados. ValidaÃ§Ãµes: `npm install` (up to date, 0 vulnerabilidades), `npm test` (13/13, `expected: 13`, 0 erros de pÃ¡gina), `npm run test:syntax` (OK), `node --check` (OK), `git diff --check` (exit 0). Backups intactos; HTML nÃ£o alterado; nenhum stage/commit.
- 2026-10-27: registro inicial indicava que a pasta nÃ£o era um repositÃ³rio Git; o projeto foi depois inicializado como repositÃ³rio Git (HEAD `7353b25`). As cÃ³pias `.bak` continuam preservadas como pontos de retorno adicionais.
- LimitaÃ§Ã£o da validaÃ§Ã£o: a suÃ­te persistente cobre os fluxos principais com salvamentos sintÃ©ticos e RNG controlado; as classes estÃ£o dentro da IIFE e ainda nÃ£o hÃ¡ testes unitÃ¡rios de domÃ­nio sem DOM; nÃ£o cobre sessÃµes longas, equilÃ­brio econÃ´mico nem espera real de 15 s. Nesta execuÃ§Ã£o, `npm ci` e o Puppeteer local foram usados; o `postinstall` do Puppeteer ficou pendente por polÃ­tica do npm e o navegador veio do cache. Uma mÃ¡quina sem cache precisa aprovar/executar o script ou instalar o navegador antes de testar.
- PrÃ³xima aÃ§Ã£o: revisar/commitar as alteraÃ§Ãµes locais quando autorizado; continuar a Fase 2 com estado/serviÃ§o da Guilda e serviÃ§o de jornadas, mantendo os 13 cenÃ¡rios como rede de seguranÃ§a. A auditoria de equilÃ­brio fica como tarefa de produto separada.


## ExtraÃ§Ã£o do domÃ­nio compartilhado â€” 2026-10-29
- [x] Criado `guilda-domain.js` com `Adventurer`, `Mission`, `CampaignMission` e catÃ¡logos; exportaÃ§Ã£o CommonJS para testes e `GuildaDomain` para navegador.
- [x] HTML carrega o mÃ³dulo local sem dependÃªncias externas; preservado o formato de salvamento `guildaSave` v2.
- [x] Adicionados 7 testes unitÃ¡rios puros de domÃ­nio e integrados ao `npm test` antes dos 13 cenÃ¡rios de regressÃ£o.
- [x] ValidaÃ§Ã£o final: sintaxe OK; 7/7 testes de domÃ­nio; 13/13 cenÃ¡rios de regressÃ£o; zero erros de pÃ¡gina; `git diff --check` exit 0; JSON do pacote e lockfile vÃ¡lidos.
- LimitaÃ§Ã£o atual: `PersistenceService`, `JourneyService`, estado e UI ainda estÃ£o na IIFE. A suÃ­te nÃ£o cobre espera real de 15 s, sessÃµes longas nem balanceamento.
- PrÃ³xima etapa: modelar `GuildState`/serviÃ§o da Guilda e isolar as regras de jornadas para testes sem DOM, sem mudar `guildaSave` v2.


## Direção de arte e uso de IA local — 2026-11-02
- Decisão: a Guilda é o foco central da experiência; aventureiros são o coração visual/emocional, com destaque contextual (sede, recrutamento/gerenciamento e missões), sem transformar o jogo em RPG de controle direto de um único herói.
- Os spritesheets atuais do Guerreiro (`Guerreiro, ocioso/ataque/morrendo.png`) permanecem como referência canônica de personagem. Não substituir nem alterar os originais com base em uma geração isolada.
- `ComfyUI-Teste-01.png` é um experimento de direção visual, não um asset aprovado: a imagem tem acabamento de fantasia medieval interessante, mas altera a identidade do Guerreiro e não atende aos requisitos de sprite animado consistente.
- Direcionar as próximas experiências locais do ComfyUI prioritariamente a cenários/ambientes e elementos estáticos, nos quais não há exigência de identidade de personagem entre quadros. Retratos/ilustrações podem ser aproveitados apenas quando coerentes com a arte do jogo e com função clara.
- Critérios antes de integrar qualquer asset: coerência com a interface e os sprites existentes, legibilidade na escala real, enquadramento/recorte adequados, transparência quando necessária, desempenho e finalidade concreta no gameplay. Manter geração local gratuita; sem serviços pagos, APIs ou credenciais.
- Próximo experimento recomendado: conceito de ambiente da sede da Guilda, sem personagens, para avaliar se o ComfyUI acrescenta valor visual sem descaracterizar a interface atual. A imagem deverá permanecer isolada até avaliação; não alterar gameplay nem saves.


## Organização das fontes de planejamento — 2026-11-02
- A raiz é a fonte canônica para instruções, plano mestre, arquitetura, progresso e relatório de etapa.
- `Planejamento/README.md` documenta a função da pasta de referências e o arquivo histórico.
- As versões antigas dos quatro documentos que estavam em `Planejamento/` foram preservadas em `Planejamento/Arquivo/2026-10-27/` após comparação com as versões atuais da raiz. Não são requisitos novos nem estado vigente.
- Ao avaliar novos textos em `Planejamento/`, extrair requisitos e propostas sem apagar ou reescrever a fonte original; consolidar decisões somente neste plano e nos documentos canônicos apropriados.

### Prioridades ativas consolidadas
1. Continuar a evolução da experiência e da interface sem comprometer as regras e os salvamentos existentes.
2. Completar a avaliação de acessibilidade com leitor de tela e validação manual em dispositivos reais.
3. Avançar a direção visual de forma sistêmica: experimentar ambientes da sede no ComfyUI local; manter sprites originais como referência e não integrar imagens experimentais sem avaliação.
4. Separar gradualmente a orquestração restante da UI quando houver benefício concreto e testes adequados.
5. Preparar a distribuição PWA em etapa própria: instalação, responsividade, operação offline e atualização.


## Centralização definitiva do planejamento — 2026-11-02
- Decisão estrutural: `Planejamento/` é o ponto principal do projeto para requisitos, referências, decisões, arquitetura, prioridades, progresso e relatórios. Os documentos oficiais estão todos nesta pasta.
- A raiz fica reservada ao jogo executável, módulos locais, assets, testes, dependências e configurações técnicas necessárias.
- `AGENTS.md` na raiz é somente um encaminhador para `Planejamento/AGENTS.md`, mantido por compatibilidade com ferramentas que descobrem instruções a partir da raiz.
- Backups de HTML e testes foram preservados em `Planejamento/Arquivo/Backups/`; snapshots documentais antigos permanecem em `Planejamento/Arquivo/2026-10-27/`.
- Esta organização substitui orientações anteriores deste documento que indicavam a raiz como fonte oficial dos documentos de coordenação.


## Experimento visual da sede — 2026-11-02
- [x] Executadas quatro gerações locais no ComfyUI com SD 1.5, 640×384, RTX 3050 4 GB, sem custo externo.
- [x] Comparada a interface atual com uma composição hero usando a geração v03; prévia desktop/mobile validada sem overflow horizontal e sem erros de página.
- Resultado: o modelo produz imagens atraentes, mas confunde sede de guilda com restaurante/recepção e gera pseudo-texto. Nenhuma imagem aprovada para integração.
- Próxima abordagem: mudar o método visual (2D estilizado, referência própria, zonas funcionais explícitas e/ou fundo parcial discreto), em vez de repetir variações quase idênticas do mesmo prompt. Integração depende de benefício claro para leitura e experiência.
- Registro técnico completo: `Arte/Sede/EXPERIMENTO_COMFYUI.md`.


## Direção de cenário explorável — decisão de produto (2026-11-02)
A sede deve evoluir para um ambiente 2D explorável com personagens caminhando, não somente um fundo decorativo. Direção visual: perspectiva elevada 3/4/isométrica, piso central conectado e mobiliário junto ao perímetro; mural de contratos à esquerda, recepção à direita, mapa/mesa de expedições ao fundo, estandartes. Personagens e hotspots serão camadas independentes. Os testes atuais do SD 1.5 não atingiram a composição; próxima etapa requer referência controlada ou blockout próprio antes do acabamento por IA. Critérios detalhados em `Arte/Sede/EXPERIMENTO_COMFYUI.md`.

#### Protótipo de sede explorável — etapa incremental (2026-11-02)
- [x] Definir a sede como uma sala 2D isométrica única, com mural de contratos, recepção, planejamento e circulação central.
- [x] Criar blockout vetorial isolado e testar geração de acabamento guiada pela composição; as saídas de IA foram rejeitadas por ganho insuficiente e permanecem fora do jogo.
- [x] Implementar deslocamento contínuo por clique/toque, busca de caminho, colisão com mobiliário e setas do teclado no protótipo.
- [x] Tornar os três pontos de interesse selecionáveis e comunicar a função de cada um.
- [x] Implementar zonas de aproximação para as três estações e ativação demonstrativa por Enter; rotas verificadas a partir do centro inicial.
- [ ] Validar colisões a partir de múltiplas posições e ligar cada hotspot ao fluxo real correspondente.
- [ ] Integrar a sede à interface do jogo somente após demonstrar valor de gameplay e responsividade.
- [ ] Produzir arte final em camadas, mantendo cenário e sprites de aventureiros independentes.


## Prioridade de produto — vida nas expedições e campanha (2026-11-02)
A direção ativa passa a priorizar a experiência das missões e da campanha. A sede explorável permanece preservada como protótipo paralelo, sem consumir o foco central nesta etapa.

- [x] Criar uma apresentação reutilizável para expedições comuns e capítulos da campanha, sincronizada com o tempo de missão existente.
- [x] Exibir partida, exploração, objetivo e retorno, com cenários e marcos contextuais.
- [x] Dar identidade visual distinta aos quatro capítulos da campanha, sem mudar gameplay ou salvamentos.
- [ ] Acrescentar momentos de confronto e resultado da campanha, com sucesso/fracasso apresentados de forma mais memorável e breve.
- [ ] Projetar animações de caminhada/ação consistentes para os sprites reais; não substituir os sprites canônicos sem avaliação.
- [ ] Validar visualmente em desktop/mobile e ajustar intensidade/legibilidade; manter movimento reduzido.
Critério: apresentação clara e atraente, sincronizada com a jornada, sem afetar duração, RNG, risco, recompensas, economia ou compatibilidade de save.

## Continuidade — momentos de campanha e resultado das jornadas (2026-11-02)
- [x] Ambientes e nomes de capitulos alinhados a campanha existente.
- [x] Confronto visual contextual durante a fase de objetivo dos capitulos da campanha.
- [x] Banner temporario para sucesso/fracasso e vitoria final, sem persistir dados transitorios.
- [ ] Desenvolver caminhada e acao em sprites reais, com animacoes consistentes entre classes.
- [ ] Criar cenarios ilustrados finais apos validar direcao visual e assets em desktop/mobile.
- [ ] Refinar transicoes de partida, confronto e retorno com intensidade moderada e opcao de movimento reduzido.


## Atualização de execução — 2026-11-03
- [x] Atualizar a regressão de interface para reconhecer avatares CSS e spritesheets no mesmo contrato visual.
- [x] Validar navegação da sede a partir de múltiplas regiões caminháveis até contratos, recepção e planejamento.
- [x] Proteger continuidade de rota e prevenção de corte diagonal nas quinas com verificações automatizadas.
- [x] Reexecutar suíte completa: 286 verificações unitárias/baseline, 13/13 cenários Puppeteer e zero erros de página.
- [ ] Próxima entrega da sede: conectar hotspots a operações reais por adaptador de integração, sem acoplar navegação à lógica de domínio e sem integrar prematuramente o blockout ao HTML principal.


## Feedback visual de perdas em expedições — 2026-11-03
- [x] Integrar a spritesheet original de morte do Guerreiro ao adaptador visual, sem substituir ou editar o asset.
- [x] Exibir a animação somente quando a resolução remove efetivamente o aventureiro do roster; seguro consumido com sobrevivência não apresenta morte.
- [x] Manter o resultado e a lista de perdas transitórios, sem ampliar guildaSave v2.
- [x] Executar a animação uma vez, manter fase consistente durante re-renderizações e respeitar prefers-reduced-motion com quadro final estático.
- [x] Cobrir o fluxo protegido, a perda real, o asset CSS e a ausência de persistência em regressão Puppeteer.
- [x] Suíte completa: 292 verificações unitárias/baseline, 13/13 cenários Puppeteer, zero erros de página.
- [ ] Próxima entrega: adaptador desacoplado para ligar os três hotspots da sede aos fluxos reais do jogo.


## Preparação para distribuição — 2026-11-03
- [x] Confirmar a aplicação como site estático sem etapa de build e identificar os caminhos locais obrigatórios de módulos e sprites.
- [x] Preparar proteção de arquivos locais/sensíveis em .gitignore.
- [x] Preparar rewrite da rota inicial na Vercel sem duplicar o HTML do jogo.
- [x] Preparar CI no GitHub Actions com instalação reproduzível e suíte completa.
- [x] Documentar publicação e limitações de persistência no README da raiz.
- [ ] Criar/conectar repositório remoto GitHub após autorização e revisar o conjunto a publicar; não incluir arquivos secretos ou backups por engano.
- [ ] Executar o workflow no GitHub e validar o deploy de preview/produção na Vercel.
- [ ] Planejar backend e autenticação somente quando a sincronização de salvamentos entre dispositivos se tornar requisito prioritário.
- Critério de saída desta preparação local: arquivos de configuração criados, JSON/configuração revisados, suíte local aprovada e estado Git preexistente preservado. A publicação externa permanece pendente.
