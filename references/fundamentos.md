# Fundamentos de design

Regras que valem em qualquer direção visual. Elas não dizem como a tela deve parecer; dizem como saber se ela está bem resolvida. Quando duas escolhas parecem boas, ganha a que cumpre mais destes pontos.

## 1. Hierarquia

- **Um ponto focal por tela.** Faça o teste de apertar os olhos (ou desfocar o print): a primeira mancha que aparece tem que ser a informação mais importante. Se três coisas brigam, diminua duas.
- **Três níveis, no máximo quatro:** principal (o que responde a pergunta), apoio (contexto e comparação), detalhe (lista, rodapé, metadado). Cada nível com o mesmo tratamento em toda a tela.
- **Ferramentas de hierarquia, nesta ordem:** posição (em cima à esquerda lê primeiro), tamanho, peso, contraste de claridade, cor. Cor é a última: se só a cor separa os níveis, a hierarquia está fraca.
- **Peso visual de bloco:** um bloco grande e vários pequenos leem melhor que vários iguais. Tamanho do bloco segue a importância, não a quantidade de dado.
- **Rótulo menor que valor.** O dado é protagonista; o rótulo é legenda (menor, cinza, peso normal).

## 2. Espaço

- **Escala de espaçamento de 4 px** (4, 8, 12, 16, 24, 32, 48, 64). Nada de 13, 18, 22 px soltos. Cada degrau tem um papel e os valores padrão foram escolhidos pelo usuário: veja `medidas.md`.
- **Proximidade diz o que é grupo:** o espaço dentro de um grupo é no máximo metade do espaço entre grupos (rótulo a 4 px do valor, valor a 16 px do próximo par). Espaços iguais em tudo deixam a tela sem estrutura.
- **Padding do container ≥ espaço entre os filhos.** Se o conteúdo encosta mais na borda do que nos vizinhos, parece apertado.
- **Respiro é ativo:** espaço vazio em volta do ponto focal ajuda; espaço vazio dentro de um cartão por falta de conteúdo é vão (ver SKILL.md, simetria).
- **Densidade escolhida uma vez** (compacta, confortável, espaçosa) e mantida no app inteiro. Tabela pode ser mais compacta que o resto, nunca mais solta.

## 3. Grade e alinhamento

- **Uma grade por tela** (ex.: 12 colunas); todos os blocos começam e terminam em linhas dela. Bordas de cartões de faixas diferentes alinham de cima a baixo.
- **Poucos eixos verticais.** Conte as linhas imaginárias onde os elementos começam: quanto menos, mais limpa a tela. Um texto que começa 6 px à direita dos outros parece erro.
- **Texto alinhado à esquerda**; números alinhados à direita em colunas (para as casas baterem); centralizado só em elemento isolado (estado vazio, número único de um medidor).
- **Alinhamento óptico:** ícone e texto centrados pela altura da letra, não pela caixa; ícones com mais massa de um lado (play, seta) andam 1 px para compensar.
- **Linha de base:** em uma linha com textos de tamanhos diferentes (número grande + unidade pequena), alinhe pela base (`items-baseline`), não pelo centro.

## 4. Tipografia

- **Escala modular:** escolha uma razão (1,2 para ferramenta densa; 1,25 neutra; 1,333 editorial) e derive 5 ou 6 tamanhos. Exemplo 1,25: 12, 14, 16, 20, 25, 31. No máximo três tamanhos dentro de um cartão.
- **Altura de linha:** 1,5 no corpo, 1,3 em texto curto de interface, 1,1 a 1,2 em títulos grandes. Títulos grandes com espaçamento entre letras levemente negativo (`tracking-tight`); texto pequeno nunca apertado.
- **Pesos:** 400 corpo, 500 rótulo e título de cartão, 600 título e número de destaque. 700 raro; 800 e 900 só em fonte de exibição.
- **Medida:** parágrafo entre 45 e 75 caracteres por linha (`max-w-[65ch]`, sem centralizar a página).
- **Títulos sem palavra sozinha na última linha:** `text-wrap: balance` em títulos, `text-wrap: pretty` em parágrafos.
- **Números:** `tabular-nums` em colunas, tabelas, eixos e qualquer número que muda; formato do idioma (1.234,56; 12 nov; 14h30). Unidade menor e cinza ao lado do número.
- **Duas famílias no máximo:** uma de exibição (títulos, números grandes) e uma de texto. Fonte com personalidade vai nos títulos; no corpo, legibilidade.

## 5. Cor

- **Claridade antes de matiz.** A hierarquia de superfícies (fundo, cartão, elevado) e de texto (principal, secundário, apagado) é feita com claridade. A matiz entra para significado.
- **60/30/10:** cerca de 60% de neutro de fundo, 30% de superfícies e texto, 10% (ou menos) de cor de destaque.
- **Neutros com temperatura:** cinza puro é frio e sem personalidade; tinja levemente os neutros com a matiz da marca ou com quente/frio (croma de 0,005 a 0,015 em OKLCH). É o jeito mais barato de dar identidade.
- **Estados derivados, não cores novas:** hover, pressionado, selecionado e desabilitado saem da mesma cor (mistura com o fundo, mais ou menos claridade), nunca uma matiz diferente.
- **No escuro, menos saturação e mais claridade** na cor de destaque; fundo quase preto com leve tom, nunca `#000` puro com texto `#fff` puro (vibra).
- **Nunca só a cor carrega a informação:** acompanhe de ícone, seta, rótulo ou posição.
- **Contraste mínimo:** texto 4,5:1; texto grande, ícone e marca de gráfico 3:1. O `scripts/paleta.mjs check` confere tudo isso nos dois temas.

## 6. Forma e profundidade

- **Um raio para o app**, aplicado em escala: elemento interno = raio externo menos o padding (cartão 16 com padding 8 → item 8). Raios diferentes em vizinhos parecem descuido.
- **Profundidade por superfície, não por sombra.** Fundo → cartão → elemento elevado, cada um um degrau de claridade. Sombra só no que flutua sobre a página (menu aberto, balão, modal), suave e curta.
- **Cartão nunca tem borda** (reprovado na calibragem). Cartão é degrau de cor, com sombra suave se a direção pedir; superfície única usa divisórias de 1 px. Raio do cartão de 16 a 24 px.
- **Ícones de uma família só**, mesmo traço e tamanho por contexto (16 em linha de texto, 18 a 20 em menu, 20 a 24 em destaque).

## 7. Consistência e ritmo

- **O que é igual parece igual; o que é diferente parece diferente.** Duas listas do mesmo tipo usam o mesmo componente. Um alerta não pode parecer um chip de categoria.
- **Um componente por papel:** um tipo de botão principal, um de secundário, um chip de status, um de variação. Novidade visual precisa de motivo.
- **Ritmo:** repetição de medidas (mesma altura de linha, mesmo espaço entre seções) deixa a tela calma; quebre o ritmo só para chamar atenção ao ponto focal.

## 8. Estados (desenhe todos, não só o feliz)

Para cada bloco: **vazio** (primeira vez, filtro sem resultado), **carregando**, **erro**, **parcial** (dados incompletos), **um item**, **muitos itens**, **texto longo** (nome de 60 caracteres), **número grande** (R$ 1.234.567,89), **sem permissão**. A tela continua simétrica em todos. Teste com dados reais e com os extremos.

## 9. Formulários

- Campo preenchido, sem borda, 44 px de altura, foco com anel neutro de 2 px (contorno e linha embaixo foram reprovados).
- Rótulo em cima do campo, curto; ajuda só no "i" ou numa linha cinza quando indispensável; erro embaixo do campo, na hora, dizendo como corrigir.
- Largura do campo pelo conteúdo esperado (CEP curto, nome longo), agrupando campos relacionados na mesma linha no web.
- **Um botão principal por tela**, com verbo ("Salvar aposta", não "OK"). Ação destrutiva pede confirmação e fica longe da principal.
- Alvo de toque com no mínimo 44 px de altura no celular; teclado certo (`inputMode="numeric"`, `type="email"`).

## 10. Movimento

- Interface: 150 a 250 ms, `ease-out` para entrar, `ease-in` para sair. Gráficos: entrada de 600 a 900 ms.
- Movimento explica (de onde veio, para onde foi), nunca decora. Nada pulsa à toa, nada atrasa a pessoa.
- `prefers-reduced-motion`: sem animação, tudo na posição final.

## 11. Acessibilidade

- Foco visível e neutro no teclado; ordem do Tab segue a leitura.
- Todo ícone sozinho com `aria-label`; gráfico com resumo em texto ou tabela acessível.
- Hierarquia de títulos real (`h1` uma vez, `h2` por seção).
- Zoom de 200% sem quebrar; nada depende de hover para funcionar (no celular não existe).

## 12. Acabamento (o que separa bom de ótimo)

- Nenhum elemento "quase" alinhado: ou alinha, ou se afasta de propósito.
- Ícone e texto da mesma linha com a mesma altura visual.
- Número e unidade sem quebra entre eles (`whitespace-nowrap` no par).
- Lista e tabela com cabeçalho alinhado às colunas de dado.
- Valores ausentes com palavra ("Sem dados"), nunca vazio, traço ou "null".
- Imagens e avatares com proporção fixa e fundo enquanto carregam, sem pular o layout.
- Transição de tema sem piscar; nenhum elemento que só funciona num tema.
