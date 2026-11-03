# Experimento ComfyUI — Ambiente da sede da Guilda

Data: 2026-11-02
Status: exploração concluída; nenhum conceito aprovado para integração.

## Pergunta do experimento

A geração local de imagens consegue criar um ambiente que melhore a fantasia de administrar uma guilda, mantendo a interface legível e coerente com o jogo?

## Contexto do produto

A experiência é sobre administrar a Guilda, não controlar diretamente um herói. A sede deve comunicar recepção de aventureiros, contratação, organização de contratos e preparação de jornadas. O HTML atual usa painéis claros em creme/bege, marrom, detalhes dourados, tipografia serifada e UI relativamente compacta.

## Ambiente de geração

- ComfyUI Desktop local, versão 0.43.2.
- Checkpoint: `v1-5-pruned-emaonly-fp16.safetensors` (Stable Diffusion 1.5).
- GPU: NVIDIA RTX 3050 Laptop, 4 GB VRAM; RAM do sistema: 8 GB.
- Resolução: 640×384, batch 1.
- Sampler: Euler; scheduler normal.
- Sem serviços, APIs, créditos ou custos externos.
- Os quatro PNGs foram gerados localmente e copiados para `NPC/Sede/`; originais de NPC não foram tocados.

## Gerações

| Arquivo | Seed | Steps | CFG | Observação |
|---|---:|---:|---:|---|
| `sede_conceito_v01.png` | 24110820261102 | 20 | 6.0 | Paleta acolhedora, mas imagem lavada, textura de papel e baixo contraste |
| `sede_conceito_v02.png` | 24110820261103 | 24 | 7.0 | Mais nítida, porém paredes verde/teal, sinais e detalhes incoerentes; lembra restaurante |
| `sede_conceito_v03.png` | 24110820261104 | 24 | 7.0 | Melhor paleta quente e composição de salão; ainda parece restaurante/refeitório, com inscrições artefatuais |
| `sede_conceito_v04.png` | 24110820261105 | 26 | 7.2 | Madeira e luz coerentes, mas composição virou sala de recepção residencial; não comunica a sede de guilda |

## Teste de uso na interface

Criado `NPC/Sede/preview.html`, uma comparação isolada entre:
- A: cabeçalho e painéis atuais, sem imagem;
- B: imagem v03 em uma faixa hero com escurecimento, texto e indicadores por cima.

A prévia foi verificada em Chromium/Puppeteer:
- Imagem carregada: 640×384.
- Desktop: captura gerada.
- Mobile 390 px: documento com 390 px de largura, sem rolagem horizontal.
- Zero erros de página.

## Avaliação

**Resultado: o ComfyUI consegue produzir imagens visualmente atraentes, mas este checkpoint e estes prompts ainda não produzem um cenário pronto para o jogo.**

Problemas observados:
1. O modelo interpreta "guild hall" como pub, restaurante, sala de jantar ou recepção doméstica.
2. Insiste em pseudoescritas, placas e marcas ilegíveis.
3. A composição não representa com clareza os pontos funcionais necessários: balcão de recrutamento, mural de contratos, mapa/planejamento e circulação.
4. O estilo é mais próximo de render/ilustração arquitetônica realista do que da UI simples e ilustrada do jogo.
5. Como faixa hero, a imagem adiciona atmosfera, mas ocupa espaço vertical e não demonstra, sozinha, ganho suficiente para justificar integração.

A versão v03 foi usada na comparação porque tem a paleta mais próxima da interface, não porque tenha sido aprovada. Nenhuma imagem está aprovada como asset final.

## Decisão técnica

- Manter as quatro imagens apenas como experimentos.
- Não integrar cenário no HTML principal ainda.
- Não alterar a interface, mecânicas, saves ou sprites.
- A próxima rodada, se houver, deve mudar a abordagem, não apenas repetir prompts: experimentar composição 2D estilizada/ilustração de jogo, referências visuais próprias e um layout com zonas funcionais bem separadas. Avaliar também uma imagem de fundo mais simples, para uso parcial atrás dos painéis, em vez de uma cena arquitetônica completa.
- Se a qualidade/legibilidade não melhorar, aceitar que SD 1.5 local nesta configuração não é a ferramenta adequada para o cenário final e manter a UI atual.

## Critérios para futura aprovação

- Comunicar claramente que o local é a sede administrativa de uma guilda.
- Mostrar, sem pseudo-textos, ao menos dois elementos funcionais reconhecíveis (mural de contratos, balcão de recepção, mapa de expedições, estandartes).
- Paleta e estilo compatíveis com a UI existente e com os avatares.
- Não competir com textos, controles ou cartões.
- Ter enquadramento útil em desktop e mobile, sem sacrificar espaço de jogo.
- Ter finalidade concreta e legibilidade na escala real.
- Manter origem, prompt, seed e arquivo documentados; preservar assets originais.

## Arquivos

- `NPC/Sede/sede_conceito_v01.png` até `sede_conceito_v04.png`
- `NPC/Sede/preview.html`
- `NPC/Sede/verify-preview.cjs`
- `NPC/Sede/preview-desktop.png`
- `NPC/Sede/preview-mobile.png`

Os PNGs e a prévia são experimentais, não ativos do jogo.


## Direção de cenário explorável — iteração de layout (2026-11-02)
Feedback do usuário: a referência visual isométrica 2D apresentada na conversa é mais próxima do objetivo do que os primeiros conceitos arquitetônicos. O usuário pediu uma decisão de direção mais precisa, evitando gerações aleatórias.

### Direção definida
- Produto-alvo: sede 2D explorável, não apenas uma imagem de fundo.
- Câmera: perspectiva 3/4 elevada/isométrica, com chão visível e paredes no perímetro.
- Composição funcional: mural de contratos à esquerda; balcão de recepção à direita; mesa/mapa de expedições na parede do fundo; estandartes da Guilda; área central ampla e conectada para circulação.
- Cenário deve ser gerado sem personagens, textos ou letreiros. Aventureiros serão sprites independentes; pontos de interação serão elementos da interface posicionados sobre locais funcionais.
- V02 original fica como referência secundária para madeira e iluminação, não para composição.

### Testes direcionados no ComfyUI
- `sede_isometrica_layout_v01.png`: seed 24110820261107, 768×512, 26 steps, CFG 7.0. Resultado: folha/colagem de peças isométricas, não uma sala contínua; rejeitado para uso como mapa.
- `sede_sala_unica_v02.png`: seed 24110820261108, 768×512, 28 steps, CFG 7.2. Resultado: sala única com piso livre, mas perspectiva quase frontal/realista, sem elementos funcionais suficientes; rejeitado como cenário de jogo.
- Ambos preservados em `NPC/Sede/`; nenhum asset do jogo foi alterado.

### Conclusão técnica desta rodada
O SD 1.5 local ainda não está obedecendo simultaneamente à perspectiva isométrica, à composição de sala única e à direção ilustrada. Repetir prompts semelhantes seria geração aleatória, não progresso. A próxima tentativa deve usar uma referência visual controlada (imagem aprovada como base ou blockout próprio) e img2img com denoise baixo/moderado, ou construir primeiro um blockout isométrico simples e usar IA apenas para acabamento. Não aprovar imagem por beleza isolada.

### Critérios objetivos de aprovação
1. Uma única sala contínua, sem painéis/colagens.
2. Perspectiva elevada 3/4 consistente, com piso legível para navegação.
3. Centro e corredores livres para sprites caminharem.
4. Pelo menos três áreas funcionais visualmente reconhecíveis: contratos, recepção, planejamento.
5. Estilo 2D ilustrado, paleta madeira/creme/bordô/dourado compatível com a identidade do jogo.
6. Sem pseudo-texto, pessoas, personagens ou marcas geradas.
7. Recorte e escala adequados para desktop e mobile.


## Blockout espacial da sede — 2026-11-02
- Criado `NPC/Sede/blockout.html`, um protótipo vetorial isolado de uma sala isométrica única, para validar a planta antes de pedir acabamento visual à IA.
- Distribuição: mural de contratos à esquerda, recepção à direita, mesa de planejamento ao fundo, estandartes e área central livre. A estrutura não contém personagens finais nem depende de assets externos.
- O aventureiro marcador pode ser movido clicando no piso; os três pontos funcionais são selecionáveis e anunciam a função prevista.
- Verificador `NPC/Sede/verify-blockout.cjs` executado via Puppeteer: 3 zonas detectadas, seleção da recepção confirmada, viewport mobile 390 px sem overflow, zero erros de página; exit code 0.
- Capturas: `NPC/Sede/blockout-desktop.png` e `blockout-mobile.png`.
- Este blockout é uma prova de composição/navegação, não arte final nem integração no jogo. Próxima evolução: validar escala/rotas de personagens e usar o blockout como referência controlada para acabamento visual.

## Acabamento guiado pelo blockout — 2026-11-02

### Objetivo e método
- Exportado o SVG do blockout para PNG em NPC/Sede/blockout-reference.png (742×502), sem alterar o protótipo original.
- Primeira tentativa img2img no ComfyUI: SD 1.5, 744×504, seed 2026110201, 20 steps, CFG 5.5, DPM++ 2M/Karras, denoise 0.30. Execução confirmada como success; arquivo blockout-acabamento-v01.png.
- A primeira saída preservou a disposição geral, mas reproduziu os rótulos como pseudo-inscrições. Rejeitada.
- Correção do método: exportação limpa ocultando .zone-label, .small e #hero, gerando blockout-reference-clean.png. Upload explícito confirmado na entrada do ComfyUI.
- Segunda tentativa img2img: SD 1.5, 744×504, seed 2026110202, 22 steps, CFG 5.0, DPM++ 2M/Karras, denoise 0.27. Execução confirmada como success; arquivo blockout-acabamento-v02.png.

### Avaliação da segunda saída
- Preserva a sala única, perspectiva, paredes, piso e posições das três estações.
- Removeu pseudo-textos e personagem de teste por terem sido removidos da referência, não por capacidade confiável do modelo de desenhar texto.
- O acabamento mudou pouco em relação ao blockout: formas continuam simples e a textura adicional é discreta. Não há ganho visual/funcional suficiente para integrar.
- O primeiro resultado permanece arquivado como evidência do problema de pseudo-texto; ambos são experimentos isolados.

### Decisão
ENCERRAR as gerações de cenário com este checkpoint/pipeline nesta direção. Não fazer uma terceira variação de prompt: o ganho marginal não justifica continuar consumindo tempo de geração. Não integrar v01 nem v02.
Manter o blockout vetorial como fonte de verdade espacial. Próxima evolução da sede deve ser manual e funcional: navegação do personagem por caminhos válidos, colisão com mobiliário e hotspots reais para contratos, recepção e planejamento. Depois, produzir arte em camadas com formas e texturas controladas; IA local fica reservada a props/elementos isolados se houver benefício demonstrável.

### Arquivos acrescentados
- NPC/Sede/blockout-reference.png
- NPC/Sede/blockout-reference-clean.png
- NPC/Sede/blockout-acabamento-v01.png
- NPC/Sede/blockout-acabamento-v02.png
- NPC/Sede/export-reference.cjs
- NPC/Sede/export-reference-clean.cjs

### Validação
- As duas chamadas img2img foram aceitas sem erros de nós e terminaram com status success; ambas as imagens de 744×504 foram recuperadas para o projeto.
- npm test: exit code 0; sintaxe dos quatro módulos e script inline OK; 7 domínio + 9 GuildService + 8 JourneyService + 6 GameLoop + 7 baseline econômico + 11 PersistenceService; 13/13 regressões Puppeteer; zero erros de página.
- git diff --check: exit code 0; avisos apenas de normalização LF/CRLF nos arquivos rastreados.
- Nenhum arquivo do jogo principal, save, regra de domínio ou sprite ativo foi modificado nesta rodada.
