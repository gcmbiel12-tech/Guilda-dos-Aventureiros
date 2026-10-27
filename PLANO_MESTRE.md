# Guilda dos Aventureiros — Plano Mestre
Versão: 1.1
Última revisão: 2026-10-27
Status: Fase de confiabilidade em andamento; persistência principal e testes de fumaça aprovados.

## 1. Objetivo
Evoluir o protótipo existente para um jogo incremental de gerenciamento de guilda, com desenvolvimento conduzido pela IA de forma autônoma sempre que possível. Preservar funcionalidades existentes e evitar mudanças de arquitetura sem justificativa e validação.

## 2. Estado atual confirmado
- A raiz contém o arquivo `Guilda dos Aventureiros.html`.
- O protótipo está implementado em um único HTML com CSS e JavaScript embutidos.
- Sistemas existentes: ouro, reputação, nível do salão, pergaminhos/prestígio, recrutamento, classes, raridades, roster, seleção de grupo, seguro, missões temporizadas, jornadas, recompensas e campanha de quatro etapas.
- A persistência inicial gravava somente `scrolls` e `campaignStage`; foi ampliada para o estado principal e agora usa o formato versionado `v2`.
- O salvamento ocorre em ações relevantes, periodicamente e no evento `pagehide`; jornadas são reconstruídas usando os catálogos de missões para evitar dependência de identidade de objeto.
- O carregamento valida campos essenciais dos aventureiros e rejeita registros com nome, classe, raridade, poder ou custo inválidos.
- Não foram encontrados outros arquivos ou diretórios na listagem inicial da raiz.
- A arquitetura ainda mantém o estado e a interface dentro de uma função anônima, mas já possui as classes de domínio `Mission` e `CampaignMission`; a segunda herda da primeira e sobrescreve `applyRewards` para avançar a campanha polimorficamente.

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
- [ ] Rejeitar IDs duplicados entre o roster e a taverna durante o carregamento.
- [x] Testar conclusão em tempo real, recompensa e avanço da primeira etapa da campanha.
- [ ] Testar falha, consumo do seguro e os quatro capítulos da campanha.

### Prioridade média
- Verificar regras de sucesso, risco, seguro, recompensa e progressão da campanha.
- Revisar ações de botões e estados desabilitados para evitar gastos ou despachos inválidos.
- Melhorar legibilidade e acessibilidade da interface sem alterar desnecessariamente seu estilo.
- Estabelecer testes de regressão para as principais regras.

### Prioridade estrutural
- Extrair progressivamente o domínio do HTML para módulos separados, caso o ambiente de execução permita sem comprometer a simplicidade de abrir o jogo localmente.
- Introduzir classes com responsabilidades claras, por exemplo: estado/gerenciador da guilda, aventureiro, missão e serviço de persistência. Os nomes finais devem acompanhar a implementação real.
- Criar testes para regras puras antes de ampliar os sistemas.

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
- Separar regras de negócio da renderização.
- Introduzir POO progressivamente, com encapsulamento e polimorfismo apenas onde apropriado.
- Preservar o formato simples de execução local sempre que viável.
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

## 8. Registro de execução
- 2026-10-27: acesso remoto autorizado e raiz inspecionada.
- 2026-10-27: arquivo HTML de 323 linhas lido integralmente.
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
- 2026-10-27: criado backup pré-refatoração `Guilda dos Aventureiros.pre-POO.html.bak`.
- 2026-10-27: confirmado que a pasta não é um repositório Git; as cópias `.bak` são os pontos de retorno disponíveis.
- Limitação da validação: ainda falta testar falhas, consumo do seguro e os quatro capítulos da campanha em conjunto.
- Próxima ação: validar fluxos de falha/seguro e revisar regras de progressão; depois continuar a separação das entidades e serviços do estado da interface.
