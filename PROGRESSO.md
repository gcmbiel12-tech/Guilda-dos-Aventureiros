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