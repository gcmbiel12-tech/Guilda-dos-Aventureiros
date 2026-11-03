# Relatório da etapa — Sede explorável: navegação e colisões

Data: 2026-11-02

## Objetivo
Avançar o blockout da sede de uma composição selecionável para um protótipo espacial interativo, com movimento contínuo, caminhos válidos, colisões e estações com funções compreensíveis.

## Contexto e decisões anteriores
- A direção aprovada é uma sede 2D explorável, em perspectiva elevada 3/4/isométrica, com mural à esquerda, recepção à direita, planejamento ao fundo e centro livre.
- Quatro conceitos iniciais e duas composições text-to-image foram avaliados e rejeitados por parecerem restaurante/recepção, colagem ou sala frontal.
- Duas gerações img2img guiadas pelo blockout foram avaliadas. A primeira reproduziu pseudo-textos; a segunda preservou a composição limpa, mas acrescentou pouco acabamento. Nenhuma imagem foi integrada. As evidências e parâmetros estão em Planejamento/Arte/Sede/EXPERIMENTO_COMFYUI.md.
- O usuário autorizou maior rigor e continuidade nas gerações, desde que respeitem o projeto. A decisão atual é priorizar primeiro a função espacial e retomar arte somente quando houver um alvo funcional e critérios mais precisos.

## Implementação
1. Criado NPC/Sede/sede-navigation.js, módulo UMD local e testável, sem dependências externas.
2. Implementada busca A* em grade de 10 px sobre o piso em losango, com movimento em oito direções e prevenção de corte diagonal pelas quinas.
3. Definidos polígonos de colisão para mural, mesa de planejamento, recepção e lareira.
4. Movimento por clique/toque agora interpola a posição do aventureiro ao longo do caminho, em vez de teletransportar.
5. Destinos fora do piso ou dentro de obstáculos são recusados com mensagem acessível.
6. Adicionadas setas direcionais para movimentação por teclado.
7. Hotspots conduzem o aventureiro a zonas de aproximação caminháveis; ao chegar, solicitam Enter para ativar a descrição da estação. O SVG recebe foco após clique para manter o fluxo por teclado. Ainda não estão conectados aos serviços do jogo.
8. Criados testes unitários e verificador Puppeteer dedicados; incluída a sintaxe do módulo na suíte.

## Arquivos alterados/criados
- Alterado: NPC/Sede/blockout.html.
- Criado: NPC/Sede/sede-navigation.js.
- Criado: NPC/Sede/verify-navigation.cjs.
- Criado: tests/sede-navigation-unit.cjs.
- Alterado: tests/check-syntax.cjs.
- Alterado: package.json para incluir os testes de navegação em npm test.
- Evidências visuais: NPC/Sede/navigation-desktop.png e NPC/Sede/navigation-mobile.png.
- Documentação: Planejamento/PROGRESSO.md, Planejamento/ARQUITETURA.md, Planejamento/PLANO_MESTRE.md.

## Testes e resultados
- Testes unitários da navegação: 15 verificações aprovadas, cobrindo rotas para quatro destinos, todos os nós caminháveis, recusa de destino sobre a mesa, recusa fora do piso e caminho vazio quando origem/destino coincidem.
- Verificador Puppeteer isolado: módulo carregado; rota de 12 nós até (600,250); todos os nós caminháveis; destinos de aproximação das três estações alcançáveis; destino bloqueado e fora do piso rejeitados; personagem chegou ao destino; aproximação da recepção e ativação por Enter confirmadas; viewport 390 px sem overflow; zero erros de página.
- npm test: exit code 0; sintaxe dos quatro módulos do jogo, módulo da sede e script inline OK; 7 domínio + 9 GuildService + 8 JourneyService + 6 GameLoop + 7 baseline econômico + 11 PersistenceService + 15 navegação = 63 testes/verificações; 13/13 cenários de regressão Puppeteer; zero erros de página. Total de 76 verificações/cenários.
- git diff --check: exit code 0; avisos apenas de normalização LF/CRLF nos arquivos rastreados.
- Não houve alteração no HTML principal, nas regras de domínio, na economia, RNG, persistência guildaSave v2 ou sprites ativos.

## Limitações e riscos
- O blockout continua isolado; não é uma tela do jogo principal.
- Os hotspots são demonstrativos e não acionam GuildService, JourneyService nem estado persistido.
- Os obstáculos são polígonos manuais aproximados, não derivados automaticamente dos sprites/tiles finais.
- O marcador é um placeholder geométrico, não um sprite de personagem.
- Ainda não há navegação por zonas de aproximação, animação de caminhada do sprite real, mapa em camadas ou salvamento de posição.
- As imagens geradas por IA continuam não aprovadas para integração.

## Critérios
- [x] Sala única e layout isométrico definido.
- [x] Movimento contínuo por clique/toque.
- [x] Caminho calculado e desvio de obstáculos.
- [x] Recusa de destinos bloqueados e fora do piso.
- [x] Controle direcional por teclado.
- [x] Três hotspots com função comunicada.
- [x] Aproximação caminhável das estações e ativação demonstrativa por Enter.
- [x] Testes unitários e Puppeteer, sem overflow mobile ou erros de página.
- [ ] Hotspots ligados a fluxos reais de contratos, recepção e planejamento.
- [ ] Colisões calibradas com a arte final e sprites reais.
- [ ] Integração responsiva da sede ao jogo principal.
- [ ] Arte final em camadas aprovada por legibilidade e utilidade.

## Próxima etapa recomendada
Validar rotas a partir de múltiplas posições e colisões junto às paredes; depois conectar cada hotspot ao fluxo real correspondente com testes de integração. A integração no HTML principal deve ser uma etapa posterior e pequena, com regressões de save e gameplay.


## Etapa seguinte — Apresentação visual das expedições (2026-11-02)

### Objetivo
Tornar as missões visualmente vivas e preparar uma identidade própria para a campanha principal, sem transformar o jogo de gerenciamento em ação direta.

### Implementação
- Criado `guilda-expedition-view.js`: mapeamento puro do tempo decorrido para quatro fases, três ambientes comuns e quatro ambientes da campanha.
- Integrado ao painel de jornadas do HTML. O painel apresenta atmosfera, marco visual, grupo de aventureiros, trilha de progresso, acontecimento contextual e percentual.
- CSS responsivo com efeitos discretos, suporte a movimento reduzido e sem assets externos.
- A apresentação deriva somente de `active.start`, `active.dur` e `campaignStep`. Nenhuma mudança em `JourneyService`, domínio, economia, RNG ou persistência.

### Arquivos alterados/criados
- Alterado: `Guilda dos Aventureiros.html`.
- Criado: `guilda-expedition-view.js`.
- Criado: `tests/expedition-view-unit.cjs`.
- Alterado: `tests/check-syntax.cjs`, `tests/guilda-regression.cjs`, `package.json`.
- Documentação: `Planejamento/PROGRESSO.md`, `ARQUITETURA.md`, `PLANO_MESTRE.md`, este relatório.

### Testes e evidências
- 16 testes puros da apresentação aprovados.
- Regressão de navegador: 13/13 cenários, incluindo persistência de jornada em andamento com verificação da cena, atmosfera e fase; zero erros de página.
- Suíte: 79 testes/verificações (7 domínio, 9 GuildService, 8 JourneyService, 6 GameLoop, 7 baseline econômico, 11 PersistenceService, 15 navegação da sede e 16 apresentação de expedições); 13/13 cenários Puppeteer.
- Sintaxe de seis módulos locais e script inline aprovada. `npm test` concluído com exit code 0.
- `guildaSave` v2, duração, RNG, sucesso, risco, recompensas e campanha preservados. Nenhum asset original substituído.

### Limitações e próxima etapa
- Os cenários atuais são composições CSS com ícones/avatares existentes, não ilustrações finais ou animações de caminhada por spritesheet.
- A campanha já possui ambientes e marcos próprios, mas ainda não tem cenas específicas de confronto nem apresentação visual de vitória/derrota dentro do painel.
- Próximo avanço: eventos de confronto e conclusão para a campanha, depois caminhada dos sprites e refinamento visual. Sede explorável fica em backlog paralelo.

## Continuidade da etapa — encontros e resultados de expedicao (2026-11-02)

### Entregas
- Os cenarios de campanha agora refletem os nomes dos quatro capitulos do dominio, em vez de titulos genericos.
- Cada capitulo tem ameaca/encontro e marcos narrativos. A fase de objetivo recebe destaque de confronto.
- Ao concluir uma jornada, a interface mostra por 10 segundos um resultado temporario: sucesso, fracasso, etapa concluida ou vitoria final.
- O resultado e derivado das mudancas reais de ouro, reputacao e progresso da campanha apos a resolucao do servico. Nao modifica sorteio, risco, recompensas ou save.
- O resumo temporario existe somente em memoria e nao integra o formato guildaSave v2.

### Arquivos
- Alterados: `guilda-expedition-view.js`, `Guilda dos Aventureiros.html`, `tests/expedition-view-unit.cjs`, `tests/guilda-regression.cjs`.
- Documentacao atualizada em Planejamento.

### Validacao
- 24 verificacoes puras do modulo de apresentacao.
- Suite: 87 verificacoes unitarias/baseline e 13/13 cenarios Puppeteer, zero erros de pagina.
- `npm test` concluido; `git diff --check` executado na mesma cadeia sem falha.
- Testes de browser cobrem missao comum concluida, quatro etapas da campanha e persistencia de jornada em andamento.

### Pendencias
- Ainda nao existem animacoes de caminhada ou combate em spritesheet integradas.
- O visual usa CSS, marcos tipograficos/icone e avatares atuais; cenarios ilustrados finais permanecem pendentes.


## Etapa seguinte - Sprites de Guerreiro nas expedicoes (2026-11-02)

### Objetivo
Dar movimento de personagem real ao painel de expedicoes e destacar visualmente o confronto da campanha sem alterar o jogo de gerenciamento.

### Implementacao
- Criado `guilda-sprite-view.js`, adaptador puro que seleciona repouso ou ataque para aventureiros da classe Guerreiro. As demais classes mantem seus avatares atuais.
- O painel de jornada usa repouso nas fases comuns e ataque durante o objetivo da campanha.
- CSS percorre os oito quadros das folhas originais 1024x128 em escala 34x34; a fase e estabilizada por atraso negativo derivado do relogio, mesmo com renderizacao a cada 400 ms. `prefers-reduced-motion` pausa os sprites.
- Criada evidencia visual `NPC/Guerreiro/confronto-preview.png`.

### Arquivos alterados/criados
- Alterados: `Guilda dos Aventureiros.html`, `tests/check-syntax.cjs`, `tests/guilda-regression.cjs`, `package.json`, `Planejamento/PROGRESSO.md`, `Planejamento/ARQUITETURA.md`, `Planejamento/PLANO_MESTRE.md`, este relatorio.
- Criados: `guilda-sprite-view.js`, `tests/sprite-view-unit.cjs`, `NPC/Guerreiro/confronto-preview.png`.

### Testes e resultados
- 13 verificacoes puras do adaptador de sprites aprovadas.
- `npm test`: sintaxe dos sete modulos locais e script inline; 7 dominio + 9 GuildService + 8 JourneyService + 6 GameLoop + 7 baseline economico + 11 PersistenceService + 15 navegacao + 24 apresentacao de expedicoes + 13 sprite view = 100 verificacoes unitarias/baseline; 13/13 cenarios Puppeteer; 0 erros de pagina; exit code 0.
- Teste de navegador isolado confirmou `npc-sprite--attack`, fase `objective`, encontro contextual e PNG carregado em 1024x128.
- Nenhuma alteracao em saves, economia, RNG, duracao ou regras de missao.

### Limitacoes e proxima etapa
- Somente Guerreiro possui sprites reais integrados; as demais classes ainda usam os avatares anteriores.
- O sprite de ataque repete durante a fase de confronto; nao ha ainda animacoes de caminhada/ataque especificas para as outras classes.
- Proxima etapa: validar visualmente os quadros de caminhada/ataque em tamanho real, ajustar alinhamento/recorte se necessario e expandir o adaptador por classe somente quando houver assets consistentes.


---

# Relatório de continuidade — validação ampliada da sede e regressões visuais

Data: 2026-11-03

## Objetivo
Retomar o desenvolvimento a partir do estado documentado, validar a regressão introduzida pela integração de sprites e fortalecer a navegação do protótipo explorável da sede antes de conectá-lo aos sistemas reais.

## Implementação
1. Corrigida a medição de avatares na regressão inicial: o seletor agora considera .npc-avatar e .npc-sprite, sem alterar a interface de produção.
2. Ampliados os testes de navegação para três origens caminháveis e três destinos funcionais (contratos, recepção e planejamento).
3. Para cada rota, os testes verificam existência, caminhabilidade, destino final e continuidade entre células adjacentes.
4. Para cada passo diagonal, os dois pontos ortogonais adjacentes são verificados, impedindo passagem por quinas de obstáculos.
5. Nenhum módulo de produção, HTML principal, asset ou formato de salvamento foi alterado nesta etapa.

## Arquivos alterados
- Alterado: tests/guilda-regression.cjs.
- Alterado: tests/sede-navigation-unit.cjs.
- Atualizados: Planejamento/PROGRESSO.md, Planejamento/ARQUITETURA.md, Planejamento/PLANO_MESTRE.md e este relatório.

## Testes e resultados
- Teste de navegação da sede: 201 verificações aprovadas.
- Verificador Puppeteer isolado da sede: rota até (600,250), caminho seguro, destinos bloqueado/fora do piso recusados, personagem chegou ao destino, recepção alcançada e ativada por Enter, mobile 390 px sem overflow, zero erros.
- Suíte completa npm test: exit code 0; 286 verificações unitárias/baseline aprovadas; 13/13 cenários Puppeteer; zero erros de página.
- git diff --check: exit code 0; avisos apenas de normalização LF/CRLF em arquivos preexistentes.
- Salvamento guildaSave v2, economia, RNG, duração, risco, recompensas e campanha preservados.

## Limitações e riscos restantes
- Os hotspots continuam demonstrativos e ainda não executam operações de contratos, recrutamento ou planejamento.
- O protótipo da sede permanece isolado em NPC/Sede/blockout.html; não foi integrado ao jogo principal.
- O OpenCode 1.19.5 está instalado, mas não iniciou nesta sessão devido a erro interno do banco local (“Database is not empty and has no session table”). A alteração de teste foi aplicada diretamente via Desktop Commander.
- A direção visual final da sede, os sprites de caminhada e a validação visual em dispositivos reais continuam pendentes.

## Próxima etapa recomendada
Criar um adaptador de integração para os três hotspots, com callbacks/serviços injetados e testes independentes. Conectar contratos, recepção/recrutamento e planejamento sem mover o personagem para dentro de obstáculos nem acoplar o algoritmo A* ao domínio. Somente depois validar o fluxo completo deve ser considerada a integração visual ao jogo principal.


---

# Relatório de continuidade — feedback visual de perdas nas expedições

Data: 2026-11-03

## Objetivo
Aproveitar a spritesheet de morte já existente para tornar a consequência de uma falha sem seguro visualmente compreensível, sem duplicar regras de domínio ou alterar o salvamento.

## Implementação
1. Ampliado guilda-sprite-view.js com a ação death e referência à spritesheet original Guerreiro, morrendo.png.
2. resolveMission captura a equipe antes da resolução e, após JourneyService, compara os IDs com o roster atualizado. Só aventureiros realmente removidos são registrados como perdas.
3. O banner transitório de resultado apresenta nome e avatar dos aventureiros perdidos. Para Guerreiro, usa a animação de morte de oito quadros; demais classes continuam com seus ícones.
4. A animação toca uma vez. O atraso negativo calculado a partir do timestamp do resultado preserva a fase mesmo com re-renderizações periódicas.
5. prefers-reduced-motion desativa a animação e posiciona a spritesheet no último quadro.
6. O resumo permanece em memória; PersistenceService e o contrato guildaSave v2 não foram alterados.

## Arquivos alterados
- Alterado: Guilda dos Aventureiros.html.
- Alterado: guilda-sprite-view.js.
- Alterado: tests/sprite-view-unit.cjs.
- Alterado: tests/guilda-regression.cjs.
- Atualizados: Planejamento/PROGRESSO.md, Planejamento/ARQUITETURA.md, Planejamento/PLANO_MESTRE.md e este relatório.

## Testes e resultados
- Adaptador de sprites: 19 verificações aprovadas.
- Regressão Puppeteer: 13/13 cenários, zero erros de página. O cenário de perda verifica classe da animação, caminho da spritesheet, nome do aventureiro, ausência de dados transitórios no save e comportamento prefers-reduced-motion; o cenário com seguro confirma ausência de animação de morte.
- Suíte completa npm test: 292 verificações unitárias/baseline e 13/13 cenários Puppeteer; exit code 0; zero erros de página.
- Verificação sintática de todos os módulos locais e script inline aprovada.
- guildaSave v2, risco, seguro, RNG, economia, duração, recompensas e progressão da campanha preservados.

## Limitações
- A spritesheet de morte integrada é específica do Guerreiro; outras classes usam seus ícones existentes.
- A perda é apresentada por 10 segundos no banner de resultado, assim como os demais resultados transitórios.
- A integração da sede com os fluxos reais permanece pendente; o protótipo segue isolado.

## Próxima etapa
Criar um adaptador para os hotspots de contratos, recepção e planejamento com callbacks injetados. Testar a integração sem acoplar o algoritmo de navegação ao domínio; manter a sede isolada até validar o fluxo e a responsividade.


---

# Relatório da etapa — Preparação para GitHub e Vercel

Data: 2026-11-03

## Objetivo
Preparar a base existente para versionamento e hospedagem estática, sem publicar, criar credenciais, fazer commits ou modificar regras do jogo.

## Diagnóstico
- Projeto é um site estático: Guilda dos Aventureiros.html, seis módulos JS locais e assets de sprites em NPC/Guerreiro/.
- Não existe bundler ou script de build; package.json define testes e Puppeteer como dependência de desenvolvimento.
- Git já existe na branch master, mas não há remote configurado.
- Antes da tarefa havia alterações locais preexistentes: AGENTS.md e HTML modificados; documentos antigos da raiz e backups marcados como removidos; .gitignore, NPC/, Planejamento/, módulos, package.json, lockfile e tests/ não rastreados. node_modules/ já estava ignorado. Nenhuma dessas alterações foi revertida, preparada (stage) ou commitada.

## Implementação
1. Ampliado .gitignore para dependências, cache da Vercel, saídas de teste, logs, arquivos de ambiente e configurações temporárias de sistema/editor. Arquivos .env.example continuam permitidos.
2. Criado vercel.json com rewrite de / para o HTML atual (/Guilda%20dos%20Aventureiros.html), evitando duplicar o jogo em um index.html.
3. Criado .github/workflows/ci.yml para rodar npm ci e npm test em pushes e pull requests com Node.js 22.12.0.
4. Criado README.md na raiz com instruções de execução local, testes e configuração da Vercel. A documentação oficial de produto permanece em Planejamento/.
5. Atualizados Planejamento/PROGRESSO.md, ARQUITETURA.md, PLANO_MESTRE.md e este relatório.

## Arquivos criados/alterados nesta etapa
- Alterado: .gitignore.
- Criados: vercel.json, .github/workflows/ci.yml, README.md.
- Documentação atualizada: Planejamento/PROGRESSO.md, Planejamento/ARQUITETURA.md, Planejamento/PLANO_MESTRE.md, Planejamento/RELATORIO_ETAPA.md.
- Nenhum arquivo do jogo, asset, módulo de domínio ou salvamento foi alterado nesta etapa.

## Testes e resultados
- npm test: exit code 0.
- Sintaxe dos seis módulos JS e módulo da sede, mais script inline: aprovada.
- Testes unitários/baseline: 292 verificações aprovadas.
- Regressão Puppeteer: 13/13 cenários aprovados, zero erros de página.
- O JSON de vercel.json e o workflow ainda precisam de validação no serviço Vercel/GitHub; nenhum serviço externo foi acionado.

## Limitações e riscos
- O repositório não possui remote GitHub configurado. Nenhum repositório remoto foi criado.
- A Vercel ainda não foi conectada nem recebeu deploy.
- A configuração de rewrite é local e precisa ser confirmada no primeiro deploy.
- Os salvamentos continuam em localStorage (guildaSave v2), sem sincronização entre dispositivos.
- A suíte CI depende da instalação do navegador compatível com Puppeteer no runner; a execução real do workflow confirmará essa etapa.
- O estado Git continha alterações preexistentes e foi preservado integralmente; nada foi adicionado ao stage e nenhum commit foi criado.

## Critérios
- [x] Configuração básica de hospedagem estática criada.
- [x] Workflow de CI criado.
- [x] Regras básicas de exclusão de arquivos locais/sensíveis preparadas.
- [x] Instruções operacionais documentadas.
- [x] Suíte local aprovada.
- [ ] Workflow validado em GitHub Actions.
- [ ] Deploy de preview/produção validado na Vercel.
- [ ] Repositório remoto criado/conectado.

## Próxima etapa recomendada
Após autorização para criar/conectar o repositório GitHub, revisar cuidadosamente o diff e os arquivos não rastreados para separar conteúdo canônico de backups e experimentos; então criar o remoto e publicar somente o conjunto aprovado. Em seguida, importar na Vercel, configurar Framework Preset Other, Root Directory ., build desativado e Output Directory ., e verificar a rota /, módulos e spritesheets no ambiente publicado.


## Resultado da publicação inicial — 2026-11-03

- Stage revisado e commitado: 70 arquivos, incluindo jogo, módulos, testes, assets, documentação, configuração da Vercel e CI. Backups da pasta Planejamento/Arquivo/Backups/ foram ignorados; os dois backups históricos já ausentes da raiz permaneceram fora do stage e suas cópias preservadas no arquivo local.
- Commit: `4f5b793` (`chore: prepare Guilda for GitHub and Vercel`).
- Push: concluído para `https://github.com/gcmbiel12-tech/Guilda-dos-Aventureiros.git`, branch `master`; `git ls-remote --heads origin` confirmou `4f5b7932aaf051c259a13ae0e6f02f8ae03f2900`.
- Testes: `npm test` exit code 0; 292 verificações unitárias/baseline, 13/13 cenários Puppeteer e zero erros de página. `git diff --cached --check` aprovado antes do commit.
- O workflow `.github/workflows/ci.yml` foi publicado, mas sua execução no GitHub Actions ainda precisa ser observada. Nenhum deploy Vercel foi iniciado.
- Estado local após push: `master` acompanha `origin/master`; somente duas exclusões locais preexistentes dos backups na raiz permanecem não staged. As cópias dos backups estão preservadas em `Planejamento/Arquivo/Backups/`.
- Próxima etapa: conectar o repositório à Vercel, configurar projeto estático sem build e validar o deploy e os recursos carregados.
