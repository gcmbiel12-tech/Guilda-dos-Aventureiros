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