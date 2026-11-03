# Guilda dos Aventureiros

Jogo de gerenciamento de guilda executado no navegador. A versão atual é um site estático: não exige etapa de compilação nem dependências externas em tempo de execução.

## Executar localmente

1. Instale Node.js 22.12.0 ou superior.
2. Na pasta do projeto, instale as dependências de desenvolvimento:

   ```bash
   npm ci
   ```

3. Abra `Guilda dos Aventureiros.html` diretamente no navegador ou inicie um servidor HTTP local:

   ```bash
   python -m http.server 8000
   ```

   Acesse http://localhost:8000/Guilda%20dos%20Aventureiros.html.

## Testes

Execute a suíte completa:

```bash
npm test
```

Os testes incluem verificações de sintaxe, testes unitários dos serviços e regressões de navegador com Puppeteer. O Puppeteer precisa de um navegador compatível instalado; em ambientes limpos, seu script de instalação baixa o navegador correspondente.

## Publicação

### GitHub

O repositório deve incluir o jogo, módulos JavaScript, assets necessários, testes, arquivos de configuração e documentação de planejamento. Não versionar `node_modules/`, credenciais, arquivos `.env` locais ou a pasta `.vercel/`.

A integração contínua em `.github/workflows/ci.yml` executa `npm ci` e `npm test` em pushes e pull requests.

### Vercel

O projeto é estático e não possui etapa de build. Importe o repositório na Vercel e configure:

- Framework Preset: **Other**
- Root Directory: **.**
- Build Command: vazio / desativado
- Output Directory: **.**

O `vercel.json` encaminha a rota inicial `/` para o HTML atual do jogo. Os módulos e sprites permanecem em seus caminhos relativos.

## Estado e salvamentos

O jogo atual usa armazenamento local do navegador (`localStorage`) e mantém compatibilidade com o formato `guildaSave` v2. Isso significa que os dados ficam no navegador/dispositivo de cada jogador e não são sincronizados automaticamente entre dispositivos. Uma futura conta online exigirá backend, autenticação e banco de dados; não faz parte desta configuração estática.

## Documentação do projeto

A pasta `Planejamento/` contém a fonte oficial de requisitos, arquitetura, progresso, decisões e referências. Consulte `Planejamento/README.md` antes de alterar o projeto.
