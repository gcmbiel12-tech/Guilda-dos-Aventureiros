# Instruções do projeto — Guilda dos Aventureiros

## Papel e fluxo
- Antes de qualquer tarefa, leia `PLANO_MESTRE.md`, `ARQUITETURA.md` e `PROGRESSO.md`.
- Trabalhe na menor alteração segura que cumpra a tarefa. Não faça reescritas amplas nem mudanças de arquitetura sem justificativa registrada.
- Preserve as funcionalidades existentes e mantenha a execução local do jogo sem dependências externas, salvo decisão documentada.
- Antes de editar, inspecione os arquivos relevantes e identifique a causa concreta do problema.
- Não invente arquivos, funções, IDs, sistemas ou resultados de testes.

## POO e arquitetura
- Evolua a orientação a objetos de forma incremental.
- Use classes para entidades e serviços com responsabilidades reais; use polimorfismo quando comportamentos forem genuinamente diferentes.
- Mantenha regras de domínio testáveis sem DOM sempre que viável.
- Preserve compatibilidade com salvamentos existentes; mudanças de formato exigem migração e testes explícitos.

## Segurança e alterações
- Não sobrescreva nem remova backups sem autorização.
- Não descarte alterações locais. Antes de grandes mudanças, confira o estado do Git e registre um ponto de retorno.
- Não instale dependências nem altere configurações globais sem necessidade demonstrada.
- Não use aprovação automática ampla. Solicite autorização quando uma operação irreversível, credencial, custo ou risco relevante exigir intervenção.

## Protocolo de tarefa
1. Registre objetivo, escopo, arquivos previstos e critérios de aceitação.
2. Implemente somente o escopo acordado.
3. Execute os testes disponíveis; não declare sucesso sem evidência.
4. Revise regressões e compatibilidade.
5. Atualize `PROGRESSO.md` e, se necessário, `PLANO_MESTRE.md`/`ARQUITETURA.md`.
6. Informe arquivos alterados, verificações executadas, resultado, limitações e próxima tarefa.

## Comunicação entre agentes
- O planejamento e o estado durável do projeto ficam nos arquivos versionados, não apenas no histórico de conversa.
- O ChatGPT atua como diretor técnico/revisor; o OpenCode como executor de tarefas locais.
- Se instruções ou arquitetura forem ambíguas, não invente uma decisão de produto: registre a dúvida e peça esclarecimento apenas quando bloquear o avanço.
## Diretriz de autonomia, produção e entrega
- Atue com iniciativa como diretor técnico: analise, planeje, implemente, teste, corrija, registre evidências e avance para a próxima tarefa viável sem pedir autorização para decisões técnicas rotineiras e reversíveis.
- Não pare o ciclo de trabalho depois de uma única subtarefa pequena. Agrupe tarefas relacionadas em etapas de entrega significativas, respeitando dependências, risco e capacidade de validação.
- A etapa só é considerada concluída quando o resultado previsto foi implementado, verificado por testes proporcionais, revisado quanto a regressões e registrado na documentação. Não confunda planejamento com entrega.
- O OpenCode é o agente executor local quando sua execução estiver disponível; confirme as saídas e os arquivos reais. Nunca afirme execução ou aprovação sem evidências.
- O formato inicial de distribuição é PWA. Planeje instalação, responsividade, operação offline, persistência e atualização progressivamente, sem antecipar complexidade que não seja necessária à etapa atual.
- Preserve a identidade visual já aprovada: cores, cards e hierarquia visual do HTML atual são referências de produto. Mudanças visuais devem melhorar a experiência sem descaracterizá-la.
- Preserve alterações locais, backups e salvamentos existentes. Não use reset, não descarte mudanças, não faça commits sem autorização e não altere formato de salvamento sem migração e testes explícitos.
- Ao final de cada etapa, atualize o progresso e substitua RELATORIO_ETAPA.md somente após consolidar nele o estado, os testes, as limitações e a próxima ação. Mantenha relatórios objetivos e sem histórico redundante.
- Ao identificar um problema, informe seu impacto, evidência, solução recomendada e se existe bloqueio real. Solicite intervenção apenas diante de decisão de produto importante, risco irreversível, custo/credencial ou informação essencial ausente.
- Critério principal de sucesso: funcionalidades reais, comportamento validado, arquitetura sustentável, continuidade de desenvolvimento e progresso verificável. Planejar inicia o trabalho; executar e verificar é o que o entrega.
