# Guilda dos Aventureiros — Plano Mestre
Versão: 1.4
Última revisão: 2026-10-27
Status: Fase 2 iniciada: `Adventurer` e `PersistenceService` implementados; suíte persistente com 13 cenários aprovada; próxima etapa é extrair estado/serviço da Guilda e jornadas.

## 1. Objetivo
Evoluir o protótipo existente para um jogo incremental de gerenciamento de guilda, com desenvolvimento conduzido pela IA de forma autônoma sempre que possível. Preservar funcionalidades existentes e evitar mudanças de arquitetura sem justificativa e validação.

## 2. Estado atual confirmado
- A raiz contém o arquivo `Guilda dos Aventureiros.html`.
- O protótipo está implementado em um único HTML com CSS e JavaScript embutidos.
- Sistemas existentes: ouro, reputação, nível do salão, pergaminhos/prestígio, recrutamento, classes, raridades, roster, seleção de grupo, seguro, missões temporizadas, jornadas, recompensas e campanha de quatro etapas.
- A persistência inicial gravava somente `scrolls` e `campaignStage`; foi ampliada para o estado principal e agora usa o formato versionado `v2`, carregado e gravado por `PersistenceService` com a mesma chave `guildaSave`.
- O salvamento ocorre em ações relevantes, periodicamente e no evento `pagehide`; as funções `load()` e `save()` permanecem como wrappers dos métodos do serviço para preservar os pontos de chamada existentes. Jornadas são reconstruídas usando os catálogos de missões para evitar dependência de identidade de objeto.
- O carregamento valida campos essenciais dos aventureiros por `Adventurer.fromSaved` e rejeita registros com nome, classe, raridade, poder ou custo inválidos.
- Além do jogo, a raiz contém os dois backups, os documentos de coordenação, o diretório `.git`, `package.json`, `package-lock.json`, `.gitignore` e o diretório `tests/`; a suíte persistente usa Puppeteer apenas como dependência de desenvolvimento, exige Node.js `>=22.12.0` e o jogo continua sem dependências de runtime.
- A arquitetura ainda mantém o estado e a interface dentro de uma função anônima, mas já possui as classes de domínio `Mission`, `CampaignMission`, `Adventurer` e `PersistenceService`. `CampaignMission` herda de `Mission` e sobrescreve `applyRewards` para avançar a campanha polimorficamente; `Adventurer` encapsula validação, seguro e estado operacional; `PersistenceService` centraliza leitura e gravação versionada.

## 3. Princípios de desenvolvimento
1. Inspecionar o código completo e consultar este plano antes de cada etapa.
2. Preservar a experiência e as funcionalidades que já existem, salvo quando uma correção exigir alteração explícita.
3. Trabalhar em etapas pequenas, verificáveis e reversíveis.
4. Usar orientação a objetos onde ela trouxer valor real: entidades com responsabilidade clara, encapsulamento e polimorfismo quando houver comportamentos genuinamente diferentes. Evitar classes artificiais.
5. Separar regras de domínio da interface gradualmente, sem reescrita total prematura.
6. Não adicionar dependências externas sem necessidade demonstrada.
7. Não afirmar que testes passaram sem executá-los.
8. Antes de mudanças grandes, registrar impacto, estratégia de migração e critério de aceitação.
9. Manter cópia de segurança ou controle de versão antes de refatorações relevantes, quando disponível.
10. Pedir intervenção do usuário apenas para decisões de produto realmente importantes, custos, credenciais, riscos irreversíveis ou falta de informação essencial.

## 4. Auditoria técnica inicial
### Prioridade alta
- [x] Persistir recursos, nível, elenco, taverna, identificadores, progresso, seleção e jornadas.
- [x] Restaurar jornadas por referência aos catálogos, sem depender de identidade de objeto.
- [x] Migrar salvamentos antigos e recuperar JSON corrompido para um estado inicial válido.
- [x] Rejeitar registros de aventureiros com campos essenciais inválidos ao carregar.
- [x] Impedir que o mesmo aventureiro seja associado a mais de uma jornada restaurada e rejeitar durações inválidas.
- [x] Rejeitar IDs duplicados entre o roster e a taverna durante o carregamento (correção preexistente preservada; não criada nesta tarefa).
- [x] Testar conclusão de missão com timestamps no passado (não mede espera real de 15 s), recompensa e avanço da primeira etapa da campanha.
- [x] Testar falha com risco acionado e consumo do seguro, preservando o aventureiro.
- [x] Testar os quatro capítulos da campanha em cenários/salvamentos independentes (não em sessão contínua) e a perda de aventureiros sem seguro (suíte persistente, 2026-10-27).

### Prioridade média
- [x] Verificar regras de sucesso, risco, seguro, recompensa e progressão da campanha (coberto pela suíte persistente).
- Revisar ações de botões e estados desabilitados para evitar gastos ou despachos inválidos.
- Melhorar legibilidade e acessibilidade da interface sem alterar desnecessariamente seu estilo.
- [x] Estabelecer testes de regressão para as principais regras (13 cenários em `tests/`, 2026-10-27).

### Prioridade estrutural
- [ ] Extrair progressivamente o domínio do HTML para módulos separados, caso o ambiente de execução permita sem comprometer a simplicidade de abrir o jogo localmente.
- [x] Introduzir `Adventurer` e `PersistenceService` com responsabilidades claras, preservando o formato `guildaSave` v2.
- [ ] Introduzir estado/serviço da Guilda e serviço de jornadas quando os limites estiverem suficientemente claros.
- [ ] Criar testes para regras puras antes de ampliar os sistemas; as classes atuais ainda estão dentro da IIFE e são exercitadas pela suíte de integração.

## 5. Fases de trabalho
### Fase 0 — Baseline e segurança
- Confirmar arquivos, ambiente e forma de execução.
- Registrar o estado original e verificar se existe Git ou outra cópia de segurança.
- Definir critérios de regressão: recrutamento, seleção, despacho, conclusão, falha, seguro, melhoria e campanha.

### Fase 1 — Confiabilidade
- Corrigir persistência e recuperação de sessão.
- Tratar migração de salvamentos antigos e dados inválidos.
- Testar jornadas em andamento, recarga de página e recompensas.
Critério de saída: estado válido é restaurado de forma consistente e as regras principais passam nos testes disponíveis.

### Fase 2 — Domínio e arquitetura
- [x] Iniciar a extração de POO com `Adventurer` e `PersistenceService`, mantendo a suíte verde.
- [ ] Separar as regras de negócio restantes da renderização.
- [ ] Introduzir estado/serviço da Guilda e serviço de jornadas com encapsulamento e polimorfismo apenas onde apropriado.
- [ ] Preservar o formato simples de execução local sempre que viável.
Critério de saída: regras centrais podem ser testadas sem depender de manipulação do DOM.

### Fase 3 — Equilíbrio e experiência
- Revisar economia, curva de progressão, risco, recompensas e prestígio.
- Melhorar feedback de ações e estados de interface.
- Validar responsividade e acessibilidade básica.
Critério de saída: regras documentadas, comportamento consistente e ausência de regressões conhecidas.

### Fase 4 — Expansão do jogo
- Priorizar novos sistemas após estabilizar a base.
- Cada recurso novo deve ter objetivo, regras, integração, critérios de aceitação e testes.
- Não ampliar o escopo com mecânicas aleatórias sem avaliar seu impacto no jogo.

## 6. Fluxo autônomo por tarefa
1. Consultar este plano e o código atual.
2. Identificar a causa ou necessidade concreta.
3. Definir a menor alteração segura.
4. Implementar mantendo compatibilidade.
5. Executar verificações e testes disponíveis.
6. Corrigir falhas encontradas.
7. Atualizar este plano com decisões e resultados reais.
8. Relatar arquivos alterados, testes executados, limitações e próxima etapa.

## 7. Registro de decisões
- D-001: O arquivo inicial confirmado é `Guilda dos Aventureiros.html`; não presumir que exista `index.html`.
- D-002: A evolução será incremental, preservando o protótipo funcional.
- D-003: POO é uma diretriz, mas a modelagem deve refletir responsabilidades reais e não criar complexidade artificial.
- D-004: Persistência e recuperação de jornadas são a primeira prioridade técnica.
- D-005: A suíte de testes persistente usa Node.js + Puppeteer como dependência apenas de desenvolvimento; o HTML do jogo permanece autônomo e sem dependências de runtime.
- D-006: A primeira etapa da Fase 2 extrai `Adventurer` e `PersistenceService` dentro do próprio HTML. `Adventurer` encapsula validação, seguro, status e serialização; `PersistenceService` centraliza leitura e gravação na chave `guildaSave`, versão 2. Nenhuma regra de economia, risco ou progressão foi alterada.
- D-007: A suíte deve permanecer com exatamente 13 cenários enquanto esse for o baseline acordado; o runner falha se a quantidade mudar. O caminho reproduzível é `npm ci` com `package-lock.json` e Node.js `>=22.12.0`. O runner resolve somente a dependência declarada em `node_modules` local; não há fallback para cache global do `npx`. A correção preexistente de IDs duplicados no HTML foi preservada, não criada nesta tarefa. A conclusão de missão é testada com timestamps no passado e não mede espera real de 15 s. Os quatro capítulos da campanha são cobertos em salvamentos/cenários independentes, não em uma sessão contínua. O `git diff --check` não verifica arquivos não rastreados; a validação do conjunto staged será registrada apenas quando houver stage futuro.

## 8. Registro de execução
- 2026-10-27: acesso remoto autorizado e raiz inspecionada.
- 2026-10-27: arquivo HTML de 323 linhas lido integralmente na leitura inicial (o arquivo cresceu depois com as alterações registradas abaixo).
- 2026-10-27: identificada persistência parcial; plano inicial criado.
- 2026-10-27: criada cópia de segurança `Guilda dos Aventureiros.html.bak` antes da primeira alteração.
- 2026-10-27: persistência ampliada para recursos, nível, elenco, taverna, IDs, seleção, progresso e jornadas; restauração de missões normalizada para referências do catálogo; salvamento periódico e no evento `pagehide`.
- 2026-10-27: verificação sintática do JavaScript extraído executada com Node.js e aprovada após as últimas alterações.
- 2026-10-27: testes automatizados em Chromium/Puppeteer aprovados após as alterações de persistência e validação: carregamento inicial, taverna com quatro opções, contratação, seleção, despacho e restauração de jornada após recarga; ouro, roster, missão e status ocupado preservados; nenhum erro de página.
- 2026-10-27: teste automatizado aprovado para migração de salvamento legado (`scrolls`/`campaignStage`) para formato versionado v2.
- 2026-10-27: teste automatizado aprovado para recuperação de JSON de salvamento corrompido, retornando a um estado inicial válido sem erro de página.
- 2026-10-27: validação de sintaxe JavaScript aprovada novamente após as últimas alterações.
- 2026-10-27: validação adicional no carregamento rejeita aventureiros com nomes fora do catálogo ou poder/custo inválidos; ações de seguro, contratação e despacho receberam verificações defensivas.
- 2026-10-27: restauração de jornadas passou a descartar referências inválidas, durações negativas e aventureiros duplicados entre jornadas.
- 2026-10-27: primeira etapa de POO aplicada com `Mission` e `CampaignMission`; recompensas são processadas por métodos de domínio e a campanha avança por sobrescrita polimórfica de `applyRewards`.
- 2026-10-27: teste automatizado com Chromium/Puppeteer aprovado após a refatoração: restauração de missão comum, conclusão e recompensa, conclusão da primeira etapa da campanha, estado sem jornadas pendentes e nenhum erro de página.
- 2026-10-27: teste automatizado aprovado para falha de missão com risco acionado: o seguro foi consumido, o aventureiro sobreviveu e nenhum erro de página ocorreu.
- 2026-10-27: teste de dados inválidos aprovado: IDs repetidos entre roster/taverna e aventureiro repetido em jornadas foram filtrados; somente uma jornada válida foi restaurada.
- 2026-10-27: criado backup pré-refatoração `Guilda dos Aventureiros.pre-POO.html.bak`.
- 2026-10-27: criada suíte persistente em `tests/` (`check-syntax.cjs`, `guilda-regression.cjs`, `README.md`), `package.json` e `.gitignore`; `npm test` executa verificação sintática e 13 cenários.
- 2026-10-27: `npm test` aprovado com 13/13 cenários e zero erros de página; `npm run test:syntax` e `git diff --check` aprovados. A suíte foi adicionada sem alterar a lógica do jogo; a refatoração posterior de classes está registrada abaixo. Backups intactos; sem commit.
- 2026-10-27: Fase 2 iniciada com a extração de `Adventurer` no HTML: validação de restauração, custo de seguro, status operacional (`isIdle`, `isOnMission`, `markOnMission`, `markIdle`), consumo de seguro e serialização estável. `makeAdv`, carregamento, seguro, seleção, despacho, resolução de missão e renderização passaram a usar a entidade.
- 2026-10-27: `PersistenceService` extraído para centralizar `load(target)`/`save(source)` na chave `guildaSave`, versão 2; wrappers `load()`/`save()` preservam os pontos de chamada. O formato salvo e a restauração de jornadas/catálogos foram mantidos.
- 2026-10-27: empacotamento de desenvolvimento ajustado: `engines.node` `>=22.12.0`, `package-lock.json` gerado, runner com quantidade esperada de 13 cenários, fallback `npx` limitado à versão fixada e aviso explícito quando usado.
- 2026-10-27: `npm test` aprovado após a refatoração com 13/13 cenários e zero erros de página; `npm run test:syntax` aprovado. A suíte cobre carregamento v2, migração legada, JSON corrompido, IDs duplicados, jornada em andamento, seguro, perda sem seguro, campanha e fluxo de interface.
- 2026-10-27: verificação final aprovada: `npm test` 13/13 com `expected: 13` e zero erros de página; `npm run test:syntax`; `git diff --check` nos arquivos rastreados (não verifica arquivos não rastreados); checagem de whitespace dos novos arquivos; `package.json`/`package-lock.json` válidos. Backups intactos (`BACKUPS_OK`), HEAD `7353b25`, nada em stage e nenhum commit criado. A validação do conjunto staged será registrada apenas quando houver stage futuro.
- 2026-10-27: validação de instalação concluída: `npm ci` instalou 27 pacotes (0 vulnerabilidades) e `npm test` passou 13/13 com Puppeteer local, `expected: 13` e zero erros de página; `npm run test:syntax` passou. O npm 11.20.0 não executou o `postinstall` do Puppeteer por política de `install-scripts`; o Chrome veio do cache local.
- 2026-10-28: correções de infraestrutura/documentação aplicadas: runner sem fallback global do `npx` e com captura individual de falha; `tests/README.md` atualizado; documentos corrigidos sobre IDs duplicados preservados, timestamps no passado, capítulos independentes e `git diff --check` em arquivos não rastreados. Validações: `npm install` (up to date, 0 vulnerabilidades), `npm test` (13/13, `expected: 13`, 0 erros de página), `npm run test:syntax` (OK), `node --check` (OK), `git diff --check` (exit 0). Backups intactos; HTML não alterado; nenhum stage/commit.
- 2026-10-27: registro inicial indicava que a pasta não era um repositório Git; o projeto foi depois inicializado como repositório Git (HEAD `7353b25`). As cópias `.bak` continuam preservadas como pontos de retorno adicionais.
- Limitação da validação: a suíte persistente cobre os fluxos principais com salvamentos sintéticos e RNG controlado; as classes estão dentro da IIFE e ainda não há testes unitários de domínio sem DOM; não cobre sessões longas, equilíbrio econômico nem espera real de 15 s. Nesta execução, `npm ci` e o Puppeteer local foram usados; o `postinstall` do Puppeteer ficou pendente por política do npm e o navegador veio do cache. Uma máquina sem cache precisa aprovar/executar o script ou instalar o navegador antes de testar.
- Próxima ação: revisar/commitar as alterações locais quando autorizado; continuar a Fase 2 com estado/serviço da Guilda e serviço de jornadas, mantendo os 13 cenários como rede de segurança. A auditoria de equilíbrio fica como tarefa de produto separada.
