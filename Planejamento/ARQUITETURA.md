# Arquitetura â€” Guilda dos Aventureiros

Versão: 0.9
Última revisão: 2026-11-03
Estado: Fase 2 concluída nos serviços centrais; Fase 3 em andamento. guilda-domain.js contém entidades, catálogos e GuildService; guilda-journey.js contém JourneyService; guilda-persistence.js contém PersistenceService; guilda-loop.js contém GameLoop. guildaSave v2 preservado. Testes atuais: 292 verificações unitárias/baseline + 13 cenários Puppeteer, zero erros de página.

## Estado confirmado
- AplicaÃ§Ã£o executada localmente em `Guilda dos Aventureiros.html`.
- HTML, CSS e JavaScript estÃ£o atualmente no mesmo arquivo.
- O JavaScript estÃ¡ envolvido em uma funÃ§Ã£o anÃ´nima; o estado principal Ã© um objeto `state`.
- O mÃ³dulo `guilda-domain.js` contÃ©m `Mission`, `CampaignMission`, `Adventurer`, `GuildService`, os catÃ¡logos e constantes de domÃ­nio. O mÃ³dulo Ã© compatÃ­vel com CommonJS para testes Node.js e expÃµe `GuildaDomain` no navegador.
  - `Mission` representa uma missÃ£o do catÃ¡logo; `CampaignMission` herda dela e especializa `applyRewards` para avanÃ§ar a campanha.
  - `Adventurer` encapsula identidade, classe, raridade, poder, custo, seguro e estado operacional. `fromSaved` valida e normaliza registros restaurados; `insuranceCost`, `isIdle`, `isOnMission`, `markOnMission`, `markIdle`, `consumeInsurance` e `toJSON` concentram comportamento antes disperso.
- `PersistenceService` em `guilda-persistence.js` centraliza leitura, validaÃ§Ã£o e gravaÃ§Ã£o do estado. Recebe `Adventurer`, `MISSIONS`, `CAMPAIGN` e armazenamento por injeÃ§Ã£o; por padrÃ£o, usa `localStorage`. `load(target)` reconstrÃ³i aventureiros e missÃµes e `save(source)` serializa o formato v2.
- `GuildService` recebe o objeto de estado e RNG injetÃ¡vel; centraliza fÃ³rmulas de progressÃ£o, geraÃ§Ã£o de aventureiros, renovaÃ§Ã£o da taverna, seleÃ§Ã£o, seguro, contrataÃ§Ã£o, melhoria do salÃ£o e prestÃ­gio. Retorna resultados estruturados (`ok`/`code`/dados) sem acessar DOM, persistÃªncia ou mensagens.
- CatÃ¡logos de missÃ£o: `MISSIONS` e `CAMPAIGN`.
- A restauraÃ§Ã£o reconstrÃ³i missÃµes a partir dos catÃ¡logos, associa aventureiros ativos por IDs e rejeita registros invÃ¡lidos. As funÃ§Ãµes `load()` e `save()` permanecem como wrappers para preservar os pontos de chamada existentes.
- `JourneyService` em `guilda-journey.js` concentra despacho e resoluÃ§Ã£o de jornadas (sucesso, recompensas, risco, seguro, perda, campanha e liberaÃ§Ã£o da equipe). Recebe estado, callbacks de save/render/log, multiplicador, catÃ¡logo de campanha, RNG e relÃ³gio por injeÃ§Ã£o. NÃ£o depende de DOM nem de `guilda-domain.js` em runtime; recebe instÃ¢ncias de missÃ£o e aventureiros.

- Interface atualizada pela funÃ§Ã£o `render`; estado, renderizaÃ§Ã£o e aÃ§Ãµes de UI ainda estÃ£o no mesmo escopo do HTML.
- `GameLoop` em `guilda-loop.js` coordena a resoluÃ§Ã£o de jornadas vencidas, renderizaÃ§Ã£o e agendamento. Recebe estado, callback de resoluÃ§Ã£o, render, relÃ³gio, agendador, cancelador e intervalo por injeÃ§Ã£o; nÃ£o depende de DOM.
- Avatares de NPCs sÃ£o renderizados na taverna e no roster por classe; CSS aplica balanÃ§o nos candidatos, respiraÃ§Ã£o nos aventureiros ociosos e marcha nos integrantes em missÃ£o. A animaÃ§Ã£o respeita prefers-reduced-motion e nÃ£o altera estado nem persistÃªncia. BalÃµes de diÃ¡logo contextuais sÃ£o determinados pelo ID do aventureiro e pelo estado visual (recruta, ocioso ou em missÃ£o), sem RNG, relÃ³gio, mutaÃ§Ã£o de domÃ­nio ou persistÃªncia.
- CartÃµes de recrutamento e seleÃ§Ã£o sÃ£o controles de teclado com `role=button`, `tabIndex=0`, rÃ³tulos acessÃ­veis e ativaÃ§Ã£o por Enter/EspaÃ§o; cartÃµes selecionÃ¡veis expÃµem `aria-pressed`. Foco visÃ­vel usa os tokens de cor existentes.
- O log de aÃ§Ãµes Ã© uma regiÃ£o `role=status`/`aria-live=polite`; despacho em missÃµes comuns fica desabilitado sem seleÃ§Ã£o. O controle de seguro tem nome acessÃ­vel.
- A avaliaÃ§Ã£o prÃ©-despacho em `missionAssessment(m)` soma o poder dos aventureiros selecionados e o compara ao requisito; a chance Ã© obtida de `Mission.successChance(power)`. A interface explica que `risk` sÃ³ Ã© aplicado individualmente apÃ³s uma missÃ£o fracassada e que o seguro evita a perda, sendo consumido. A avaliaÃ§Ã£o aparece em missÃµes comuns e na etapa desbloqueada da campanha.
- Testes: `npm test` verifica a sintaxe dos quatro mÃ³dulos e do script inline; executa 7 testes de domÃ­nio, 9 de `GuildService`, 8 de `JourneyService`, 6 de `GameLoop`, 7 de baseline econÃ´mico determinÃ­stico, 11 de `PersistenceService` e 13 cenÃ¡rios de regressÃ£o em Puppeteer. O fluxo de interface cobre ativaÃ§Ã£o por teclado, estado `aria-pressed`, despacho inicialmente desabilitado, avaliaÃ§Ã£o de poder/chance/risco em missÃµes comuns e campanha, e ausÃªncia de erros de pÃ¡gina.
- `tests/economy-balance.cjs` usa seed fixa e 20.000 amostras para proteger o baseline de raridades, poder, custo, probabilidade de sucesso, atriÃ§Ã£o esperada, retorno de missÃµes e efeito do prestÃ­gio. Os resultados sÃ£o expectativas estatÃ­sticas, nÃ£o garantias para uma partida individual.
- `guilda-domain.js`, `guilda-journey.js`, `guilda-persistence.js` e `guilda-loop.js` sÃ£o mÃ³dulos locais sem dependÃªncias externas de runtime. O HTML continua abrÃ­vel localmente desde que os quatro mÃ³dulos estejam ao lado dele. A suÃ­te persistente em `tests/` usa Node.js/Puppeteer apenas em desenvolvimento.

## DireÃ§Ã£o arquitetural
1. Manter o jogo abrÃ­vel localmente durante a evoluÃ§Ã£o.
2. Separar regras de domÃ­nio da manipulaÃ§Ã£o do DOM em etapas pequenas.
3. Introduzir classes somente quando houver invariantes, estado ou comportamento coeso a encapsular.
4. Manter `Mission`/`CampaignMission` e ampliar a modelagem apÃ³s auditar sucesso, falha, seguro, recompensa e campanha.
5. Manter a persistÃªncia centralizada em `PersistenceService`, preservando `guildaSave` v2 e compatibilidade com salvamentos existentes.
6. Evitar frameworks e dependÃªncias externas atÃ© que uma necessidade concreta seja demonstrada.

## Componentes
### Implementados
- `GameLoop`: coordenador temporal testÃ¡vel sem DOM, com `tick`, `start` e `stop`; agendamento e relÃ³gio substituÃ­veis nos testes.
- `Mission`/`CampaignMission`: catÃ¡logo, duraÃ§Ã£o, requisito e recompensas; a campanha usa polimorfismo em `applyRewards`.
- `Adventurer`: entidade de domÃ­nio com validaÃ§Ã£o de restauraÃ§Ã£o, seguro e estado operacional.
- `PersistenceService`: mÃ³dulo UMD em `guilda-persistence.js`, com armazenamento e dependÃªncias de domÃ­nio injetÃ¡veis; leitura, validaÃ§Ã£o coordenada, restauraÃ§Ã£o e gravaÃ§Ã£o versionada testadas sem DOM.
- `JourneyService`: mÃ³dulo UMD em `guilda-journey.js`, com estado e efeitos externos injetados; testÃ¡vel sem DOM.
- `GuildService`: regras de geraÃ§Ã£o e gestÃ£o da Guilda sem DOM; cobre geraÃ§Ã£o/renovaÃ§Ã£o da taverna, seleÃ§Ã£o, seguro, contrataÃ§Ã£o, upgrade do salÃ£o e prestÃ­gio com RNG substituÃ­vel.

### PrÃ³ximos componentes candidatos
- Separar a orquestraÃ§Ã£o restante da UI e revisar acessibilidade/responsividade apÃ³s estabilizar os serviÃ§os.

Os limites finais ainda podem mudar. `Adventurer`, `Mission`, `CampaignMission` e `GuildService` estÃ£o em `guilda-domain.js`; `JourneyService` estÃ¡ em `guilda-journey.js`; `PersistenceService` estÃ¡ em `guilda-persistence.js`.

## RestriÃ§Ãµes de compatibilidade
- NÃ£o quebrar salvamentos `guildaSave` existentes. A refatoraÃ§Ã£o atual preservou a chave, a versÃ£o `2` e os campos persistidos; a suÃ­te cobre migraÃ§Ã£o legada, JSON corrompido, jornada em andamento e IDs duplicados.
- NÃ£o alterar IDs e contratos de elementos DOM sem atualizar todos os consumidores.
- NÃ£o mudar regras de economia, risco ou progressÃ£o durante refatoraÃ§Ãµes estruturais, salvo tarefa explÃ­cita e testes prÃ³prios.

## LimitaÃ§Ãµes atuais
- `GuildService`, `JourneyService` e `PersistenceService` estÃ£o em mÃ³dulos separados; o objeto de estado e as instÃ¢ncias dos serviÃ§os ainda sÃ£o criados na IIFE do HTML. A UI mantÃ©m renderizaÃ§Ã£o e ciclo temporal.
- A suÃ­te Ã© de integraÃ§Ã£o no navegador, com salvamentos sintÃ©ticos e RNG controlado; nÃ£o cobre espera real de 15 s, sessÃµes longas nem equilÃ­brio econÃ´mico.
- O caminho reproduzÃ­vel Ã© `npm ci` com o lockfile e Node.js `>=22.12.0`. O `npm install` baixa o navegador compatÃ­vel do Puppeteer. O runner nÃ£o usa cache global do `npx`; se a dependÃªncia local estiver ausente, falha com instruÃ§Ã£o para executar `npm install`. A conclusÃ£o de missÃ£o Ã© testada com timestamps no passado; os quatro capÃ­tulos sÃ£o cobertos em cenÃ¡rios independentes.


## Direção de arte e uso de IA local — 2026-11-02
- Decisão: a Guilda é o foco central da experiência; aventureiros são o coração visual/emocional, com destaque contextual (sede, recrutamento/gerenciamento e missões), sem transformar o jogo em RPG de controle direto de um único herói.
- Os spritesheets atuais do Guerreiro (`Guerreiro, ocioso/ataque/morrendo.png`) permanecem como referência canônica de personagem. Não substituir nem alterar os originais com base em uma geração isolada.
- `ComfyUI-Teste-01.png` é um experimento de direção visual, não um asset aprovado: a imagem tem acabamento de fantasia medieval interessante, mas altera a identidade do Guerreiro e não atende aos requisitos de sprite animado consistente.
- Direcionar as próximas experiências locais do ComfyUI prioritariamente a cenários/ambientes e elementos estáticos, nos quais não há exigência de identidade de personagem entre quadros. Retratos/ilustrações podem ser aproveitados apenas quando coerentes com a arte do jogo e com função clara.
- Critérios antes de integrar qualquer asset: coerência com a interface e os sprites existentes, legibilidade na escala real, enquadramento/recorte adequados, transparência quando necessária, desempenho e finalidade concreta no gameplay. Manter geração local gratuita; sem serviços pagos, APIs ou credenciais.
- Próximo experimento recomendado: conceito de ambiente da sede da Guilda, sem personagens, para avaliar se o ComfyUI acrescenta valor visual sem descaracterizar a interface atual. A imagem deverá permanecer isolada até avaliação; não alterar gameplay nem saves.


## Organização documental — 2026-11-02
- Documentos ativos de coordenação ficam na raiz do projeto; `Planejamento/README.md` descreve o papel da pasta de referências.
- Snapshots antigos de `AGENTS.md`, `PLANO_MESTRE.md`, `ARQUITETURA.md` e `PROGRESSO.md` foram preservados em `Planejamento/Arquivo/2026-10-27/` após comparação. Não são a arquitetura ou o progresso vigentes.
- Novas referências de produto não devem ser misturadas à documentação de implementação: requisitos e decisões vão para o plano; estado técnico para arquitetura; entregas e pendências para progresso.


## Organização física da documentação — 2026-11-02
- `Planejamento/` é a localização canônica de instruções, plano mestre, arquitetura, progresso e relatório de etapa.
- A raiz mantém somente um `AGENTS.md` de encaminhamento para `Planejamento/AGENTS.md`, pois agentes podem procurar instruções nesse caminho.
- Código executável, módulos locais, assets, `package.json`, lockfile, `node_modules/` e `tests/` permanecem na raiz para preservar os caminhos de execução e testes. Não mover esses itens sem revisar imports, scripts e carregamento local.
- Backups não ativos ficam em `Planejamento/Arquivo/Backups/`; snapshots documentais antigos em `Planejamento/Arquivo/2026-10-27/`.


## Pipeline visual experimental — 2026-11-02
- ComfyUI Desktop 0.43.2 local, SD 1.5 (`v1-5-pruned-emaonly-fp16.safetensors`), RTX 3050 Laptop 4 GB VRAM e 8 GB RAM.
- Testes de cenário geram PNGs isolados em `NPC/Sede/`; não são carregados pelo HTML principal e não substituem assets ativos.
- `NPC/Sede/preview.html` e `verify-preview.cjs` são laboratório visual e verificador Puppeteer, independentes do jogo. A geração de cenário não adiciona dependências de runtime.
- Decisão atual: não integrar as quatro imagens testadas; ver avaliação e parâmetros em `Arte/Sede/EXPERIMENTO_COMFYUI.md`.

## Protótipo isolado da sede explorável — 2026-11-02
- NPC/Sede/blockout.html é um laboratório independente, não carregado pelo jogo principal.
- NPC/Sede/sede-navigation.js implementa GuildaSedeNavigation em UMD: geometria do piso/obstáculos, teste de ponto caminhável, A* em grade de 10 px e controlador de movimento interpolado por requestAnimationFrame.
- O mapa usa coordenadas SVG 960×650, piso em losango e obstáculos explícitos para mural, mesa de planejamento, balcão de recepção e lareira. Movimentos diagonais não atravessam quinas de obstáculos.
- Clique/toque converte coordenadas de tela para SVG; teclas direcionais solicitam destinos relativos. Destinos fora do piso ou dentro de obstáculos são recusados. O marcador acompanha uma rota calculada sem teleporte.
- Os três hotspots apenas anunciam a função planejada (contratos; recepção/recrutamento/gestão; planejamento de expedições). Ainda não invocam serviços nem estado do jogo.
- Testes puros em tests/sede-navigation-unit.cjs; teste de navegador isolado em NPC/Sede/verify-navigation.cjs. O módulo é incluído em tests/check-syntax.cjs e no script npm test.
- Nenhuma dependência de runtime, regra de domínio ou formato de persistência foi introduzido. A integração com o jogo principal permanece decisão futura, condicionada a validação de UX.

### Aproximação e ativação dos hotspots
- Cada estação possui uma coordenada de aproximação caminhável (contratos, recepção e planejamento). Clicar na estação solicita uma rota até essa posição, sem teleportar para dentro do mobiliário.
- Ao chegar, o controlador informa que o jogador está próximo e solicita Enter. A ativação por Enter apresenta a função da estação; foco é levado ao SVG para permitir o fluxo de teclado após clique.
- Clique em outra área ou uso das setas cancela a aproximação pendente. A callback onArrive é opcional no controlador e executada ao concluir o movimento.
- Esta interação continua demonstrativa: ainda não chama sistemas de contratos, contratação ou expedições.


## Apresentação visual de expedições — 2026-11-02
- `guilda-expedition-view.js` publica `GuildaExpeditionView.snapshot(active, now)`, função pura e determinística que calcula progresso limitado a 0–100%, fase, atmosfera, cenário, marco e rótulo. Recebe o timestamp atual para permitir testes controlados.
- Missões comuns usam três atmosferas reutilizáveis; campanha usa quatro cenários temáticos selecionados por `campaignStep`.
- O HTML consome o snapshot apenas na renderização de `#journeys`; CSS compõe o ambiente, trilha e pequenos efeitos sem assets externos. O grupo continua usando os avatares atuais.
- A apresentação não grava estado, não adiciona campos ao save e não chama RNG. O relógio e as regras continuam sob `JourneyService`/`GameLoop`; o painel apenas reflete `start` e `dur` já persistidos.
- Movimento reduzido desativa o brilho animado e transição da barra. Nenhuma dependência externa de runtime foi adicionada.
- `tests/expedition-view-unit.cjs`: 16 verificações puras; `tests/guilda-regression.cjs` verifica a renderização da cena numa jornada restaurada.
- `npm test`: 79 testes/verificações e 13 cenários Puppeteer aprovados, zero erros de página. `guildaSave` v2 preservado.

## Confrontos e resultados visuais de expedicao — 2026-11-02
- O catalogo de cenarios em `guilda-expedition-view.js` agora usa os nomes canonicos dos quatro capitulos da campanha e inclui ameacas/encontros especificos.
- A fase `objective` de uma jornada de campanha e marcada como confronto e pode apresentar o encontro contextual. Missao comum nao recebe esse destaque.
- `outcome(input)` e funcao pura: identifica sucesso pelo delta real de ouro/reputacao/progresso de campanha observado ao redor da resolucao do JourneyService; identifica vitoria final quando a campanha chega ao quarto capitulo concluido.
- O adaptador de interface `resolveMission` guarda um resumo somente em memoria, e a renderizacao apresenta um banner por 10 segundos. O campo transitorio nao e parte do contrato de persistencia e nao altera `guildaSave v2`.
- Testes: 24 verificacoes puras do modulo e 13 cenarios Puppeteer. Total da suite: 87 verificacoes unitarias/baseline e 13 cenarios de navegador, zero erros.


## Apresentacao de sprites nas jornadas - 2026-11-02
- `guilda-sprite-view.js` e um adaptador puro UMD que seleciona folhas locais do Guerreiro por acao, fornece dimensoes, duracao e atraso de fase deterministico. Nao depende de DOM, estado de jogo ou persistencia.
- A interface usa spritesheet de repouso em jornadas e spritesheet de ataque na fase de objetivo de campanha. O atraso negativo calculado com `Date.now()` evita que a re-renderizacao de 400 ms reinicie visualmente o ciclo no primeiro quadro.
- CSS reduz a folha 1024x128 para 272x34 (oito quadros de 34x34), com `steps(8)` e `prefers-reduced-motion`. Caminhos de assets sao relativos ao HTML local.
- `tests/sprite-view-unit.cjs` cobre selecao de classe/acao, dimensoes, periodo e fase; a regressao de navegador cobre jornada persistida e o teste isolado confirma carregamento da folha de ataque.
- Nenhuma mudanca em `guildaSave` v2, regras de dominio, economia, RNG ou ciclo temporal.


## Validação de rotas múltiplas da sede — 2026-11-03
- tests/sede-navigation-unit.cjs cobre três origens caminháveis distintas e as três estações, totalizando nove combinações de rota.
- Cada rota verifica destino, caminhabilidade de todos os pontos, adjacência dos passos e as duas células ortogonais de cada movimento diagonal; isso protege contra atalhos através de quinas.
- A implementação de produção NPC/Sede/sede-navigation.js não foi modificada nesta etapa. O verificador de navegador isolado confirmou chegada, rejeição de destino bloqueado, hotspot de recepção, responsividade móvel e ausência de erros.
- O teste de regressão do jogo conta avatares e spritesheets como representações visuais equivalentes, evitando falso negativo após a integração de sprites do Guerreiro.
- npm test: 286 verificações unitárias/baseline e 13 cenários Puppeteer aprovados; zero erros de página. git diff --check aprovado.


## Feedback visual de perdas — 2026-11-03
- guilda-sprite-view.js agora seleciona três ações para o Guerreiro: repouso, ataque e morte. A spritesheet de morte original foi preservada e é carregada somente no resultado de perda real.
- resolveMission captura a equipe antes da resolução e compara IDs com o roster após JourneyService; somente membros efetivamente removidos são anexados ao resumo transitório.
- A interface apresenta nome e representação visual das perdas no banner temporário. Para Guerreiros, a spritesheet de morte toca uma vez; o atraso negativo baseado no tempo do resultado mantém a fase estável entre renderizações do GameLoop.
- prefers-reduced-motion desativa o movimento e posiciona a folha no quadro final. A regressão verifica também o caminho CSS e o comportamento reduzido.
- O resumo de resultado/casualties continua fora do contrato PersistenceService e não é serializado no guildaSave v2. Seguro consumido sem perda não dispara animação de morte.
- npm test: 292 verificações unitárias/baseline, 13/13 cenários Puppeteer e zero erros de página.


## Distribuição web — preparação inicial (2026-11-03)
- A aplicação atual é um site estático: Guilda dos Aventureiros.html carrega módulos JavaScript locais (guilda-domain.js, guilda-journey.js, guilda-persistence.js, guilda-loop.js, guilda-expedition-view.js, guilda-sprite-view.js) e spritesheets em NPC/Guerreiro/.
- Não há bundler nem etapa de compilação. A Vercel deve ser configurada com Framework Preset Other, diretório raiz do repositório, comando de build desativado e diretório de saída .
- vercel.json reescreve somente a rota / para /Guilda%20dos%20Aventureiros.html, preservando o nome atual do HTML e evitando uma cópia paralela index.html que poderia divergir.
- .gitignore protege dependências, artefatos locais, cache Vercel, logs e arquivos .env; exemplos .env.example permanecem versionáveis. Não há credenciais nem configuração de backend nesta etapa.
- .github/workflows/ci.yml executa npm ci e npm test em Node.js 22.12.0 para pushes e pull requests. O workflow ainda precisa de execução real no GitHub após a conexão do remoto.
- README.md na raiz documenta somente o uso técnico/operacional; os documentos oficiais de produto e arquitetura continuam exclusivamente em Planejamento/.
- Persistência: PersistenceService usa localStorage e chave guildaSave v2. Hospedagem estática mantém os salvamentos no navegador de cada jogador; sincronização multi-dispositivo requer backend, autenticação e banco de dados, ainda não implementados.
- Nenhum código de gameplay, formato de save ou asset foi alterado para esta preparação.
