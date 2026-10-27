# Progresso — Guilda dos Aventureiros

Última atualização: 2026-10-27

## Situação
- Fase registrada no `PLANO_MESTRE.md`: confiabilidade em andamento; próxima prioridade é auditar regras de jornada e depois refatorar domínio incrementalmente.
- Arquivo de jogo confirmado: `Guilda dos Aventureiros.html`.
- Backup disponível: `Guilda dos Aventureiros.html.bak` e `Guilda dos Aventureiros.pre-POO.html.bak`.
- O plano registra verificações de persistência e testes automatizados anteriores. Esses resultados são históricos e precisam ser reproduzidos antes de servir como baseline atual.

## Preparação da comunicação entre agentes — 2026-10-27
- [x] Inspecionar a raiz e ler o plano mestre e o HTML atual.
- [x] Confirmar OpenCode instalado (versão observada: 1.19.4) e Node.js disponível (v26.12.1).
- [x] Definir `AGENTS.md` como instruções locais para o OpenCode.
- [x] Criar este registro e a descrição inicial da arquitetura.
- [ ] Estabelecer controle de versão Git e registrar o baseline atual.
- [ ] Diagnosticar falha ao iniciar comandos do OpenCode: `opencode providers list` retornou `Database is not empty and has no session table`.
- [ ] Identificar e validar um provedor/modelo autenticado para o OpenCode.
- [ ] Restaurar ou reconstruir a suíte de testes; um teste citado no histórico não estava presente na raiz quando verificado.
- [ ] Executar testes de baseline reproduzíveis antes de mudanças de gameplay.

## Próxima tarefa
1. Estabelecer baseline Git sem descartar os backups.
2. Diagnosticar o banco local do OpenCode sem apagar nem sobrescrever dados.
3. Validar o funcionamento de uma execução pequena via `opencode run` somente após confirmar provedor/modelo.
4. Auditar e testar resolução de missão, falha, seguro e campanha antes da refatoração POO.

## Registro de alterações
- 2026-10-27: criados `AGENTS.md`, `ARQUITETURA.md` e `PROGRESSO.md` para instruções locais, arquitetura observada e comunicação durável entre agentes.
- 2026-10-27: a listagem atual não encontrou o arquivo `domain-test.cjs`, embora ele tenha aparecido em contexto anterior; não presumir que o teste exista. O histórico de testes do plano é mantido como histórico, não como execução atual.
## Resultados adicionais da preparação — 2026-10-27
- Git inicializado; baseline registrado no commit `f9240a9` (`chore: establish Guilda project baseline`). O commit inclui o jogo, os dois backups e os documentos de coordenação.
- Após o commit, foram observadas alterações de trabalho em `Guilda dos Aventureiros.html` e `PLANO_MESTRE.md`, além de um teste temporário `insurance-test.cjs`. Não foram descartadas nem incluídas no commit inicial; precisam ser revisadas como alterações de trabalho.
- O teste automatizado de falha com seguro foi executado e retornou `PASS`: aventureiro sobreviveu, seguro foi consumido, recursos/resultados esperados e zero erros de página. O arquivo temporário do teste não estava mais presente na inspeção seguinte; recuperar ou recriar a suíte de forma estável antes de depender dela.
- A instalação global `opencode` aponta para a versão 1.19.4 e falha ao consultar provedores por incompatibilidade de esquema do banco (`Database is not empty and has no session table`). O banco foi inspecionado em modo somente leitura: `PRAGMA integrity_check` retornou `ok` e há tabelas `session_v2`; nenhum dado foi apagado ou alterado.
- A instalação do OpenCode Desktop contém CLI versão 2.1.3 em `%APPDATA%\ai.opencode.desktop\cli\2.1.3-x64\opencode-cli.exe`; essa CLI lista modelos `opencode/*-free`, mas `auth list` informa que não há integrações autenticadas. Preferir esta CLI à instalação global antiga, sem corrigir ou apagar o banco da versão antiga por enquanto.
- Uma chamada de diagnóstico somente leitura via `opencode-cli run --model opencode/beam-free` foi iniciada, mas ainda não produziu saída no momento do registro; portanto a execução real do agente ainda não está validada.

## Próximas ações atualizadas
1. Obter o resultado ou diagnosticar a chamada `opencode-cli run` de somente leitura.
2. Confirmar se os arquivos modificados por atividade concorrente estão concluídos; revisar e executar os testes correspondentes antes de incluí-los em commit.
3. Estabelecer uma suíte de testes persistente e reproduzível, evitando arquivos temporários que desaparecem.
4. Só então formalizar o ciclo de tarefa: instrução no projeto → implementação via OpenCode → testes → revisão → atualização dos documentos.
