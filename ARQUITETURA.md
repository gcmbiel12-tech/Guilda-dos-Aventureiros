# Arquitetura — Guilda dos Aventureiros

Versão: 0.1
Última revisão: 2026-10-27
Estado: diagnóstico inicial; arquitetura existente deve ser preservada até auditoria das regras.

## Estado confirmado
- Aplicação executada localmente em `Guilda dos Aventureiros.html`.
- HTML, CSS e JavaScript estão atualmente no mesmo arquivo.
- O JavaScript está envolvido em uma função anônima; o estado principal é um objeto `state`.
- Classes existentes: `Mission` e `CampaignMission`. `CampaignMission` herda de `Mission` e especializa `applyRewards`, portanto já existe um caso concreto de herança/polimorfismo.
- Catálogos de missão: `MISSIONS` e `CAMPAIGN`.
- Persistência: `localStorage`, chave `guildaSave`, formato versionado `v2`.
- A restauração reconstrói missões a partir dos catálogos e associa aventureiros ativos por IDs.
- Interface atualizada pela função `render`; ciclo temporal tratado por `loop` e `resolveMission`.
- Não foi confirmado um sistema de módulos nem uma suíte de testes atualmente presente na raiz.

## Direção arquitetural
1. Manter o jogo abrível localmente durante a evolução.
2. Separar regras de domínio da manipulação do DOM em etapas pequenas.
3. Introduzir classes somente quando houver invariantes, estado ou comportamento coeso a encapsular.
4. Preservar `Mission`/`CampaignMission` e ampliar a modelagem após auditar sucesso, falha, seguro, recompensa e campanha.
5. Centralizar leitura, validação, migração e gravação do estado em uma responsabilidade de persistência clara, sem alterar o formato salvo sem migração.
6. Evitar frameworks e dependências externas até que uma necessidade concreta seja demonstrada.

## Componentes candidatos (não implementados como classes ainda)
- Entidade Aventureiro: identidade, classe, raridade, poder, seguro e estado operacional.
- Estado/serviço da Guilda: recursos, elenco, seleção, recrutamento e progressão.
- Serviço de persistência: validação, migração e armazenamento do estado versionado.
- Serviço de jornadas: despacho, tempo, resolução, sucesso/falha e liberação da equipe.

Os nomes e limites finais serão definidos após os testes das regras atuais. Este documento descreve direção, não afirma que esses componentes já existem.

## Restrições de compatibilidade
- Não quebrar salvamentos `guildaSave` existentes.
- Não alterar IDs e contratos de elementos DOM sem atualizar todos os consumidores.
- Não mudar regras de economia, risco ou progressão durante refatorações estruturais, salvo tarefa explícita e testes próprios.