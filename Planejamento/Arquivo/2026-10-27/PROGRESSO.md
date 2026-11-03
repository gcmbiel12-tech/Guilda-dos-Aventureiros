# Progresso — Guilda dos Aventureiros

Última atualização: 2026-10-27

## Situação
- Fase registrada no `PLANO_MESTRE.md`: Fase 2 iniciada; `Adventurer` e `PersistenceService` extraídos; validação com `npm ci` concluída e suíte 13/13 usando Puppeteer local.
- Arquivo de jogo confirmado: `Guilda dos Aventureiros.html`.
- Backups disponíveis e preservados: `Guilda dos Aventureiros.html.bak` e `Guilda dos Aventureiros.pre-POO.html.bak`.
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

## Próxima tarefa
1. Revisar o diff local e, quando autorizado, incluir as alterações em commit; não iniciar outra refatoração nesta etapa.
2. Depois da revisão, continuar a Fase 2: extrair estado/serviço da Guilda e serviço de jornadas, mantendo `npm test` verde e os 13 cenários como baseline.
3. Auditar equilíbrio de risco, recompensa e progressão como tarefa de produto separada.

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

## Próximas ações atualizadas
1. Revisar o diff local e, quando autorizado, incluir as alterações em commit; não iniciar nova refatoração nesta etapa.
2. Depois da revisão, continuar a Fase 2 com a extração de estado/serviço da Guilda e serviço de jornadas, mantendo os 13 cenários como baseline.
3. Auditar equilíbrio de risco, recompensa e progressão como tarefa de produto separada.

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
