# Progresso — Guilda dos Aventureiros

Ultima atualizacao: 2026-11-03 - auditoria do primeiro envio GitHub/Vercel, feedback visual de perdas e validacao da sede

## Situação
- Fase 2 concluída nos serviços centrais; Fase 3 em andamento. Domínio, jornadas, persistência e ciclo temporal estão em módulos locais. Validação atual (2026-11-03): 292 verificações unitárias/baseline + 13 cenários Puppeteer aprovados, zero erros de página.
- Entregas visuais recentes: avatares animados e falas contextuais em balões na taverna, no roster ocioso e durante missões. As falas são determinísticas por ID e contexto; não alteram RNG, estado, economia ou salvamento.
- Validação atual: `npm test` aprovado em 2026-11-03; 7 domínio; 9 GuildService; 8 JourneyService; 6 GameLoop; 7 baseline econômico; 11 PersistenceService; 201 navegação da sede; 24 apresentação de expedições; 19 sprites = 292 verificações; 13/13 regressões Puppeteer; zero erros de página; exit code 0.
- Arquivo de jogo confirmado: `Guilda dos Aventureiros.html`.
- Backups disponíveis e preservados em `Planejamento/Arquivo/Backups/`; snapshots pré-etapa de 2026-11-02 também permanecem no arquivo histórico. Os nomes `.bak` antigos não estão na raiz ativa.
- Empacotamento de desenvolvimento: `package.json` exige Node.js `>=22.12.0` e Puppeteer `25.16.0`; `package-lock.json` foi gerado. O jogo continua abrível sem instalação.
- O plano registra verificações históricas. Em 2026-10-27, 13 verificações de baseline foram consolidadas em `tests/`; depois da extração de classes, `npm test` continua aprovando 13/13 cenários com zero erros de página.

## Preparação da comunicação entre agentes — 2026-10-27
- [x] Inspecionar a raiz e ler o plano mestre e o HTML atual.
- [x] Confirmar OpenCode instalado (versão observada: 1.19.4) e Node.js disponível (v26.12.1).
- [x] Definir `AGENTS.md` como instruções locais para o OpenCode.
- [x] Criar este registro e a descrição inicial da arquitetura.
- [x] Estabelecer controle de versão Git e registrar o baseline atual (HEAD `7353b25`; alterações locais preservadas).
- [x] Diagnosticar falha ao iniciar comandos do OpenCode: a instalação global 1.19.4 falha com `Database is not empty and has no session table`; a CLI do Desktop 2.1.3 foi validada.
- [ ] Identificar e validar um provedor/modelo autenticado para o OpenCode (não há integrações autenticadas; modelos `opencode/*-free` funcionam sem login e foram validados).
- [x] Restaurar ou reconstruir a suíte de testes persistente; 13 cenários em `tests/`, executados por `npm test` (2026-10-27).
- [x] Executar verificações de baseline antes de mudanças de gameplay (13/13 na suíte persistente em 2026-10-27).

## Diálogos contextuais de NPCs — 2026-11-01
- [x] Adicionar falas determinísticas nos cartões de recrutamento, aventureiros ociosos e aventureiros em missão.
- [x] Estilizar os balões com tokens existentes do tema, preservando os cartões e a identidade visual.
- [x] Estender regressões para validar quatro falas na taverna, falas no roster e contexto `journey` durante missão.
- Resultado: `npm test` aprovado — 7 domínio, 9 GuildService, 8 JourneyService, 11 PersistenceService e 13 regressões; 0 falhas e 0 erros de página.
- Persistência `guildaSave` v2, RNG, relógio, economia e regras de jogo não foram alterados.

## Extração do ciclo temporal — 2026-11-01
- [x] Criar `GameLoop` em `guilda-loop.js`, isolando a verificação de jornadas vencidas, renderização e agendamento.
- [x] Injetar relógio, agendador e cancelador para permitir testes determinísticos sem DOM ou espera real.
- [x] Manter o loop de 400 ms, a resolução de missões e o salvamento periódico existentes.
- [x] Adicionar 6 testes unitários e incluir o módulo na verificação de sintaxe e em `npm test`.
- Resultado: `npm test` aprovado com 41 testes unitários, 13 regressões e 0 erros de página.
- O contrato `guildaSave` v2 e as regras de jogo foram preservados.

## Feedback e acessibilidade da interface — 2026-11-01
- [x] Tornar cartões de recrutamento e seleção operáveis por teclado (Enter e Espaço), com foco visível, papel de botão e rótulos acessíveis.
- [x] Expor o estado de seleção dos aventureiros com `aria-pressed`.
- [x] Desabilitar despacho de missões enquanto não houver grupo selecionado, evitando ação sem efeito; o botão volta a habilitar após a seleção.
- [x] Publicar mensagens de resultado da interface em região `role=status` com `aria-live=polite`.
- [x] Dar nome acessível ao controle de contratação de seguro e declarar botões dinâmicos como `type=button`.
- [x] Estender regressões para verificar acessibilidade inicial, seleção por teclado e operação do seguro sem propagação acidental de teclas para o cartão.
- [x] Verificar ausência de rolagem horizontal em viewports de 320 px e 390 px.
- Resultado final: `npm test` exit code 0; sintaxe dos quatro módulos e script inline OK; 7 domínio + 9 GuildService + 8 JourneyService + 6 GameLoop + 7 baseline econômico + 11 PersistenceService = 48 testes/verificações; 13/13 cenários de regressão; 0 erros de página. `git diff --check` exit code 0.
- Regras econômicas, RNG, persistência `guildaSave` v2 e identidade visual foram preservados.

Ultima atualizacao: 2026-11-02 - navegacao funcional no prototipo da sede
- [x] Exibir poder total do grupo selecionado em relação ao requisito da missão.
- [x] Exibir a chance real de sucesso usando `Mission.successChance(power)`, sem duplicar a fórmula na interface.
- [x] Explicar que `risk` é aplicado individualmente a cada aventureiro somente após o fracasso; o seguro evita a perda e é consumido.
- [x] Apresentar a avaliação nas missões comuns e na etapa desbloqueada da campanha; missões em andamento não exibem uma previsão enganosa baseada em seleção vazia.
- [x] Ampliar o cenário de interface existente para verificar as informações nas duas áreas, mantendo os 13 cenários.
- Resultado: `npm test` aprovado; sintaxe OK; 7 domínio + 9 GuildService + 8 JourneyService + 6 GameLoop + 7 baseline econômico + 11 PersistenceService; 13/13 regressões; 0 erros de página. Total: 76 testes/verificações.
- Nenhuma regra de sucesso, risco, RNG, economia, recompensa ou salvamento foi alterada.

## Próximas tarefas
1. Complementar auditoria de acessibilidade com leitor de tela e validação visual manual em dispositivos reais.
2. Em frente paralela, avaliar ferramentas e pipeline de animação assistida por IA com um único NPC de teste, mantendo a identidade visual atual como referência; não integrar serviços de geração em tempo real.
3. Preparar PWA na fase adequada, sem dependências de runtime antecipadas.



As alterações locais continuam sem commit; não criar commit sem autorização explícita.

## Extração de Adventurer e PersistenceService — 2026-10-27
- [x] Implementar `Adventurer` no HTML com validação de restauração, custo de seguro, status operacional, consumo de seguro e serialização estável.
- [x] Integrar `Adventurer` em `makeAdv`, carregamento, seguro, seleção, despacho, resolução de missão e renderização.
- [x] Implementar `PersistenceService` com `load(target)`/`save(source)`, chave `guildaSave`, versão 2 e armazenamento injetável.
- [x] Manter wrappers `load()`/`save()` para preservar os pontos de chamada existentes e o evento `pagehide`.
- [x] Preservar o formato v2 e a restauração de jornadas/catálogos; migração legada, JSON corrompido e IDs duplicados continuam cobertos.
- [x] Adicionar `engines.node` `>=22.12.0`, gerar `package-lock.json`, fazer o runner exigir exatamente 13 cenários e capturar falha individual por cenário.
- [x] Remover o fallback silencioso para cache global do `npx`; o runner resolve somente a dependência declarada localmente e exibe erro claro com instruções de `npm install` quando ela estiver ausente. A correção preexistente de IDs duplicados foi preservada, não criada nesta tarefa.
- Resultado real: `npm test` aprovado com 13/13 cenários e zero erros de página; `npm run test:syntax` aprovado após a refatoração. A conclusão de missão usa timestamps no passado e não mede espera real de 15 s; os quatro capítulos são cobertos em cenários independentes.
- Verificação final: `git diff --check` nos arquivos rastreados (não verifica arquivos não rastreados); checagem de whitespace dos novos arquivos aprovada; `package.json`/`package-lock.json` válidos; backups intactos (`BACKUPS_OK`); HEAD `7353b25`; nada em stage; nenhum commit criado. A validação do conjunto staged será registrada apenas quando houver stage futuro.
- Limitações: as classes e o estado ainda estão dentro da IIFE; não há testes unitários de domínio sem DOM. A suíte é de integração, com salvamentos sintéticos e RNG controlado; não cobre espera real, sessões longas nem equilíbrio econômico. A validação de instalação e o aviso de `postinstall` do Puppeteer estão registrados na seção seguinte.
- Backups preservados; nenhum commit criado.

## Validação da instalação e do comportamento — 2026-10-27
- [x] Revisar o diff atual do HTML, dos documentos, do `package.json`, do lockfile e dos testes sem descartar alterações preexistentes.
- [x] Verificar inicialização de `Adventurer`, restauração de dados antigos, consumo de seguro, despacho/resolução e compatibilidade do salvamento v2.
- [x] Confirmar que `PersistenceService` preserva os wrappers `load()`/`save()`, o `pagehide`, o `setInterval(save, 5000)` e a restauração de jornadas.
- [x] Executar `npm ci`: 27 pacotes instalados, 28 auditados, 0 vulnerabilidades; Puppeteer local `25.16.0`; npm `11.20.0`.
- [x] Executar `npm test`: 13/13 cenários, `expected: 13`, 0 erros de página, usando `Puppeteer: node_modules local`.
- [x] Executar `npm run test:syntax`: OK, 1 script inline verificado.
- [x] Conferir `git diff --check`, whitespace dos novos arquivos, `package.json`/lockfile, backups e estado do Git.
- Aviso ambiental do `npm ci`: `npm warn install-scripts 1 package has install scripts not yet covered by allowScripts: puppeteer@25.16.0 (postinstall: node install.mjs)`. O `postinstall` pode não ser executado; o runner usa somente a dependência local e falha com instrução de `npm install` se ela estiver ausente. Em uma máquina sem navegador, será necessário aprovar/executar o script conforme a política do npm ou instalar o navegador antes de testar. O `npm install` baixa o navegador compatível do Puppeteer; sem lockfile, a instalação não é totalmente reproduzível.
- Nenhuma regressão de comportamento foi encontrada nos fluxos cobertos. Nenhuma nova refatoração foi iniciada nesta etapa.
- Limitações restantes: a validação é de integração, com dados sintéticos; não cobre espera real, sessões longas, equilíbrio econômico, testes unitários sem DOM nem uma instalação limpa sem cache de navegador.
- Git: `HEAD 7353b25`; nada em stage; nenhum commit criado; backups intactos.

## Registro de alterações
- 2026-10-27: criados `AGENTS.md`, `ARQUITETURA.md` e `PROGRESSO.md` para instruções locais, arquitetura observada e comunicação durável entre agentes.
- 2026-10-27: a listagem atual não encontrou o arquivo `domain-test.cjs`, embora ele tenha aparecido em contexto anterior; não presumir que o teste exista. O histórico de testes do plano é mantido como histórico, não como execução atual.
- 2026-10-27: criada suíte persistente em `tests/` com `npm test`; 13/13 cenários aprovados, zero erros de página, sem alteração da lógica do jogo.
- 2026-10-27: Fase 2 iniciada com `Adventurer`/`PersistenceService` no HTML; `npm test` manteve 13/13 cenários e zero erros de página; `engines`, lockfile e validação de contagem adicionados.
- 2026-10-27: validação de instalação e comportamento concluída: `npm ci` instalou 27 pacotes (0 vulnerabilidades); `npm test` passou 13/13 com Puppeteer local e zero erros de página; `npm run test:syntax` passou; `git diff --check`, whitespace dos novos arquivos e backups aprovados; nenhum stage ou commit. O `postinstall` do Puppeteer ficou pendente por política do npm e o navegador veio do cache local.

## Resultados adicionais da preparação — 2026-10-27
- Git inicializado; baseline registrado no commit `f9240a9` (`chore: establish Guilda project baseline`). O commit inclui o jogo, os dois backups e os documentos de coordenação.
- Após o commit, foram observadas alterações de trabalho em `Guilda dos Aventureiros.html` e `PLANO_MESTRE.md`, além de um teste temporário `insurance-test.cjs`. Não foram descartadas nem incluídas no commit inicial; precisam ser revisadas como alterações de trabalho.
- O teste automatizado de falha com seguro foi executado e retornou `PASS`: aventureiro sobreviveu, seguro foi consumido, recursos/resultados esperados e zero erros de página. O arquivo temporário do teste não estava mais presente na inspeção seguinte; recuperar ou recriar a suíte de forma estável antes de depender dela.
- A instalação global `opencode` aponta para a versão 1.19.4 e falha ao consultar provedores por incompatibilidade de esquema do banco (`Database is not empty and has no session table`). O banco foi inspecionado em modo somente leitura: `PRAGMA integrity_check` retornou `ok` e há tabelas `session_v2`; nenhum dado foi apagado ou alterado.
- A instalação do OpenCode Desktop contém CLI versão 2.1.3 em `%APPDATA%\ai.opencode.desktop\cli\2.1.3-x64\opencode-cli.exe`; essa CLI lista modelos `opencode/*-free`, mas `auth list` informa que não há integrações autenticadas. Preferir esta CLI à instalação global antiga, sem corrigir ou apagar o banco da versão antiga por enquanto.
- A chamada de diagnóstico somente leitura via `opencode-cli run --model opencode/beam-free` foi repetida em 2026-10-27 e validada: respondeu `OK` e, em seguida, leu os quatro documentos e resumiu a próxima tarefa em 13,7 s; a execução real do agente está validada para modelos free.

## Próximas ações atualizadas — 2026-11-01
1. Extrair `JourneyService` para módulo sem DOM e cobrir despacho, conclusão, sucesso, falha, seguro, perda e campanha com RNG/relógio controlados.
2. Extrair `PersistenceService` somente após definir testes de compatibilidade para `guildaSave` v2 e migração legada.
3. Manter os 7 testes de domínio, 9 testes de `GuildService` e 13 cenários de regressão como rede de segurança.

## Diagnóstico de continuidade — 2026-10-27 (histórico)
> Registro da tarefa anterior. A suíte persistente foi concluída em 2026-10-27; ver a seção "Suíte de testes persistente — 2026-10-27".

### Estado do projeto e do Git
- Repositório Git presente em `master`, HEAD `7353b25` (`docs: record agent workflow preparation`); a raiz contém o HTML, os dois backups, os quatro documentos e `.git`.
- Alterações de trabalho preservadas e não commitadas: `Guilda dos Aventureiros.html` (rejeição de IDs duplicados entre roster e taverna no carregamento) e `PLANO_MESTRE.md` (registro dos testes de seguro/IDs duplicados e próximos passos). Nada em stage (`git diff --cached` vazio). Nenhum backup foi alterado ou removido por esta tarefa.
- `AGENTS.md`, `ARQUITETURA.md` e `PROGRESSO.md` estavam sem alterações locais antes deste diagnóstico.

### CLI e autenticação
- `opencode --version` global: 1.19.4. `opencode providers list` falha com `Database is not empty and has no session table`; o banco não foi alterado.
- CLI do Desktop: `%APPDATA%\ai.opencode.desktop\cli\2.1.3-x64\opencode-cli.exe`, versão 2.1.3.
- `auth list`: "No authenticated integrations". Modelos disponíveis: `opencode/beam-free`, `opencode/deepseek-v4.1-flash-free` e outros `opencode/*-free`.
- `run --model opencode/beam-free` respondeu `OK` em 1,3 s sem `--standalone` e em 3,5 s com `--standalone`. A tarefa somente leitura leu `AGENTS.md`, `PLANO_MESTRE.md`, `ARQUITETURA.md` e `PROGRESSO.md` e resumiu a próxima tarefa/critérios em 13,7 s, com código de saída 0. Nenhum token ou credencial foi exposto.
- Conclusão: o fluxo via CLI do Desktop funciona com modelos free sem autenticação; não há integração autenticada de provedor pago. A instalação global antiga permanece evitada.

### Testes e validações
- Não existe `package.json`, `node_modules`, diretório de testes nem arquivos de teste versionados no projeto. Os testes `domain-test.cjs` e `insurance-test.cjs` citados no histórico não estão presentes; os resultados históricos não eram reproduzíveis.
- Sintaxe: JavaScript embutido extraído para `%LOCALAPPDATA%\Temp\opencode\guilda-inline-check.js`; `node --check` retornou 0.
- Harness temporário: `%LOCALAPPDATA%\Temp\opencode\guilda-baseline-tests.cjs`, usando Puppeteer 25.16.0 do cache do npx e o navegador gerenciado pelo Puppeteer, sem instalar dependências. Resultado: 13/13 verificações aprovadas, zero erros de página.
- Cobertura reproduzida: carregamento inicial e formato v2; persistência de jornada; conclusão/recompensa de missão comum; falha com seguro (seguro consumido, aventureiro preservado); falha sem seguro (aventureiro removido); quatro capítulos da campanha com recompensa e avanço até a vitória; migração de salvamento legado; recuperação de JSON corrompido; rejeição de IDs duplicados entre roster e taverna; fluxo de UI (seleção, despacho, contratação, seguro e melhoria do salão).
- Limitações: os cenários usam dados sintéticos e RNG controlado; a conclusão de missão foi testada com timestamps no passado, não com espera real de 15 s; o harness está fora do projeto e não é uma suíte persistente. Não foi testada uma sessão longa, nem o equilíbrio econômico.

### Arquivos alterados nesta tarefa
- `PROGRESSO.md`: registro do diagnóstico, resultados, limitações e próxima tarefa.
- `PLANO_MESTRE.md`: correção do registro sobre Git, status do baseline, cobertura de campanha/perda sem seguro e próxima ação.
- `Guilda dos Aventureiros.html`: não alterado nesta tarefa; as alterações locais preexistentes foram preservadas.

### Próxima tarefa recomendada
- Consolidar a suíte persistente e versionada usando o harness validado, com escopo em `tests/` (ou `test/`), `package.json` e script `npm test`; depois revisar/commitar as alterações locais e iniciar a extração de `Adventurer`/`PersistenceService`.
- Critérios de conclusão: suíte executa com um comando, cobre os 13 cenários, passa sem erros de página e está versionada; o diff local é revisado e commitado; nenhum backup é alterado.
- Dependência do usuário: nenhuma para os modelos free; se for necessário usar provedor pago, o usuário precisará autenticar a integração manualmente.

## Suíte de testes persistente — 2026-10-27
- Estrutura: `package.json` (scripts e `engines.node`), `package-lock.json`, `.gitignore`, `tests/check-syntax.cjs`, `tests/guilda-regression.cjs` e `tests/README.md`.
- Comando único: `npm test`. Ele executa a verificação sintática do JavaScript inline e os 13 cenários de regressão.
- Resultado real após a extração de `Adventurer`/`PersistenceService` e após `npm ci`: 13/13 cenários aprovados, `expected: 13`, 0 erros de página; `npm run test:syntax` aprovado. A execução usou o Puppeteer local em `node_modules`.
- Cobertura: carregamento inicial/v2; missão comum; falha com seguro; falha sem seguro; jornada em andamento; quatro capítulos da campanha; migração legada; JSON corrompido; IDs duplicados; fluxo de UI.
- O runner exige exatamente 13 cenários e inclui `expected: 13` no resumo. Se a quantidade mudar sem atualizar `EXPECTED_SCENARIOS` no runner, a execução falha mesmo que os cenários restantes passem.
- A suíte usa Puppeteer 25.16.0 como dependência apenas de desenvolvimento. `npm ci` foi validado a partir do lockfile; o runner resolve somente a dependência local e não usa cache global do `npx`.
- A suíte não altera o HTML. Nesta etapa, o HTML foi alterado para a extração das classes; o comportamento observável e o formato `guildaSave` v2 foram preservados, com 13/13 cenários aprovados.
- Backups intactos; nenhum commit criado.
- Limitações: salvamentos sintéticos, RNG controlado, sem espera real de 15 s, sem sessão longa e sem auditoria de equilíbrio. As classes ainda estão dentro da IIFE e não há testes unitários de domínio sem DOM. O `postinstall` do Puppeteer ficou pendente por política do npm; o navegador usado veio do cache local.
- Próxima tarefa: revisar/commitar as alterações locais quando autorizado; depois continuar a Fase 2 com estado/serviço da Guilda e jornadas.

## Correções de infraestrutura e documentação — 2026-10-28
- `package.json` declara `engines.node` `>=22.12.0`, compatível com Puppeteer 25.16.0.
- `package-lock.json` gerado/atualizado com `npm install`; instalação informou "up to date", 28 pacotes auditados, 0 vulnerabilidades. O `postinstall` do Puppeteer ficou pendente por política de `install-scripts`; o navegador compatível veio do cache local. Sem lockfile, a instalação não é totalmente reproduzível.
- `tests/guilda-regression.cjs` não procura mais o Puppeteer no cache global do `npx`; resolve somente a dependência local e falha com instrução de `npm install` quando ela estiver ausente. A suíte falha se a quantidade de cenários não for exatamente 13, captura falha individual por cenário e tenta executar os restantes, retornando código diferente de zero se algum falhar. Esperas fixas frágeis foram substituídas por `waitForSelector`/`waitForFunction` quando viável.
- `tests/README.md` declara Node.js `>=22.12.0`, explica que `npm install` baixa o navegador compatível do Puppeteer, documenta `npm ci` quando há lockfile e evita chamar instalação sem lockfile de totalmente reproduzível.
- Documentação corrigida: a correção preexistente de IDs duplicados foi preservada (não criada nesta tarefa); a conclusão de missão usa timestamps no passado e não mede espera real de 15 s; os quatro capítulos são cobertos em salvamentos/cenários independentes, não em sessão contínua; `git diff --check` não verifica arquivos não rastreados, então a validação do conjunto staged será registrada apenas quando houver stage futuro.
- `ARQUITETURA.md` atualizado para coerência (sem fallback de cache global; runner local; limitações de teste).
- Validações executadas: `npm install` (up to date; 0 vulnerabilidades), `npm test` (13/13 cenários, `expected: 13`, 0 erros de página), `npm run test:syntax` (OK, 1 script), `node --check` em `tests/guilda-regression.cjs` e `tests/check-syntax.cjs` (OK), `git diff --check` (exit 0, apenas avisos de LF/CRLF preexistentes). Backups intactos; HTML do jogo não foi alterado nesta tarefa; nenhum stage ou commit criado.
- Limitações: o `postinstall` do Puppeteer não foi executado por política do npm; o navegador veio do cache local. Em uma máquina sem cache, será necessário aprovar/executar o script ou instalar o navegador antes de testar. A suíte continua de integração, com timestamps no passado e cenários independentes.


## Auditoria de continuidade — 2026-10-29
- [x] Confirmar o dispositivo remoto, a estrutura real da raiz e os arquivos existentes em `Planejamento/` (sem subpastas adicionais).
- [x] Ler `AGENTS.md`, `PLANO_MESTRE.md`, `ARQUITETURA.md`, este progresso, `package.json` e a documentação dos testes.
- [x] Verificar Git: HEAD `7353b25`, sem alterações staged; HTML modificado; documentos de coordenação removidos da raiz e presentes como arquivos não rastreados em `Planejamento/`; `.gitignore`, pacote, lockfile e `tests/` também não rastreados. Nenhuma alteração local foi descartada.
- [x] Executar `npm test`: sintaxe aprovada, 13/13 cenários aprovados, 0 erros de página.
- [x] Revisar o diff do HTML: extração incremental de `Adventurer` e `PersistenceService`, mantendo `guildaSave` v2; sem evidência de regressão nos cenários cobertos.
- Limite desta etapa: a suíte cobre integração com navegador, não testes unitários puros, sessões longas ou equilíbrio econômico.
- Atenção: a localização dos documentos de coordenação difere do estado rastreado no Git. Os arquivos atuais em `Planejamento/` contêm atualizações e não foram movidos, sobrescritos nem removidos nesta auditoria; a intenção dessa reorganização deve ser esclarecida antes de consolidar a estrutura canônica.
- Nenhum código, backup, configuração ou salvamento do jogo foi alterado nesta auditoria. Nenhum commit foi criado.
- Próxima ação: resolver a revisão/consolidação do diff e da localização documental; não iniciar a próxima refatoração nem criar commit enquanto a etapa anterior não estiver autorizada/consolidada.


## Consolidação do fluxo de trabalho — 2026-10-29
- [x] Incorporada em `Planejamento/AGENTS.md` a diretriz de autonomia, entregas agrupadas, PWA progressiva, preservação da identidade visual, testes com evidências, preservação de alterações/backups e relatórios objetivos.
- [x] Reconfirmado o estado Git antes de avançar: HEAD `7353b25`, sem alterações staged; HTML modificado e documentos de coordenação ausentes da raiz do working tree, com versões atualizadas em `Planejamento/`. Nenhuma alteração local foi descartada e nenhum commit foi criado.
- Revisão do diff: as alterações do HTML incluem extração incremental de `Adventurer` e `PersistenceService`; a suíte anterior cobre 13 cenários, mas não cobre testes unitários puros, sessões longas ou equilíbrio econômico.
- O caminho canônico dos documentos continua pendente: restaurar/mover os arquivos da raiz automaticamente poderia sobrescrever ou duplicar versões locais. Manter ambas as cópias intactas até reconciliar conteúdo e histórico do Git.
- Teste de execução do OpenCode via CLI 2.1.3, usando o modelo `opencode/beam-free`, iniciou mas ainda não retornou saída nesta sessão. Não considerar o teste aprovado; consultar novamente ou diagnosticar autenticação/conectividade antes de delegar mudanças ao agente.
- Próximo trabalho seguro: executar novamente a suíte e inspecionar o diff completo; reconciliar os documentos sem perda de conteúdo; então iniciar a extração do serviço/estado da Guilda e do serviço de jornadas com testes incrementais. Não criar commit sem autorização.


## Retomada e reconciliação documental — 2026-10-29
- [x] Comparadas as versões atuais dos quatro documentos em `Planejamento/` com as versões rastreadas em `HEAD`; são versões atualizadas e não idênticas ao histórico.
- [x] Reconstituídas as cópias canônicas na raiz (`AGENTS.md`, `PLANO_MESTRE.md`, `ARQUITETURA.md`, `PROGRESSO.md`) copiando as versões atuais de `Planejamento/`. As fontes em `Planejamento/` foram preservadas, sem exclusão nem sobrescrita.
- [x] OpenCode CLI 2.1.3 responde ao comando `auth list`, mas informa `No authenticated integrations`. A chamada `run` anterior não retornou saída; agente ainda não utilizável confirmado, provavelmente requer autenticação/configuração. Não serão iniciadas novas chamadas concorrentes sem resolver isso.
- [x] `npm test` reexecutado após a etapa documental: sintaxe aprovada, 13/13 cenários, 0 falhas, 0 erros de página. `git diff --check` exit 0, com aviso LF/CRLF.
- Próxima etapa: extrair as regras de despacho e resolução de jornadas para um serviço dedicado no HTML, mantendo wrappers existentes, a interface e o formato `guildaSave` v2; executar toda a suíte e atualizar arquitetura/progresso/relatório.


## Extração do serviço de jornadas — 2026-10-29
- [x] Restauradas as cópias canônicas dos quatro documentos de coordenação na raiz, copiando as versões atualizadas de `Planejamento/`; os arquivos de `Planejamento/` foram mantidos intactos. `AGENTS.md` esclarece que a raiz é a fonte de verdade e que as cópias devem ser reconciliadas antes de eventual arquivamento.
- [x] Implementada a classe `JourneyService` dentro de `Guilda dos Aventureiros.html`. O serviço concentra despacho e resolução de jornadas, recompensas, riscos, consumo de seguro, perda de aventureiros, avanço da campanha e persistência.
- [x] Injetadas dependências para estado, persistência, renderização, log, multiplicador, relógio e aleatoriedade. Os wrappers `dispatch()` e `resolveMission()` preservam os pontos de chamada existentes; relógio e RNG são substituíveis para facilitar testes futuros.
- [x] `npm test`: 13/13 cenários aprovados, 0 falhas, 0 erros de página. `git diff --check`: exit 0; apenas avisos de conversão LF/CRLF.
- [x] Atualizados `ARQUITETURA.md` e `PLANO_MESTRE.md` para registrar `JourneyService` como implementado e manter o serviço/estado da Guilda como próxima extração.
- Limitação: o serviço ainda reside no HTML/IIFE e é testado por integração; testes unitários isolados de domínio continuam pendentes. O OpenCode CLI 2.1.3 responde a `auth list` com `No authenticated integrations`; não delegar execução até autenticação/configuração ser resolvida.
- Próxima etapa: extrair um modelo/serviço de estado da Guilda em escopo controlado, aumentar testes de domínio isolados e continuar preservando `guildaSave` v2, execução local e identidade visual.


## Extração do módulo de domínio — 2026-10-29
- [x] Reexecutado `npm test` antes de alterar o código: sintaxe aprovada, 13/13 cenários de regressão, 0 erros de página.
- [x] Extraídas `Adventurer`, `Mission`, `CampaignMission` e os catálogos para `guilda-domain.js`, compartilhado entre navegador e Node.js sem dependências externas de runtime.
- [x] Atualizado o HTML para carregar o módulo local, mantendo `PersistenceService`, `JourneyService`, UI e estado dentro da IIFE.
- [x] Adicionados 7 testes unitários puros em `tests/domain-unit.cjs`; o comando `npm test` executa sintaxe, domínio e regressão.
- [x] Resultado real: sintaxe do módulo e script inline OK; 7/7 testes de domínio; 13/13 cenários de regressão; 0 falhas; 0 erros de página; exit code 0.
- [x] Atualizados `ARQUITETURA.md`, `PLANO_MESTRE.md`, `tests/README.md` e `RELATORIO_ETAPA.md`.
- [x] `git diff --check` exit 0; `package.json` e `package-lock.json` válidos. Avisos LF/CRLF são de normalização do Git.
- Backups e salvamentos preservados; nenhum commit criado. O HTML agora requer `guilda-domain.js` ao lado para execução local.
- Limitações: `PersistenceService`, `JourneyService`, estado e UI ainda estão no HTML; sem testes unitários isolados de jornadas, sessão longa ou equilíbrio econômico.

## Próxima ação
Extrair o estado/serviço da Guilda em escopo controlado para recursos, elenco, taverna, seleção e progressão; depois separar e testar as regras de `JourneyService` sem DOM. Preservar `guildaSave` v2, manter os 13 cenários de regressão e não criar commit sem autorização.


## Extração do serviço da Guilda — 2026-11-01
- [x] Criado `GuildService` em `guilda-domain.js`, sem dependência de DOM, localStorage ou UI.
- [x] Centralizadas as fórmulas de multiplicador, limite de grupo/roster e custo do salão; geração de aventureiros e renovação da taverna; seleção, seguro, contratação, melhoria e prestígio.
- [x] Integrada a UI por wrappers: mensagens, salvamento e renderização continuam na camada de apresentação.
- [x] Criados 9 testes unitários determinísticos em `tests/guild-service-unit.cjs` e adicionados ao `npm test`.
- [x] Validação: sintaxe OK; 7/7 testes de domínio; 9/9 testes de GuildService; 13/13 cenários de regressão; zero erros de página; `npm test` exit code 0.
- [x] `guildaSave` v2 e seus campos não foram alterados; não foram modificados backups ou saves do usuário.
- Git permanece em HEAD `7353b25`; alterações locais anteriores e novas permanecem sem stage; nenhum commit criado.
- OpenCode Desktop CLI v2.1.3 foi tentado com `opencode/beam-free`, mas não produziu saída nem progresso observável nesta execução e precisou ser encerrado. A implementação e as verificações foram feitas via Remote Commander; não houve alteração pelo OpenCode.
- Próxima ação: extrair `JourneyService` para módulo testável sem DOM, com RNG/relógio controlados; depois avaliar extração de `PersistenceService` sem alterar `guildaSave` v2.


## Extração do JourneyService — 2026-11-01
- [x] Extraído `JourneyService` para `guilda-journey.js`, módulo UMD/CommonJS sem dependência de DOM.
- [x] Injetados estado, callbacks de save/render/log, multiplicador, catálogo de campanha, RNG e relógio.
- [x] Mantidos wrappers de interface `dispatch()` e `resolveMission()`; o HTML carrega o novo módulo local ao lado de `guilda-domain.js`.
- [x] Criados 8 testes unitários determinísticos em `tests/journey-service-unit.cjs`; adicionados ao `npm test` e ao verificador de sintaxe.
- [x] Resultado de `npm test`: sintaxe OK; 7/7 testes de domínio; 9/9 de GuildService; 8/8 de JourneyService; 13/13 regressões; zero erros de página; exit code 0.
- [x] Compatibilidade `guildaSave` v2 confirmada pela suíte de integração; sem alteração de chave, versão ou campos persistidos.
- [x] Nenhum backup/save alterado; nenhum commit, reset ou stage. HEAD continua `7353b25`; mudanças anteriores preservadas.
- Próxima tarefa: extrair `PersistenceService` com cobertura unitária para migração, validação, corrupção e falhas de armazenamento, mantendo v2.


## Extração do PersistenceService — 2026-11-01
- [x] Extraída a classe para `guilda-persistence.js`, módulo UMD/CommonJS sem dependência de DOM.
- [x] Dependências `Adventurer`, `MISSIONS`, `CAMPAIGN` e storage são injetadas; o padrão continua usando `localStorage` no navegador.
- [x] Mantidos `load(target)`/`save(source)`, wrappers da UI, chave `guildaSave`, versão 2, campos serializados, validação, migração legada, reconstrução de jornadas e tratamento de erros.
- [x] HTML atualizado para carregar o novo módulo; removida a implementação de persistência da IIFE sem alterar os pontos de chamada.
- [x] Criados 11 testes unitários sem DOM: ausência de save, formato v2, round-trip, migração legada, jornadas comuns e de campanha, IDs duplicados, jornadas/seleção inválidas, normalização numérica, JSON corrompido e falhas de storage.
- Resultado final real: `npm test` exit code 0; sintaxe dos três módulos e script inline OK; 7/7 domínio + 9/9 GuildService + 8/8 JourneyService + 11/11 PersistenceService + 13/13 regressões; zero falhas e zero erros de página.
- Próxima ação: separar gradualmente a orquestração restante da UI, depois avaliar balanceamento como tarefa de produto separada.
## Auditoria econômica e de progressão — 2026-11-01
- [x] Simular 20.000 gerações determinísticas com seed fixa e conferir pesos de raridade, poder e custo médios.
- [x] Simular os melhores grupos disponíveis em três estágios: nível 1 (4 candidatos, grupo 2), nível 4 (11 candidatos, grupo 5) e nível 4 com 3 pergaminhos.
- [x] Calcular sucesso esperado, perdas esperadas por tentativa, ouro bruto por minuto e retorno ajustado pelo custo esperado de reposição.
- [x] Adicionar `tests/economy-balance.cjs` (7 verificações) ao `npm test` e documentar o baseline reproduzível.
- Resultado: pesos observados 54,75% comum, 27,96% raro, 13,19% épico e 4,09% lendário; poder médio 14,23; custo médio inicial 118,41.
- Campanha com melhor grupo inicial de 2: sucesso estimado 92,9%, 66,2%, 43,7% e 31,3% nas etapas I-IV; perdas esperadas por tentativa 0,035, 0,271, 0,563 e 0,893.
- Nível 4, melhor grupo de 5 entre 11: etapa IV 66,8% de sucesso e 1,08 perdas esperadas; com 3 pergaminhos, 85,9% e 0,458 perdas esperadas.
- Torre Amaldiçoada, grupo de 5 no nível 4: 303,5 ouro bruto/min e 283,7 ouro/min após custo esperado de reposição; 0,241 perdas esperadas por tentativa.
- Risco econômico identificado: atualização gratuita de 4 candidatos tem 15,07% de chance de ao menos um lendário por clique e 80,5% após 10 cliques. Sem custo ou cooldown, rerrolar repetidamente remove a escassez prática de raridades.
- Nenhuma fórmula ou regra de jogo foi alterada nesta auditoria. Ajuste de custo/cooldown da taverna fica como decisão de balanceamento, pois a interface declara a atualização gratuita.


## Piloto visual do Guerreiro no SpriteGen — 2026-11-02
- [x] Criar conceito original de Guerreiro robusto, com armadura pesada e espada de duas mãos, usando o plano gratuito do SpriteGen.
- [x] Gerar spritesheet de repouso em 16 bits, vista lateral, 8 quadros, células de 128 × 128 px.
- [x] Inspecionar o PNG de repouso enviado: 1024 × 128 px, RGBA, transparência real, 8 quadros; alinhamento inferior dos quadros consistente.
- [x] Gerar também uma ação de ataque no SpriteGen, conforme relato do usuário. A identidade foi preservada em grande parte, com pequenas variações percebidas de escala e tonalidade da pele.
- [x] Registrar o limite de uso gratuito atingido; nenhuma compra ou assinatura autorizada ou realizada.
- Decisão: aprovar a direção visual do Guerreiro como conceito em desenvolvimento, mas não integrar animações ao jogo antes de inspecionar o PNG de ataque e produzir/validar a caminhada. A spritesheet pública usada anteriormente permanece somente como referência técnica de formato e qualidade, não como base visual derivada.
- Próximos passos: preservar localmente os PNGs originais e prompts; inspecionar o ataque quando o arquivo for disponibilizado; após renovação gratuita ou autorização explícita de créditos, gerar caminhada com referência de personagem e bloqueio de identidade; validar escala, paleta, ponto de apoio, continuidade e transparência entre ações.
- Nenhum código do jogo ou salvamento foi alterado nesta frente.


## Auditoria dos sprites do Guerreiro — 2026-11-02
- Arquivos encontrados em `NPC/Guerreiro/`: `Guerreiro, ocioso.png`, `Guerreiro, ataque.png` e `Guerreiro, morrendo.png`.
- Os três arquivos foram abertos e inspecionados diretamente pelo Desktop. Todos medem 1024 × 128 px, organizados em 8 células de 128 × 128 px.
- Todos possuem canal alfa RGBA com transparência real; a inspeção pixel a pixel encontrou 0 pixels com alfa parcial (transparência binária).
- Os três ciclos compartilham a mesma linha de base: o último pixel opaco de cada quadro está na linha 114. Isso é favorável à ancoragem comum no jogo.
- Repouso: os limites do personagem variam verticalmente entre os quadros (altura opaca de 90 a 106 px), compatível com oscilação/respiração; largura estável em 59 px. Revisar visualmente o ritmo do loop, pois os quadros finais têm pouca variação.
- Ataque: sequência visual legível com preparação, golpe e retorno; o personagem/arma mudam de pose e ocupação do quadro, como esperado. As caixas opacas variam de 50×76 a 105×63 px, sem sair da célula.
- Morte: progressão visual clara de postura ereta para ajoelhada e queda ao chão; a caixa opaca varia de 54×103 a 105×37 px. O quadro final mantém a base na linha 114.
- Avaliação: repouso, ataque e morte estão tecnicamente compatíveis em resolução, grade, transparência e linha de base. Ainda falta validar velocidade de reprodução e continuidade em engine; não há caminhada nesta pasta. A pequena variação de escala/pele entre ações relatada pelo usuário merece revisão comparativa ampliada antes da integração.
- Nenhum arquivo de arte ou código do jogo foi alterado nesta auditoria.

## Protótipo isolado das animações do Guerreiro — 2026-11-02
- [x] Confirmar os três PNGs originais em `NPC\Guerreiro`: ocioso, ataque e morte; todos 1024×128, 8 quadros de 128×128.
- [x] Criar `NPC\Guerreiro\preview.html`, laboratório local independente do jogo, com seleção das três animações, velocidade ajustável (2–16 quadros/s), pausa e reinício.
- [x] Definir repouso em loop; ataque e morte executam uma vez e mantêm o último quadro. A prévia respeita `prefers-reduced-motion` ao iniciar pausada quando a preferência está ativa.
- [x] Validar no Chromium/Puppeteer: as três folhas carregam; ataque e morte chegam ao quadro 8; pausa e ajuste para 12 quadros/s funcionam; zero erros de página/console.
- [x] Executar `npm test`: sintaxe OK; 7 domínio + 9 GuildService + 8 JourneyService + 6 GameLoop + 7 baseline econômico + 11 PersistenceService; 13/13 regressões; 0 erros de página; exit code 0.
- Escopo: somente novo arquivo `NPC\Guerreiro\preview.html` e documentação. Nenhum PNG foi modificado; HTML principal, regras, persistência e salvamentos não foram tocados. Nenhuma integração definitiva foi feita.
- Limitação: a validação automatizada confirma carregamento e controles, mas a avaliação estética de ritmo, sensação do golpe e continuidade visual ainda depende de observação humana. Não há animação de caminhada.
- Próxima ação: avaliar visualmente o protótipo e ajustar timing/escala se necessário; só depois planejar a integração no jogo.

## Avaliação visual inicial do Guerreiro — 2026-11-02
- Feedback recebido: velocidade preferida de 6 quadros por segundo; no repouso, a variação de tamanho entre quadros chama um pouco a atenção, mas não prejudica a leitura/animação.
- Ajustada a velocidade padrão da prévia para 6 quadros/s (mantidos controles manuais de 2 a 16). A variação de escala do repouso foi mantida: é parte da respiração/pose e foi considerada aceitável pelo usuário; não aplicar compensação artificial neste momento.
- Próximo: avançar para avaliação comparativa das animações e planejar caminhada; integração definitiva continua condicionada a essa etapa.


## Direção de arte e uso de IA local — 2026-11-02
- Decisão: a Guilda é o foco central da experiência; aventureiros são o coração visual/emocional, com destaque contextual (sede, recrutamento/gerenciamento e missões), sem transformar o jogo em RPG de controle direto de um único herói.
- Os spritesheets atuais do Guerreiro (`Guerreiro, ocioso/ataque/morrendo.png`) permanecem como referência canônica de personagem. Não substituir nem alterar os originais com base em uma geração isolada.
- `ComfyUI-Teste-01.png` é um experimento de direção visual, não um asset aprovado: a imagem tem acabamento de fantasia medieval interessante, mas altera a identidade do Guerreiro e não atende aos requisitos de sprite animado consistente.
- Direcionar as próximas experiências locais do ComfyUI prioritariamente a cenários/ambientes e elementos estáticos, nos quais não há exigência de identidade de personagem entre quadros. Retratos/ilustrações podem ser aproveitados apenas quando coerentes com a arte do jogo e com função clara.
- Critérios antes de integrar qualquer asset: coerência com a interface e os sprites existentes, legibilidade na escala real, enquadramento/recorte adequados, transparência quando necessária, desempenho e finalidade concreta no gameplay. Manter geração local gratuita; sem serviços pagos, APIs ou credenciais.
- Próximo experimento recomendado: conceito de ambiente da sede da Guilda, sem personagens, para avaliar se o ComfyUI acrescenta valor visual sem descaracterizar a interface atual. A imagem deverá permanecer isolada até avaliação; não alterar gameplay nem saves.


## Consolidação da documentação — 2026-11-02
- [x] Inspecionada a raiz e toda a pasta `Planejamento/` (listagem recursiva até cinco níveis); havia somente quatro arquivos diretamente na pasta e nenhuma subpasta adicional.
- [x] Comparadas as versões de `AGENTS.md`, `PLANO_MESTRE.md`, `ARQUITETURA.md` e `PROGRESSO.md` de `Planejamento/` com os documentos canônicos da raiz.
- [x] Confirmado que as cópias de `Planejamento/` eram snapshots de 2026-10-27 e estavam desatualizadas em relação às implementações e decisões registradas na raiz até 2026-11-02.
- [x] Movidos os quatro snapshots, sem editar ou excluir seu conteúdo, para `Planejamento/Arquivo/2026-10-27/`.
- [x] Criado `Planejamento/README.md` como índice, explicando fonte de verdade, arquivo histórico e regras para novos materiais.
- [x] Reforçada nos documentos da raiz a regra de fonte canônica e a separação entre referências, plano, arquitetura e progresso.
- Nenhum código, teste, backup de jogo ou salvamento foi alterado nesta reorganização.
- Validação documental: confirmar listagem final, ler o índice e os documentos atualizados; executar `git diff --check`.
- Próxima ação de produto: retomar a prioridade ativa do plano mestre, sem reabrir a reconciliação dos snapshots históricos.


## Centralização do planejamento e limpeza da raiz — 2026-11-02
- [x] Corrigida a organização para que `Planejamento/` seja o ponto central e a fonte oficial de documentação do projeto.
- [x] Movidos `AGENTS.md`, `PLANO_MESTRE.md`, `ARQUITETURA.md`, `PROGRESSO.md` e `RELATORIO_ETAPA.md` da raiz para `Planejamento/`.
- [x] Mantido na raiz um `AGENTS.md` curto que encaminha ferramentas e agentes para os documentos oficiais em `Planejamento/`.
- [x] Atualizado `Planejamento/README.md` para explicar a estrutura central e o conteúdo esperado.
- [x] Movidos quatro backups HTML da raiz e dois backups de regressão de `tests/` para `Planejamento/Arquivo/Backups/`, sem exclusão ou alteração de conteúdo.
- [x] Preservados os quatro snapshots documentais de 2026-10-27 em `Planejamento/Arquivo/2026-10-27/`.
- [ ] Executar `npm test` após a movimentação dos backups e validar a estrutura final e `git diff --check`.
- A raiz deve conter o jogo, módulos de runtime, assets, ferramentas de teste, dependências e configurações; a documentação oficial fica em `Planejamento/`.


### Verificação final da centralização — 2026-11-02
- [x] Suíte completa `npm test`: exit code 0; sintaxe dos quatro módulos e script inline OK; 7 domínio + 9 GuildService + 8 JourneyService + 6 GameLoop + 7 baseline econômico + 11 PersistenceService; 13/13 cenários Puppeteer; 0 falhas e 0 erros de página.
- [x] Estrutura conferida: na raiz restaram apenas `AGENTS.md` de encaminhamento, jogo, módulos, assets, testes, dependências e configurações; os cinco documentos oficiais e o índice estão em `Planejamento/`.
- [x] Os seis backups movidos estão presentes em `Planejamento/Arquivo/Backups/`; quatro snapshots antigos estão em `Planejamento/Arquivo/2026-10-27/`.
- [x] `git diff --check` exit code 0; avisos restantes referem-se apenas à normalização LF/CRLF.
- Nenhuma alteração de código ou save foi feita nesta reorganização. Sem stage, commit ou reset.


## Experimento de cenário da sede no ComfyUI — 2026-11-02
- [x] Confirmado ComfyUI local 0.43.2, SD 1.5, RTX 3050 4 GB VRAM e 8 GB RAM.
- [x] Geradas quatro imagens 640×384, com seeds e parâmetros registrados; copiadas para `NPC/Sede/` sem alterar assets de personagens.
- [x] Criada prévia A/B isolada comparando UI atual e cabeçalho com ambiente gerado.
- [x] Verificação Puppeteer: PNG 640×384 carregado; mobile 390 px sem rolagem horizontal; zero erros de página.
- [x] Avaliação: imagens não comunicam de forma confiável a sede da guilda; modelo gera salão de restaurante/recepção e pseudo-textos. O banner cria atmosfera, mas ainda não justifica integração.
- [x] Decisão: não integrar nenhum PNG ao jogo principal; manter tudo como experimento.
- [x] Documentados prompts, seeds, parâmetros, observações e critérios em `Arte/Sede/EXPERIMENTO_COMFYUI.md`.
- Próxima ação visual: mudar abordagem para 2D estilizado com referências próprias e composição funcional clara, ou testar fundo parcial discreto. Não repetir apenas mudanças cosméticas de prompt.


## Direção de cenário explorável — 2026-11-02
- [x] Consolidada direção visual a partir da referência 2D isométrica indicada pelo usuário: sede explorável, câmera 3/4 elevada, piso visível e paredes no perímetro.
- [x] Definido layout funcional: mural de contratos à esquerda, recepção à direita, mapa/mesa de expedições ao fundo, estandartes e área central/corredores livres para caminhada.
- [x] Gerada `NPC/Sede/sede_isometrica_layout_v01.png` (768×512): ComfyUI produziu uma folha de peças/colagem isométrica; rejeitada como mapa contínuo.
- [x] Gerada `NPC/Sede/sede_sala_unica_v02.png` (768×512): sala contínua, mas perspectiva frontal/realista e sem funções reconhecíveis; rejeitada.
- [x] Registrados resultados, seeds, parâmetros e critérios em `Planejamento/Arte/Sede/EXPERIMENTO_COMFYUI.md`.
- Nenhum asset ativo, HTML do jogo, mecânica ou save foi alterado.
- Próxima ação: usar referência controlada ou blockout isométrico próprio antes de pedir acabamento à IA. Evitar mais txt2img sem controle de composição.


## Blockout espacial da sede — 2026-11-02
- [x] Criado `NPC/Sede/blockout.html`: sala isométrica vetorial com mural à esquerda, recepção à direita, mesa de planejamento ao fundo, estandartes e piso central livre.
- [x] Marcador de aventureiro movimentável por clique no piso; três pontos funcionais selecionáveis.
- [x] Puppeteer isolado: 3 zonas detectadas, seleção da recepção confirmada, mobile 390 px sem overflow, zero erros; exit code 0.
- [x] Capturas desktop/mobile registradas; critérios e limitações adicionados ao experimento da sede.
- Protótipo é isolado; nenhum código do jogo principal, save ou asset ativo foi alterado.
- Próxima ação: usar o blockout como referência de composição para um acabamento 2D ilustrado e validar rotas/escala dos sprites.

## Direção visual da sede — acabamento guiado por blockout (2026-11-02)
- [x] Exportar o blockout isométrico para PNG e usar como referência img2img no ComfyUI local.
- [x] Primeira geração preservou a disposição geral, mas converteu rótulos em pseudo-inscrições; rejeitada.
- [x] Limpar a referência removendo rótulos e marcador de personagem; segunda geração concluiu sem pseudo-texto.
- Resultado visual: a segunda geração mantém sala, perspectiva e três zonas, mas acrescenta pouco acabamento sobre o desenho vetorial. Nenhuma saída aprovada para integração.
- Decisão: encerrar novas variações com SD 1.5 nesta abordagem. Manter blockout como fonte espacial e avançar manualmente para navegação com colisão e hotspots funcionais; IA local fica para props isolados quando houver ganho claro.
- Arquivos experimentais preservados em NPC/Sede/; nenhuma regra, save, sprite ativo ou HTML principal foi alterado.
- Validação após a rodada: npm test exit code 0; sintaxe OK; 7 domínio + 9 GuildService + 8 JourneyService + 6 GameLoop + 7 baseline econômico + 11 PersistenceService; 13/13 cenários Puppeteer; zero erros de página. git diff --check exit code 0, apenas avisos LF/CRLF.
- Próxima ação concreta: transformar o movimento de clique/teleporte do protótipo em deslocamento com rota e colisões, e ligar as três zonas a estados/ações demonstráveis.

## Sede explorável — navegação, colisões e estações funcionais (2026-11-02)
- [x] Extrair a navegação do protótipo para NPC/Sede/sede-navigation.js, módulo local isolado e testável em Node.js/navegador.
- [x] Implementar busca de caminho A* em grade sobre o piso isométrico, com diagonais sem corte de quina e obstáculos definidos para mural, mesa de planejamento, recepção e lareira.
- [x] Fazer o aventureiro caminhar suavemente ao destino por clique/toque, em vez de teletransportar; rejeitar destinos fora do piso ou sobre mobiliário.
- [x] Adicionar movimentação por setas do teclado e mensagens acessíveis em aria-live.
- [x] Dar finalidade às três estações: clicar conduz o aventureiro à zona de aproximação; Enter ativa a informação/ação demonstrativa de contratos, recepção/recrutamento/gestão ou planejamento. Ainda não são sistemas integrados ao jogo principal.
- [x] Adicionar 15 verificações unitárias para rotas, obstáculos, destinos inválidos e posição inicial.
- [x] Criar verificação Puppeteer do fluxo de clique, chegada, colisão, teclado, aproximação e ativação por Enter dos hotspots, erros de página e viewport mobile.
- Resultado isolado: rota até (600,250) com 12 nós e todos os pontos caminháveis; destino bloqueado e fora do piso rejeitados; personagem chegou ao destino; hotspot de recepção respondeu; mobile 390 px sem overflow; zero erros de página.
- npm test: exit code 0; sintaxe dos quatro módulos do jogo e do novo módulo da sede OK; 7 domínio + 9 GuildService + 8 JourneyService + 6 GameLoop + 7 baseline econômico + 11 PersistenceService + 15 navegação = 63 testes/verificações; 13/13 regressões Puppeteer; 0 erros de página. Total: 76.
- git diff --check: exit code 0; apenas avisos de normalização LF/CRLF em arquivos preexistentes.
- Nenhum arquivo do jogo principal, regra de domínio, save guildaSave v2 ou sprite ativo foi alterado. O protótipo continua isolado em NPC/Sede/.
- Próxima etapa: calibrar colisões com múltiplas posições de origem, aproximar o movimento do sprite real e conectar cada hotspot ao fluxo correspondente em uma integração pequena e testável. Não integrar ainda sem validar responsividade e experiência.

## Apresentação visual das expedições — 2026-11-02
- [x] Criado `guilda-expedition-view.js`, módulo puro que transforma o tempo decorrido da jornada em quatro fases visuais: partida, exploração, objetivo e retorno.
- [x] Definidas três atmosferas reutilizáveis para missões comuns e quatro cenários/identidades para os capítulos da campanha, com marcos narrativos contextuais.
- [x] Integrado painel de expedição ao jogo principal: cenário estilizado em CSS, marco visual, grupo animado, trilha de progresso, acontecimento da fase e percentual.
- [x] A apresentação acompanha os timestamps existentes da jornada; não altera duração, sucesso, RNG, risco, recompensa, campanha ou persistência.
- [x] Respeitada a preferência `prefers-reduced-motion`; layout responsivo sem dependências ou imagens externas.
- [x] Criados 16 testes puros para fases, limites de progresso, cenários comuns/campanha e entradas inválidas; regressão Puppeteer ampliada para verificar painel, atmosfera e fase durante jornada restaurada.
- Validação final: `npm test` — sintaxe de seis módulos locais e script inline; 7 domínio + 9 GuildService + 8 JourneyService + 6 GameLoop + 7 baseline econômico + 11 PersistenceService + 15 navegação da sede + 16 apresentação de expedições = 79 testes/verificações; 13/13 cenários Puppeteer; zero erros de página. `guildaSave` v2 preservado.
- Próxima etapa: aprofundar a apresentação da campanha com eventos de confronto/resultado e transições de conclusão; depois avaliar um ciclo de caminhada consistente para os sprites reais. A integração visual atual usa os avatares já existentes, sem substituir assets.

## Campanha e conclusao visual das expedicoes — 2026-11-02
- [x] Alinhados os quatro cenarios tematicos aos nomes canonicos dos capitulos: As Terras Corrompidas, Fortaleza das Cinzas, O Abismo Rubro e Rei Demonio.
- [x] Adicionados encontros/acontecimentos proprios por capitulo; a fase de objetivo da campanha destaca o confronto e o antagonista/ameaca correspondente.
- [x] Criado resultado visual temporario para sucesso, fracasso, etapa de campanha concluida e vitoria final. A apresentacao dura 10 segundos e nao e gravada no save.
- [x] O resultado e calculado a partir das alteracoes efetivas de recompensa/progresso apos JourneyService; nenhuma regra de sucesso foi duplicada nem alterada.
- [x] Testes de outcome, confronto e regressao de browser adicionados. npm test: 7 dominio + 9 GuildService + 8 JourneyService + 6 GameLoop + 7 baseline + 11 persistencia + 15 navegacao sede + 24 apresentacao de expedicoes = 87 verificacoes; 13/13 cenarios Puppeteer; zero erros de pagina. Total 100.
- [x] git diff --check executado junto com npm test; exit code 0.
- Limitacao: o resultado e uma camada visual simples sobre os avatares atuais; ainda nao ha sprites de caminhada ou sequencias de combate quadro a quadro.


## Sprites de personagem integrados as expedicoes - 2026-11-02
- Criado `guilda-sprite-view.js`, adaptador puro para selecionar a folha de sprites do Guerreiro por contexto. Outras classes continuam usando os avatares existentes.
- O painel de jornadas usa a folha de repouso em deslocamento/exploracao e a folha de ataque durante o objetivo de uma etapa da campanha. A fase de confronto e determinada pelo snapshot ja existente; nao altera duracao, sucesso, RNG, recompensas ou estado persistido.
- As folhas originais de 1024x128 (8 quadros de 128x128) foram preservadas. CSS exibe os quadros em 34x34 com `steps(8)`, atraso derivado do relogio para manter a fase visual apesar das re-renderizacoes de 400 ms, e movimento reduzido desativa a animacao.
- Criado `tests/sprite-view-unit.cjs` com 13 verificacoes; modulo incluido em `tests/check-syntax.cjs` e `npm test`. A regressao de jornada verifica o sprite ativo.
- Evidencia de navegador: `NPC/Guerreiro/confronto-preview.png`; verificacao isolada confirmou classe `npc-sprite--attack`, fase `objective`, encontro contextual e imagem carregada em 1024x128.
- Validacao final: `npm test` exit code 0; 100 verificacoes unitarias/baseline e 13/13 cenarios Puppeteer; 0 erros de pagina.
- Limitacao: caminhada e ataque reais estao integrados apenas para Guerreiro; ainda nao ha sprites de caminhada para as demais classes nem uma folha dedicada de combate para cada classe.


## Validação ampliada da navegação da sede e regressões visuais — 2026-11-03
- [x] Corrigida a consulta do teste de interface inicial para contar tanto avatares CSS quanto spritesheets (.npc-avatar e .npc-sprite), refletindo a implementação visual atual sem alterar o jogo.
- [x] Ampliados os testes puros da navegação da sede: três posições iniciais caminháveis × três estações (contratos, recepção e planejamento).
- [x] Cada rota verifica existência, pontos caminháveis, destino final, continuidade de passos adjacentes e ausência de corte diagonal de quinas.
- [x] Teste unitário da sede: 201 verificações aprovadas (antes: 15).
- [x] Verificador Puppeteer isolado da sede: rota e chegada confirmadas, destino bloqueado recusado, aproximação/ativação da recepção confirmadas, viewport 390 px sem overflow e zero erros.
- [x] Suíte completa npm test: 286 verificações unitárias/baseline aprovadas (7 domínio + 9 GuildService + 8 JourneyService + 6 GameLoop + 7 baseline econômico + 11 PersistenceService + 201 navegação sede + 24 apresentação de expedições + 13 sprites); 13/13 cenários Puppeteer; zero erros de página; exit code 0.
- [x] git diff --check: exit code 0; somente avisos de normalização LF/CRLF em arquivos preexistentes.
- Nenhuma regra de domínio, economia, RNG, duração, campanha ou formato guildaSave v2 foi alterada.
- OpenCode 1.19.5 está instalado, mas sua execução nesta sessão falhou por erro interno do banco local (“Database is not empty and has no session table”). A alteração foi feita diretamente no arquivo de teste via Desktop Commander, sem depender do OpenCode.
- Próxima ação: conectar os hotspots da sede a fluxos reais de contratos, recepção/recrutamento e planejamento em uma camada de integração isolada e testável; manter o blockout fora do HTML principal até validar UX e compatibilidade.


## Feedback visual de perdas em expedições — 2026-11-03
- [x] Ampliado guilda-sprite-view.js para selecionar a spritesheet de morte do Guerreiro, mantendo repouso e ataque.
- [x] Capturadas as identidades da equipe antes da resolução da missão e identificados como perdas somente os aventureiros efetivamente removidos do roster pelo JourneyService.
- [x] O resultado temporário da expedição agora apresenta os aventureiros perdidos; Guerreiros usam a animação de morte de oito quadros e outras classes mantêm representação por ícone.
- [x] A animação de morte é executada uma vez e seu atraso negativo acompanha o tempo decorrido, evitando reinício a cada renderização de 400 ms.
- [x] Movimento reduzido desativa a animação e mantém o quadro final de morte visível.
- [x] Regressão confirma que falha protegida pelo seguro não mostra morte; perda sem seguro mostra nome e spritesheet correta; resultado transitório não é gravado no guildaSave.
- [x] Testes do adaptador de sprites: 19 verificações; regressão Puppeteer: 13/13 cenários, zero erros de página.
- [x] Suíte completa npm test: 292 verificações unitárias/baseline + 13 cenários Puppeteer aprovados; exit code 0.
- Nenhuma regra de risco, seguro, RNG, economia, recompensa, campanha ou formato guildaSave v2 foi alterada.
- Próxima ação: criar adaptador de integração dos hotspots da sede para contratos, recepção/recrutamento e planejamento, mantendo navegação e domínio desacoplados.


## Preparação para GitHub e Vercel — 2026-11-03
- [x] Confirmar a aplicação atual como site estático, com HTML principal, módulos locais e sprites referenciados por caminhos relativos.
- [x] Ampliar .gitignore para dependências, cache da Vercel, saídas de testes, logs e arquivos de ambiente/segredos; manter exceções para arquivos .env.example.
- [x] Adicionar vercel.json com rewrite da rota raiz para Guilda dos Aventureiros.html, sem duplicar o HTML do jogo nem alterar os caminhos dos assets.
- [x] Adicionar workflow GitHub Actions para Node.js 22.12.0, npm ci e npm test em pushes e pull requests.
- [x] Criar README de entrada com execução local, testes, parâmetros de publicação e limites atuais de persistência.
- [x] Executar npm test localmente antes da preparação: 292 verificações unitárias/baseline e 13/13 cenários Puppeteer aprovados, zero erros de página, exit code 0.
- Estado Git observado antes e depois: branch master, sem remote configurado, nada em stage; alterações preexistentes (arquivos modificados, removidos e não rastreados) preservadas. Nenhum stage, commit, push ou deploy foi executado.
- Limitação: workflow GitHub Actions e roteamento Vercel foram configurados localmente, mas ainda não foram executados nos serviços externos. O deploy depende da criação/conexão do repositório remoto e da importação na Vercel.
- Nota de arquitetura: a persistência permanece em localStorage (guildaSave v2); publicar o site não sincroniza salvamentos entre dispositivos. Backend/autenticação ficam fora desta etapa.
- Próxima ação: revisar o conjunto de arquivos que deve ser versionado, autorizar a criação/conexão do repositório GitHub e então importar o projeto na Vercel.


## Publicação inicial no GitHub — 2026-11-03
- [x] Stage revisado: 70 arquivos incluídos; os dois backups históricos da raiz foram explicitamente mantidos fora do stage. A pasta Planejamento/Arquivo/Backups/ permanece preservada e ignorada.
- [x] Commit criado: `4f5b793` — `chore: prepare Guilda for GitHub and Vercel`.
- [x] Push concluído para `origin/master`; referência remota confirmada em `4f5b7932aaf051c259a13ae0e6f02f8ae03f2900`.
- [x] Branch local `master` acompanha `origin/master`.
- [x] `npm test`: 292 verificações unitárias/baseline e 13/13 regressões Puppeteer; zero erros de página; exit code 0. `git diff --cached --check` passou antes do commit.
- Estado local posterior: somente duas exclusões preexistentes dos backups na raiz continuam não staged; as cópias estão preservadas em Planejamento/Arquivo/Backups/. Nenhuma outra alteração de trabalho ficou pendente.
- Pendências: validar GitHub Actions no primeiro push (workflow já enviado), conectar/importar o repositório na Vercel, executar deploy e testar rota principal, módulos e spritesheets publicados.
