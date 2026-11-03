# Arquitetura — Guilda dos Aventureiros

Versão: 0.2
Última revisão: 2026-10-27
Estado: Fase 2 iniciada. `Adventurer` e `PersistenceService` foram extraídos no HTML; comportamento e formato `guildaSave` v2 preservados; suíte 13/13 aprovada.

## Estado confirmado
- Aplicação executada localmente em `Guilda dos Aventureiros.html`.
- HTML, CSS e JavaScript estão atualmente no mesmo arquivo.
- O JavaScript está envolvido em uma função anônima; o estado principal é um objeto `state`.
- Classes existentes: `Mission`, `CampaignMission`, `Adventurer` e `PersistenceService`.
  - `Mission` representa uma missão do catálogo; `CampaignMission` herda dela e especializa `applyRewards` para avançar a campanha.
  - `Adventurer` encapsula identidade, classe, raridade, poder, custo, seguro e estado operacional. `fromSaved` valida e normaliza registros restaurados; `insuranceCost`, `isIdle`, `isOnMission`, `markOnMission`, `markIdle`, `consumeInsurance` e `toJSON` concentram comportamento antes disperso.
  - `PersistenceService` centraliza a leitura e a gravação do estado. Usa a chave `guildaSave`, versão `2` e aceita armazenamento injetado; por padrão, usa `localStorage`. `load(target)` valida/restaura o estado e delega a reconstrução de aventureiros e missões; `save(source)` serializa o formato v2.
- Catálogos de missão: `MISSIONS` e `CAMPAIGN`.
- A restauração reconstrói missões a partir dos catálogos, associa aventureiros ativos por IDs e rejeita registros inválidos. As funções `load()` e `save()` permanecem como wrappers para preservar os pontos de chamada existentes.
- Interface atualizada pela função `render`; ciclo temporal tratado por `loop` e `resolveMission`. A renderização e as ações de UI ainda estão no mesmo escopo do estado.
- Testes: `npm test` executa a verificação sintática do JavaScript inline e 13 cenários de regressão em Puppeteer. O runner exige exatamente 13 cenários, captura falha individual por cenário e resolve somente a dependência declarada em `node_modules` local.
- Empacotamento de desenvolvimento: `package.json` declara Node.js `>=22.12.0` e Puppeteer `25.16.0`; `package-lock.json` registra a resolução das dependências. O jogo continua abrível sem instalação.
- Não há sistema de módulos. A suíte persistente está em `tests/` e usa Node.js/Puppeteer apenas como dependência de desenvolvimento; o HTML continua autônomo.

## Direção arquitetural
1. Manter o jogo abrível localmente durante a evolução.
2. Separar regras de domínio da manipulação do DOM em etapas pequenas.
3. Introduzir classes somente quando houver invariantes, estado ou comportamento coeso a encapsular.
4. Manter `Mission`/`CampaignMission` e ampliar a modelagem após auditar sucesso, falha, seguro, recompensa e campanha.
5. Manter a persistência centralizada em `PersistenceService`, preservando `guildaSave` v2 e compatibilidade com salvamentos existentes.
6. Evitar frameworks e dependências externas até que uma necessidade concreta seja demonstrada.

## Componentes
### Implementados
- `Mission`/`CampaignMission`: catálogo, duração, requisito e recompensas; a campanha usa polimorfismo em `applyRewards`.
- `Adventurer`: entidade de domínio com validação de restauração, seguro e estado operacional.
- `PersistenceService`: leitura, validação coordenada, restauração e gravação versionada.

### Candidatos
- Estado/serviço da Guilda: recursos, elenco, seleção, recrutamento e progressão.
- Serviço de jornadas: despacho, tempo, resolução, sucesso/falha e liberação da equipe.

Os limites finais ainda podem mudar. `Adventurer` e `PersistenceService` existem no código; os demais componentes continuam como direção, não como implementação concluída.

## Restrições de compatibilidade
- Não quebrar salvamentos `guildaSave` existentes. A refatoração atual preservou a chave, a versão `2` e os campos persistidos; a suíte cobre migração legada, JSON corrompido, jornada em andamento e IDs duplicados.
- Não alterar IDs e contratos de elementos DOM sem atualizar todos os consumidores.
- Não mudar regras de economia, risco ou progressão durante refatorações estruturais, salvo tarefa explícita e testes próprios.

## Limitações atuais
- As classes e o estado continuam dentro da IIFE do HTML; ainda não há módulos nem testes unitários de domínio sem DOM.
- A suíte é de integração no navegador, com salvamentos sintéticos e RNG controlado; não cobre espera real de 15 s, sessões longas nem equilíbrio econômico.
- O caminho reproduzível é `npm ci` com o lockfile e Node.js `>=22.12.0`. O `npm install` baixa o navegador compatível do Puppeteer. O runner não usa cache global do `npx`; se a dependência local estiver ausente, falha com instrução para executar `npm install`. A conclusão de missão é testada com timestamps no passado; os quatro capítulos são cobertos em cenários independentes.
