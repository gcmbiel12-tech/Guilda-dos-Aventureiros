# Instruções do projeto — Guilda dos Aventureiros

## Fonte central
- A pasta `Planejamento/` é o ponto principal e a única fonte oficial de planejamento e documentação.
- Antes de cada tarefa, leia `Planejamento/README.md`, `Planejamento/AGENTS.md`, `Planejamento/PLANO_MESTRE.md`, `Planejamento/ARQUITETURA.md` e `Planejamento/PROGRESSO.md`; consulte `Planejamento/RELATORIO_ETAPA.md` quando necessário.
- Atualize os documentos oficiais dentro de `Planejamento/`. Não crie cópias concorrentes na raiz.
- Preserve referências originais em subpastas temáticas e diferencie requisitos confirmados, propostas e decisões pendentes.

## Papel e execução
- Atue com autonomia: planeje, implemente, teste, corrija, registre evidências e avance para a próxima tarefa viável.
- Use OpenCode como executor local quando disponível; confirme arquivos e resultados reais.
- Trabalhe na menor alteração segura que entregue valor. Evite refatorações amplas sem justificativa.
- Não invente arquivos, funções, requisitos ou resultados de testes.

## Arquitetura e compatibilidade
- Evolua POO e separação de responsabilidades incrementalmente.
- Mantenha regras de domínio testáveis sem DOM sempre que viável.
- Preserve o funcionamento local sem dependências externas de runtime, salvo decisão documentada.
- Preserve compatibilidade dos salvamentos existentes; mudanças de formato exigem migração e testes explícitos.
- Considere PWA progressivamente: instalação, responsividade, offline e atualização.

## Segurança
- Antes de editar, confira o Git e identifique alterações locais preexistentes.
- Não use `git reset`, não descarte alterações, não exclua backups e não faça stage ou commits sem autorização.
- Não inicie processos concorrentes que alterem os mesmos arquivos; investigue processos travados.
- Não instale dependências, use serviços pagos ou crie credenciais sem necessidade demonstrada e autorização quando houver custo/risco.
- Preserve assets originais e salvamentos; não substitua imagens experimentais sem avaliação.

## Protocolo de entrega
1. Defina objetivo, escopo e critérios de aceitação.
2. Inspecione arquivos e dependências relevantes.
3. Implemente somente o escopo necessário.
4. Execute testes proporcionais e revise regressões.
5. Atualize `Planejamento/PROGRESSO.md` e os demais documentos pertinentes.
6. Substitua `Planejamento/RELATORIO_ETAPA.md` somente após consolidar o estado anterior importante.
7. Informe arquivos alterados, testes e resultados reais, limitações e próxima ação.

A etapa só está concluída quando implementada, testada, revisada e documentada. Planejamento não substitui entrega.
