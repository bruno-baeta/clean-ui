---
name: clean-ui
description: Clean UI, regras de design de interface (dados primeiro, cabe na tela, dois temas, cara de produto feito por gente) para qualquer trabalho de front-end (telas, componentes, cards, listas, gráficos, e-mails HTML, ajustes de layout, mobile e web). Use sempre que for criar, ajustar ou revisar UI, CSS, Tailwind ou componentes React/Next, antes de mostrar prints ou publicar.
---

# Clean UI

Interface com dados em primeiro lugar, que cabe na tela, funciona nos temas claro e escuro e tem cara de produto feito por gente, não por IA.

**A skill não define a cara do produto.** Ela tem três camadas:

1. **Proibido.** Coisas que já irritaram o usuário de verdade. Nunca acontecem, em nenhum estilo.
2. **Acabamento obrigatório.** Cabe na tela, simetria, dois temas, contraste, estados. Os scripts medem.
3. **Escolhas suas.** Paleta, fonte, raio, densidade, superfície, composição, assinatura e detalhes. Você decide pelo assunto e pelo plano de informação, guiado por `references/fundamentos.md` e `references/direcao-visual.md`.

Duas telas de projetos diferentes feitas com esta skill **não devem parecer a mesma tela com outro logo**. Seguir as regras é o mínimo; o design é a parte 3.

## Arquivos da skill

Caminhos relativos à pasta desta skill.

| Arquivo | Quando usar |
|---|---|
| `references/informacao.md` | **Toda tela nova ou redesign, antes do layout.** O que mostrar, em que ordem e onde (inventário, perguntas do usuário, níveis, filtro, mapa de posições, plano escrito). |
| `references/direcao-visual.md` | **Todo projeto novo e todo redesign.** Como escolher a cara do projeto: direção em 5 linhas, eixos para variar, repertório de composições, pontos de partida por assunto, sinais de template de IA e o teste da mesmice. |
| `references/fundamentos.md` | **Sempre.** Regras de design que valem em qualquer estilo: hierarquia, espaço, grade, tipografia, cor, forma, consistência, estados, formulários, movimento, acessibilidade e acabamento. |
| `references/medidas.md` | **Sempre, antes de escrever qualquer `gap`, `padding`, tamanho de texto, raio, botão ou campo.** Medidas que o usuário escolheu olhando (padding 16, 12 entre cartões, texto 15, número 36/600, botão pílula de 40), o que ele reprovou (cartão com borda, raio pequeno, zebra, campo com contorno), o sistema de espaçamento por papel e o sistema de alinhamento. |
| `references/armadilhas.md` | Erros técnicos que já custaram retrabalho (Tailwind v4, `cn` sem merge, next-themes, servidor com CSS velho, lista que quebra no celular, cartão que estica). Leia antes de escrever o código. |
| `references/exemplos.md` | Casos reais de errado e certo. Em dúvida se algo está bom, procure aqui. |
| `references/padroes-aprovados.md` | Blocos que o usuário aprovou (cartão de decisão, gráfico da medida com a linha do limite, situação do usuário, lista do próprio usuário). Repertório de **conteúdo**, não de visual. |
| `references/dashboards.md` | **Telas com números, gráficos ou mapas.** Amador x profissional, princípios, composições, telas largas e ultrawide, cor e acabamento dos gráficos. |
| `references/anatomia-dashboard.md` | Medidas de acabamento tiradas das 7 referências (`exemplos-dashboards/`): bons valores de partida para chips, tabela, indicador e gráfico. Valores de partida, não molde. |
| `references/paletas.md` | Como montar a paleta (papéis, regras, validação) e 4 paletas de exemplo já conferidas. |
| `references/migracao.md` | Redesenhar o app inteiro (várias telas): tela de referência aprovada primeiro, base comum, frentes paralelas, integração. |
| `assets/tokens.css` | Base técnica dos dois temas (Tailwind v4): tokens, troca de tema sem piscar, foco, mãozinha, variantes `tall`/`fit`, breakpoints `3xl`/`4xl`, animações. As cores e a fonte que vêm nele são só para funcionar de cara: troque pelas do projeto. |
| `assets/ui.tsx`, `assets/dashboard.tsx`, `assets/painel.tsx` | Componentes prontos (InfoTip com portal, ThemeToggle, NavLoading, ListaAlta com páginas pela altura, DeltaChip, useFitRows, useFitHeight, FillMap...). Use pelo comportamento já resolvido. **O visual deles é ajustável:** raio, padding, tamanhos e cores seguem a direção do projeto. |
| `scripts/paleta.mjs` | `node <skill>/scripts/paleta.mjs check src/app/globals.css` confere a paleta nos dois temas (texto, destaque, chips, séries, escala, daltonismo). `gerar --destaque=#hex` monta um ponto de partida a partir de uma cor. |
| `scripts/lint-ui.mjs` | `node <skill>/scripts/lint-ui.mjs src`: hover que move, reticências, bordas coloridas, conteúdo estreito, fontes proibidas, cor fixa ou solta, "—", " · ", minúscula, "Rótulo: valor", espaçamento fora da escala, cartão com borda ou raio pequeno, lista zebrada, campo com contorno. |
| `scripts/check-ui.mjs` | `node <skill>/scripts/check-ui.mjs http://localhost:3000/rota --out=prints`: prints em 320, 390, 1366×650, 1536×730, 1920×950, 2200×1100, 2560×960, 2560×1300, 2752×1100 e 3440×1300, nos dois temas, e mede estouro, cartão passando da borda de baixo, alturas diferentes lado a lado, vão dentro de cartão, grid incompleto, linha de lista larga demais ou quebrando, gráfico esticado, "…", ícone sem container, hover que move, scroll interno, fonte, mãozinha, texto por cima de texto, grupo de itens iguais quebrando a linha, lista partida em colunas lado a lado, bordas quase alinhadas, espaços diferentes entre cartões, recuo diferente em cartões vizinhos, texto quase alinhado, balão do "i" fora da tela e página vazia ou de erro. Precisa de Playwright no projeto; `--user`/`--pass` para páginas com senha. |

Os scripts são guias: confira cada achado e, principalmente, abra os prints e olhe.

## 1. Processo

1. **Faça só o que foi pedido.** Nunca remova, troque ou "simplifique" elementos existentes sem pedido explícito. Se a proposta exige tirar algo, pergunte antes. Na dúvida, mantenha.
2. **Respeite o breakpoint pedido.** Pediu ajuste no celular: o web não muda (e vice-versa).
3. **Tela nova ou redesign:**
   1. **Informação** (`informacao.md`): inventário, perguntas do usuário, níveis, mapa de posições.
   2. **Direção visual** (`direcao-visual.md`): personalidade, cor, tipo, forma, assinatura, em 5 linhas. Projeto que já tem identidade aprovada segue a dele; você só decide o que falta.
   3. **Composição** escolhida pela pergunta da tela, não pelo hábito.
   4. **Construa uma versão só**, a melhor. Não monte várias versões ou paletas para o usuário escolher. Na entrega, diga em poucas linhas a direção e por que cada coisa está onde está.
4. **Detalhe reprovado duas vezes = opções lado a lado.** Só quando o usuário já reprovou o mesmo detalhe duas vezes, mostre 2 ou 3 variações daquele detalhe em print. Nunca da tela inteira.
5. **Mostre antes de publicar, olhando todos os tamanhos.** Abra o print de **cada** tamanho do check (inclusive 1366, 1536 e 2752, onde tabela quebra e cartão sobra), nos **dois temas**. Trabalho de agente delegado também: confira você mesmo. Commit, push e deploy só com aprovação explícita.
6. **Depois de apagar ou recriar arquivos, reinicie o servidor de desenvolvimento** antes do check: o Tailwind pode continuar servindo o CSS antigo.
7. **Revise com a checklist (seção 11) antes de cada print.**

## 2. Escolhas suas (com critério)

Você decide, e justifica na entrega em uma linha cada:

- **Paleta:** a da marca, se houver; senão, uma cor tirada do assunto e da personalidade, montada nos papéis da seção 4 e conferida com `paleta.mjs check`. Evite repetir a cor do projeto anterior.
- **Fonte:** grotesca neutra ou humanista de qualidade, fora da lista proibida (seção 3). Pode ter uma segunda família nos títulos.
- **Forma:** um raio para o app entre 16 e 24 px, superfície (cartões em degrau de cor sem borda, com ou sem sombra suave; superfície única com divisórias; blocos tingidos). **Nunca cartão com borda.** Densidade: o padrão é o de `medidas.md` (cartão justo, padding 16, 12 entre cartões); mude só com motivo, no app inteiro.
- **Composição:** do repertório de `direcao-visual.md` ou outra, pela pergunta da tela. **A faixa de 4 indicadores + grade de cartões não é padrão**: só quando a pessoa acompanha aqueles números todo dia.
- **Assinatura:** um elemento que só este projeto tem e que também mostra dado.
- **Detalhes:** formato dos chips, estilo das marcas de gráfico, ícone em círculo ou quadrado, peso dos títulos, tratamento do cabeçalho. Coerentes entre si e com a direção.

O que não muda com o estilo: as proibições (seção 3 em diante), os fundamentos (`fundamentos.md`) e o que foi aprovado e reprovado em `medidas.md`.

## 3. Tipografia

- **Proibidas (cara de IA):** Inter, Roboto, Arial, Helvetica, system-ui como fonte de marca, Geist, Poppins, Montserrat, Space Grotesk, Open Sans, Lato.
- **Aprovadas na calibragem (2026-11-13):** grotescas neutras (Hanken Grotesk, Schibsted Grotesk, Instrument Sans, Familjen Grotesk, Albert Sans) e humanistas (Figtree, Source Sans 3, Nunito Sans). Varie dentro dessas duas famílias de um projeto para o outro.
- **Não aprovadas:** geométrica no corpo (Manrope, Onest, Outfit) e fonte de exibição só nos números (Bricolage nos números com outra no texto). Serifa em título editorial (Fraunces, Newsreader, Instrument Serif) não foi testada: só em projeto de leitura, e avise na entrega. Plus Jakarta Sans é do MegaLab, que mantém a identidade dele.
- **Tamanhos padrão:** texto base 15 px, secundário 14, chip e eixo 12, número de destaque 36 px peso 600 (`medidas.md`).
- No máximo duas famílias. Escala modular, alturas de linha e pesos em `fundamentos.md` seção 4.
- Números com `tabular-nums`. Nada de fonte mono com zero cortado ou pontilhado.
- Rótulo menor e apagado, valor maior. Valores lado a lado com o mesmo tamanho. Nada de texto gigante colorido.
- **Todo texto visível começa com maiúscula**, inclusive abreviações soltas ("Qui", "Sex"). No meio de uma frase, escreva normal ("Vs terça anterior"). Títulos em sentence case, nunca CAIXA ALTA.

## 4. Cor e tema

- **Sempre dois temas, claro e escuro.** Segue o sistema (`prefers-color-scheme`) e tem botão de troca (`ThemeToggle`), com a escolha salva. E-mails e prévias também respondem ao sistema. Nenhuma tela existe só num tema.
- **Cores sempre por token** (`bg-card`, `var(--chart-axis)`). Nada de `#000`, `#fff`, `bg-black`, `text-white`, `bg-blue-500` ou hex solto em componente, gráfico ou SVG.
- **Você monta a paleta**, mas ela tem papéis fixos (os componentes dependem deles): fundo, cartão, cartão-2, muted, borda, accent (hover), texto, texto secundário, destaque (`--primary`) e o texto sobre ele, escala ordenada de uma cor (`--seq-1..4`), séries sem ordem (`--cat-1..3`), crítico, positivo, aviso, cores de gráfico e mapa. Ponto de partida rápido: `paleta.mjs gerar --destaque=#hex`. Depois ajuste à vontade.
- **Toda paleta passa no `paleta.mjs check` sem falha**, nos dois temas: texto 4,5:1, destaque e marcas de gráfico 3:1, chips legíveis, escala que fica mais forte a cada degrau, séries distinguíveis para daltônicos.
- **Base neutra, cor com propósito.** Neutros fazem ~90% da tela (tingidos de leve para dar temperatura). Uma cor de destaque. Dado ordenado usa a escala de uma cor só, nunca arco-íris. Vermelho e amarelo de alerta só para status de verdade, com ícone e rótulo.
- **Verde e vermelho são de variação** (melhorou, piorou). Se a marca for verde ou vermelha, os chips de variação continuam claros pela seta e pelo fundo suave, e o destaque da marca não pode ser confundido com "melhorou".
- **Número nunca pintado.** Valores e rótulos na cor do texto; a cor do dado vai numa marca pequena ao lado (ponto, barra fina).
- **Variação para melhor e para pior:** chip suave verde ou vermelho, **sempre com seta**; igual em cinza (`DeltaChip`).
- Estados parecidos (Errei, Difícil, Bom, Fácil) com cores claramente diferentes entre si.
- **Sem bordas ou anéis coloridos** para destacar cartões, e **sem cartão preenchido de cor** ("péssima ideia"). Destaque só com fundo suave da cor (`bg-primary/10`).
- Escuro: fundo quase preto com leve tom, cartão um degrau acima, destaque menos saturado e mais claro. Claro: fundo levemente acinzentado ou tingido, cartão mais claro que o fundo. Os dois conferidos em print.

## 5. Layout e simetria

- **Largura total no web.** Nada de conteúdo estreito centralizado (`max-w-*` + `mx-auto` na página).
- **Tela larga ganha colunas, não estica.** De 1920 px para cima e no ultrawide 21:9, mais colunas com `3xl:` e `4xl:` (nunca `min-[1920px]:`, que perde para `lg:` no Tailwind v4), painéis que antes ficavam escondidos aparecem ao lado, e a proporção tem teto: gráfico de tempo até ~4:1, barras e mapas até ~2,5:1, linha de lista até ~720 px.
- **Mobile first.** Margem lateral de 16 px, nada apertado, carrossel com respiro, primeiro item com espaço em cima.
- **Cabe na altura da tela.** Nenhum mapa, gráfico, imagem ou cartão de tamanho fixo passa da borda de baixo da primeira tela nem é mais alto que a janela (só listas continuam rolando). Visual largo tem a altura limitada pela janela (`h-[min(…,60dvh)]`, `max-h-[calc(100dvh-…)]`), nunca só pela largura (`w-full h-auto`, `aspect-[2/1]`). A primeira tela cabe inteira em 390×844, 1366×650, 1536×730 e 1920×950.
- **Tela sempre preenchida.** O último bloco estica até o fim (`flex-1`); sem metade da tela vazia. Sem dados: estado vazio visual (ícone em container + uma linha) ocupando o espaço.
- **Espaçamento por papel, nunca no olho** (`medidas.md` seção 3): 4 px na mesma informação, 8 no mesmo grupo, 12 entre peças e entre cartões, 16 no padding do cartão, 24 entre grupos, 32 entre seções. Mesma relação, mesmo número na tela inteira; um `gap` só na grade da página; espaço vem do pai (`gap`), não de margem solta no filho.
- **Um eixo esquerdo e um direito por cartão** (`medidas.md` seção 4): título, número, chip, gráfico e lista começam no mesmo x. Diferença de 1 a 6 px é sempre erro.
- **Simetria é obrigatória:**
  - cartões lado a lado com a **mesma altura**, e o conteúdo (gráfico, tabela) cresce junto;
  - mesmo número de linhas de texto à esquerda e à direita;
  - cartão esticado pela grade não fica com vão por dentro: linhas de altura fixa e bloco centralizado na vertical, nunca linhas espalhadas com `justify-between` (ver `armadilhas.md`, "Cartão que estica");
  - linhas do grid completas (sem 3 + 1 sobrando);
  - na mesma coluna, itens e chips com a mesma largura;
  - colunas de uma lista começam no mesmo x em todas as linhas (grid com colunas fixas, não `flex` solto);
  - ícones do mesmo tamanho, na altura do texto; separadores e "vs" centralizados de verdade.
- **Título de seção fora do cartão** em telas de app (listas, detalhes, formulários); em dashboard, o título do bloco fica dentro, em cima à esquerda, discreto. Seções lado a lado com os títulos na mesma linha.
- **Sem cartão dentro de cartão.** Dentro de um cartão, divisórias (linha fina sólida ou tracejada, uma das duas no app). Nada de linha de lista em bloco com fundo próprio nem lista zebrada.
- **Cartão sem borda.** Superfície por degrau de cor, com sombra suave se a direção pedir. Raio do cartão de 16 a 24 px.
- **Nada por cima de nada.** Coluna de largura fixa precisa caber o maior valor real ("+R$ 1.234.567,89"); se não cabe naquela largura, a coluna some, não invade a vizinha. Limiar de "mostrar coluna" calculado pela soma das colunas, não chutado.
- **Grupo de itens iguais não quebra** (6 dezenas, avatares, pontos): `flex-nowrap` e coluna com a largura do grupo inteiro. Bolas em 5 + 1 é erro grave.
- **Layout decidido em JS pela largura vale em qualquer largura**, não só nas que o check fotografa: teste também os limiares (um pixel antes e um depois de cada troca de colunas) e uma largura intermediária (2200).
- **Desenho com teto não mora em cartão que estica.** Pódio, medidor e minibarras têm tamanho máximo; se o cartão cresce com a janela, o desenho cresce junto até o teto e o cartão não passa disso.
- **Sem texto cortado com "…".** Deixe quebrar ou reorganize; `min-w-0` em linha de lista.
- **Sem scroll interno**: menu lateral cabe na tela, nada vaza do container.

## 6. Texto (menos é mais)

- Dados primeiro: números, listas, gráficos, status curtos. Corte toda frase que não seja dado ou rótulo.
- Explicação só sob demanda, no ícone "i". Nada de nota de rodapé, frase-resumo ou parágrafo em visão geral.
- **Proibido:** travessão (—) em qualquer lugar, inclusive como valor vazio ("Sem dados", "Nenhuma"); "Rótulo: valor"; várias informações numa linha separadas por " · " (cada uma vira um elemento).
- Título e descrição não dizem a mesma coisa. Linguagem para leigo, sem jargão.
- **Uma lista por tela.** Recortes diferentes dos mesmos itens viram filtro ou ordem (pílulas), outros ângulos viram gráfico. Dois blocos vizinhos com o mesmo desenho (dois rankings de barras deitadas) contam como lista repetida.
- Esconda o que não existe: seção sem dados ou cartão que nunca vai mostrar nada não aparece.

## 7. Componentes

- **Ícones obrigatórios:** favicon, `apple-icon` e `<title>` curto em todo app; ícone em todo item de menu (lateral, inferior, suspenso, abas de área); ícone de PWA quando instalável.
- **Ícone de conteúdo dentro de um container** com fundo suave da cor (círculo ou quadrado arredondado, conforme a forma do projeto), também dentro de cartões. Exceção: chevron de linha e ícone dentro de botão ou chip que já tem fundo. Não tire ícones para ganhar espaço: encurte o texto. Uma família de ícones só.
- **Nada de texto clicável.** Toda ação é botão (com fundo) ou a linha/cartão inteiro clicável. Inclui "Ver todas", breadcrumbs e nomes em tabelas.
- **Botão padrão:** pílula de 40 px de altura, texto 14 px peso 600, todos os botões da tela com a mesma altura (44 px de área de toque no celular).
- **Campo de formulário:** preenchido, sem borda, 44 px de altura; foco com anel neutro de 2 px. Nada de campo com contorno ou só com linha embaixo.
- **Abas e filtros:** um modelo só por app (trilho segmentado, pílulas, sublinhado ou fundo suave no ativo).
- **Linha de lista:** `[ícone] [rótulo / valor] [chip em cima, valor embaixo] [chevron]`. Chip de status no canto direito, em cima do valor; nunca grudado no título nem numa linha solta.
- **Linha de lista não quebra título nem descrição.** Abaixo de ~460 px de largura da lista, a coluna da direita desce para uma linha embaixo do texto (`[ícone] [nome / descrição / chip + valor] [chevron]`); em tela larga, lista partida em colunas que espremem o texto ganha menos colunas. Todas as linhas com a mesma altura.
- **Datas** em blocos (dia grande, mês pequeno), não uma string longa.
- **Gráficos:** ocupam o cartão todo; eixo com respiro; sem contorno ao clicar; legenda e balão com cores do tema; **animação de entrada** (barras sobem, linhas andam, ~800 ms, parado com "reduzir movimento", `chart.enter` + `useChartMotion`); o balão do hover e a etiqueta de valor **não** animam; nada de número rolando.
- **Navegação:** escolha o modelo pela quantidade de áreas (direcao-visual.md). Valendo em qualquer modelo: cada área com **uma palavra**, ícones da mesma família e tamanho, item ativo com fundo e ícone na cor de destaque. Menu lateral recolhível com o botão de recolher **embaixo**, salvo entre visitas.
- **Celular com navegação inferior:** cabeçalho com a marca à esquerda e um botão de menu redondo à direita (ferramentas secundárias e tema); o título da página só no web. Barra inferior com 3 a 5 áreas, ícone + rótulo, a ativa com o ícone numa pílula tingida.
- **Chip do filtro ligado à esquerda dos controles**, que têm largura fixa: quando o chip aparece, nada sai do lugar.
- **Celular:** botões principais de uma tela de detalhe fixos no rodapé; seletores ocupam a largura toda do cartão; ao trocar de opção, rola para o topo.

## 8. Interação

- **Balão do "i" sempre inteiro na tela:** portal com posição fixa, preso a 8 px das bordas, virando para cima quando falta espaço (`InfoTip`).
- **Sem barra de rolagem visível no celular** (já no `tokens.css`).
- **Tudo que é clicável mostra a mãozinha** (regra global no `tokens.css`).
- **Hover só muda o fundo.** Proibido hover que sobe, cresce, move, faz sombra "elevar" ou muda ou acende borda. O fundo do hover acompanha o arredondamento do item (primeiro e último de uma lista também).
- **Todo toque responde na hora:** estado pressionado no celular e tela de carregando assim que a navegação começa (anel girando na cor de destaque, `NavLoading`). Nada de skeleton cinza que não tem a forma da tela.
- Abrir uma linha, trocar de aba ou filtrar não mexe nos cartões vizinhos.
- Selects com respiro entre o texto e a seta.

## 9. Padrões de código úteis (Tailwind)

```tsx
// Ícone em container (forma e raio pela direção do projeto)
<span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/14 text-primary [&_svg]:size-[18px]"><Wallet /></span>

// Linha de lista clicável (hover só no fundo)
<a className="flex min-h-14 items-center gap-3 px-4 py-2 hover:bg-accent/40 active:bg-accent/60">...</a>

// Indicador com as medidas padrão (padding 16, número a 4, chip a 8)
<section className="rounded-2xl bg-card p-4">
  <span className="text-sm font-medium text-muted-foreground">Pedidos</span>
  <div className="mt-1 text-4xl leading-[1.1] font-semibold tracking-tight tabular-nums">2.792</div>
  <div className="mt-2 flex items-center gap-2">...</div>
</section>

// Dois blocos simétricos
<div className="grid items-stretch gap-3 lg:grid-cols-2"><Card className="h-full" /><Card className="h-full" /></div>
```

## 10. Dashboards (painéis de dados)

**Primeiro o plano de informação, depois a direção visual.** A beleza não salva um painel com os dados errados ou nos lugares errados.

**As 7 referências** (`references/exemplos-dashboards/`, medidas em `anatomia-dashboard.md`) mostram o **nível de acabamento** que o usuário gosta: calma, respiro, título de bloco discreto, chips suaves, tabela limpa, marcas finas, poucos tons. Use como régua de qualidade, **não como molde**. O painel pode ter outra superfície, outra fonte, outra composição e outra cor, desde que chegue no mesmo nível de acabamento.

Reprovados (não repita em nenhum estilo):
- Estilo "centro de operações": contorno grosso, CAIXA ALTA espaçada, ciano neon, mapa escuro com grade e brilho, pulsos constantes ("filme de ficção científica").
- Cartão de destaque preenchido de cor.
- Título de bloco em negrito escuro com ícone em quadradinho ao lado.

Regras (valem em qualquer composição):
- **Cada informação aparece uma vez.** Se um bloco mostra a divisão (celular x computador), o gráfico principal não repete essa divisão. O gráfico principal compara com o período anterior (linha neutra tracejada).
- **Bloco do tamanho do conteúdo.** Medidor, número único e legenda curta ficam em blocos estreitos; dentro do bloco, o arranjo muda pela largura **do bloco** (`@container`), não da tela.
- **Uma grade para a tela toda**, com as bordas dos blocos alinhadas de cima a baixo (o `check-ui` acusa bordas "quase alinhadas").
- **Linha de tabela numa linha só** no web, colunas de largura fixa: chip na coluna de chips, número na de números, chips da mesma coluna com a mesma largura. No celular, número em cima do chip.
- **Contador de aba bate com o que dá para ver.** "Todos 60" com 5 linhas visíveis = páginas no rodapé ("1 a 5 de 60" + setas), sem rolagem interna.
- **Lista longa (mais de ~8 linhas) mora num bloco vertical próprio**, ao lado dos gráficos, uma coluna de linhas, páginas pela altura (`ListaAlta`). Nunca um bloco largo com as linhas partidas em 2 ou 3 colunas lado a lado.
- **Um desenho por bloco.** Dois blocos da mesma tela não usam o mesmo desenho para dados diferentes. Repertório: barras deitadas, partes de um todo (barra empilhada + legenda com %), colunas, colunas agrupadas, linha no tempo, alvo em anéis, quadro de 100, barras divergentes, pequenos múltiplos, mapa.
- **Gráfico de bater o olho.** Se precisa raciocinar para ler, está errado. "O que somou e o que tirou" = barras que saem do meio (`Divergentes`). "Para onde vai o total" = quadro de 100 (`Quadro100`). Reprovados como difíceis: cascata, funil, barra 100% de 5 cores, barras deitadas com segmento solto.
- **Partes de um todo da maior para a menor** e com a % de cada parte. Muitos itens pequenos viram 6 a 8 temas; o resto em "Outros".
- **Blocos proporcionais (treemap):** no máximo 5 ou 6, todos legíveis (nome e %).
- **Blocos de texto lado a lado que comparam as mesmas medidas viram colunas agrupadas**, não um cartão alto com vãos.
- **O conteúdo começa na borda do bloco**, alinhado com o título; nada de bloco centralizado com recuo dentro de cartão largo.
- **Sem sobra dentro do bloco.** Desenho pequeno no meio de bloco largo foi reprovado: o desenho toma a forma do bloco (`@container`) ou o bloco encolhe e a faixa ganha outro.
- **Tamanho máximo dos desenhos:** medidor até ~224 px, minibarras até 64 px de altura. Em bloco grande, sobra vira outro conteúdo, o desenho não cresce.
- **Frescor do dado** só para dado ao vivo ("Atualizado há 2 min", relativo). Dado diário ou esparso não ganha "Dados até" embaixo do título.
- **Filtros ligados:** tocar numa barra, região ou legenda filtra a tela e mostra a pílula "Nome ×" no cabeçalho; a seleção aparece no gráfico (os outros apagados); tocar de novo desfaz.
- **Cabeçalho:** título da página sozinho, sem subtítulo; à direita o período (se houver), o filtro ligado e o tema. No celular o título some quando a barra inferior já diz onde a pessoa está.
- **Carregando e erro:** anel girando; erro com ícone + uma linha. Nada de cabeçalho piscando.
- **Tela larga cabe na janela** (a partir de 1920×800, variante `fit:`): o painel inteiro na altura da janela, no máximo duas faixas de gráficos, colunas redistribuídas em vez de terceira faixa, lista paginada pela altura. No 21:9, mais colunas, nenhum bloco com mais de ~40% de vazio, nenhum gráfico mais largo que ~4:1. Abaixo disso a tela rola, com a primeira tela cabendo inteira.
- **Mapa:** terra neutra, mar da cor do cartão, sem grade; fracos em neutro, fortes na cor; rótulo nos principais; pulso só no que acabou de chegar (`FillMap`, `useMapColumns`).
- Marque a raiz com `data-ui="painel"`.

## 11. Checklist antes de mostrar (rode e olhe os prints)

**Direção**
- [ ] Plano de informação feito? A decisão mais urgente está em cima à esquerda, com motivo e prazo? Nada da tela antiga sumiu sem destino?
- [ ] Direção visual escrita (personalidade, cor, tipo, forma, assinatura) e aplicada? Passou no teste da mesmice (`direcao-visual.md` seção 6)?
- [ ] A composição saiu da pergunta da tela? Se tem faixa de indicadores no alto, ela se justifica?
- [ ] Um ponto focal claro (teste de apertar os olhos)? Blocos de tamanhos diferentes pela importância?

**Proibições**
- [ ] Fonte fora da lista proibida, números tabulares, todo texto começando com maiúscula, nada em CAIXA ALTA?
- [ ] Sem "—", " · ", "…", "Rótulo: valor", frases explicativas fixas?
- [ ] Sem bordas coloridas, cartão preenchido de cor, hover que move ou muda borda? Hover com cantos certos?
- [ ] Todo ícone em container? Nenhum texto clicável? Ícone na aba e em todo item de menu?
- [ ] Uma lista só na tela? Nenhum desenho repetido em dois blocos? Lista longa num bloco vertical próprio?
- [ ] Mexi só no que foi pedido e só no breakpoint pedido? Nada existente sumiu?

**Acabamento**
- [ ] `paleta.mjs check` sem falha? Cores só por token? Dado ordenado numa cor só, número nunca pintado, vermelho e amarelo só para status, variação com seta?
- [ ] Prints em 320, 390, 1366×650, 1536×730, 1920×950 e ultrawide conferidos um a um, nos temas claro **e** escuro?
- [ ] Nada passa da borda de baixo da primeira tela? Tela larga ganha colunas e cabe na janela, sem gráfico achatado nem linha gigante?
- [ ] Simetria: mesma altura lado a lado, nenhum vão dentro de bloco, colunas alinhadas, grid sem sobra, bordas alinhadas entre faixas?
- [ ] Nenhuma linha de lista com título ou descrição quebrando; seletores na largura toda no celular; estado vazio ocupando o espaço?
- [ ] Espaçamento por papel (`medidas.md`): mesmo padding em todos os cartões, um `gap` só entre eles, rótulo a 4 e chip a 8 do número em todo lugar, nada fora da escala?
- [ ] Alinhamento: em cada cartão, tudo começa no mesmo x à esquerda e termina no mesmo x à direita? Nenhuma diferença de 1 a 6 px?
- [ ] Tamanho por papel: botões com a mesma altura, chips de 24, containers de ícone iguais, linhas da lista com a mesma altura?
- [ ] Cartão sem borda, raio de 16 a 24, lista com divisória (sem zebra, sem blocos), campo preenchido sem contorno, um modelo só de abas?
- [ ] Proximidade agrupando, um raio só, ícones de uma família?
- [ ] Estados desenhados: vazio, carregando, erro, texto longo, número grande?
- [ ] Gráficos com entrada animada, balão sem animação, parados com "reduzir movimento"? Mãozinha em tudo clicável? Balão do "i" dentro da tela?
- [ ] Largura total no web, tela preenchida até o fim, sem seções vazias?

Rode antes de mostrar:

```sh
node <pasta-da-skill>/scripts/paleta.mjs check src/app/globals.css
node <pasta-da-skill>/scripts/lint-ui.mjs src
node <pasta-da-skill>/scripts/check-ui.mjs http://localhost:3000/<rota-alterada> --out=.ui-check
```

Sem Node ou Playwright, faça a varredura mínima:

```sh
grep -rnE "hover:(-?translate|scale|shadow|border|ring)|truncate|text-ellipsis|line-clamp| · |—|max-w-(3|4|5|6|7)xl.*mx-auto|Inter|Roboto|Geist|Poppins" src
```
