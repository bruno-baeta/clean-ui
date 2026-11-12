# Armadilhas técnicas (já custaram retrabalho)

## Tailwind v4

- **`cn` sem merge não resolve conflito.** Os kits usam um `cn` que só junta strings. `className="hidden @sm:inline-flex"` num componente cuja base já tem `inline-flex` não esconde nada: as duas classes ficam e vence a que vem depois no CSS. Para esconder ou mostrar um componente por tamanho, **envolva num `<span className="hidden @sm:block">`** em vez de passar `hidden` para ele (ou use `tailwind-merge`, se o projeto tiver).
- **`[&>*]:sm:col-span-2` no pai vence `lg:col-span-7` no filho.** O seletor do pai (`.pai > *`) tem especificidade maior que uma classe simples, então o filho fica com 2 colunas também no `lg`. Ponha o `col-span` direto em cada filho. Não use um invólucro `contents` com `[&>*]:` para distribuir colunas.
- **`min-[1920px]:` perde para `lg:`.** Use `3xl:` e `4xl:` (definidos no `tokens.css`).
- **Classes montadas por string** (`'lg:h-[' + x + ']'`) não existem para o Tailwind. Valor calculado vai em `style` (altura medida, `gridTemplateColumns`, `gridTemplateRows`).
- **`lg:not-sr-only`** existe no v4: título só no web com `sr-only lg:not-sr-only`.
- **`display: contents` com `4xl:grid`** funciona para um grupo que é coluna empilhada no `lg` e vira itens soltos da grade no ultrawide (`flex flex-col ... 4xl:contents`), mas os filhos precisam das próprias classes de `order-*` e `col-span-*`.

## Tema

- **Projeto com `next-themes`:** não use o `ThemeToggle` do kit com `localStorage('tema')`; os dois brigam pela classe do `<html>`. Reescreva o botão com `useTheme()` (`setTheme('system' | 'light' | 'dark')`) e confira se o `ThemeProvider` tem `enableSystem` e `defaultTheme="system"`. Com `enableSystem={false}` a tela nunca muda com o sistema e o `check-ui` acusa "a página não muda entre tema claro e escuro".
- **Redesign ao lado do app antigo:** escopo os tokens novos numa classe (`.novo { --card: ... }` e `.dark .novo { ... }`) e ponha a classe na raiz da moldura nova. O `@theme inline` já aponta para `var(--card)`, então os utilitários usam o valor do escopo. O app antigo não muda.

## Recharts

- **Campo chamado `ref` nos dados derruba a tela**: o Recharts repassa cada item como props para a barra, e `ref: 7.8` vira "Expected ref to be a function". O mesmo vale para `key`. Use outro nome (`refe`, `refeitos`).
- **Uma barra enorme ao lado de várias pequenas** (80% num item contra 1% a 10% nos outros) esmaga as pequenas em bolinhas. Tire a grande do gráfico (ela vira o número no canto do cartão) e mostre só as outras.

## Lista alta ao lado (row-span)

- O cartão da lista ocupa duas faixas da grade (`lg:row-span-2`); o conteúdo fica em `absolute inset-0` para **não** empurrar a altura das faixas, e as linhas por página saem da altura medida (`ListaAlta`). O `check-ui` acusa "cartões lado a lado com alturas diferentes (380 vs 780)": nesse arranjo é esperado; confira no print que a lista termina junto com a última faixa.
- **`row-span` com `!` apaga o `row-start`**: `fit:row-span-2!` vira `grid-row: span 2 / span 2 !important` e a lista perde a linha de início (os gráficos descem uma faixa e as faixas `1fr` somem). Escreva as duas coisas juntas: `lg:row-[2/span_3] fit:row-[2/span_2]!`.
- No ultrawide com tudo numa faixa só, sem altura fixa, os gráficos somem (140 px). Dê à lista uma altura mínima em linhas (`minRows`) para ela dar a altura da faixa, ou mantenha duas faixas com altura fixa.

## React 19 e eslint

- **Contagem regressiva sem `setState` em efeito:** `useEffect(() => { setNow(Date.now()) ...})` é erro no eslint novo (renderização em cascata). Use `useNow()` do kit (`useSyncExternalStore`: `null` no servidor e na hidratação, o minuto atual no navegador).
- **Ref lido ou escrito durante a renderização** (`ref.current = valor` no corpo do componente) é erro: sincronize num `useEffect`.
- **`Date.now()` num componente de servidor** acusa "função impura": como ele renderiza uma vez por requisição, é o que se quer; deixe um comentário e `eslint-disable-next-line react-hooks/purity`.
- **Array montado a cada renderização** dentro das dependências de `useMemo` refaz o cálculo sempre: embrulhe o array no próprio `useMemo`.

## Celular

- **Barra inferior fixa cobre o que está embaixo:** ao rolar até um botão (o "i", um campo), ele para atrás da barra. O botão do "i" do kit já tem `scroll-mb-24` (só abaixo de `lg`); faça o mesmo em campos e botões perto do fim da página.
- **`tabular-nums` na Plus Jakarta** desenha o "1" largo: em texto corrido ("1 a 1 de 1") parece fonte monoespaçada. Use `tabular` só em colunas de números alinhados.

## Várias frentes ao mesmo tempo

- **Nunca apague um arquivo que outra tela ainda importa**, nem por um minuto: o build quebra para todas as frentes e o `check-ui` de todos falha junto. Apague no fim, depois de contar as importações.
- **Frente que precisa mudar o kit** não muda: pede no relatório. Quem integra aplica uma vez e leva para a skill.

## Animação

- **Recharts só anima na primeira vez que desenha.** Se `isAnimationActive` começa `false` (ex.: `useState(false)` + `useEffect` lendo "reduzir movimento") e vira `true` depois, as barras já nasceram no lugar e nada se move. Use `useChartMotion()` do kit: começa em `true` e só desliga para quem pediu "reduzir movimento".
- **Confira a animação com dois prints**: um ~250 ms depois de o gráfico aparecer (barras baixas, subindo) e outro depois de 1,5 s (estado final). O `check-ui` tira os prints com "reduzir movimento" ligado, então ele sozinho não prova que anima.

## Interação com gráfico

- **Testar o clique numa barra com Playwright:** o Recharts decide a barra pela posição do mouse (`activeTooltipIndex`), então `locator.click({ force: true })` não seleciona. Passe o mouse pela barra (`mouse.move`) e clique com `mouse.click(x, y)` **dentro da área visível** (use uma janela alta, ex.: 1366×950, se o gráfico estiver abaixo da dobra). Confira se a pílula do filtro apareceu e tire print nos dois temas.

## Servidor e check

- **Mudou o layout raiz ou recriou arquivos: reinicie o `next dev`.** O servidor pode continuar servindo a versão velha (no MegaLab, o `ThemeProvider` antigo seguia ativo depois da edição e a tela ficava só no escuro). Confira o HTML servido (`curl ... | grep defaultTheme`) antes de culpar o CSS.
- **Banco local sem um estado importante** (sem jogos recomendados, sem apostas): teste o layout com dados de exemplo **temporários** na página (ex.: 8 jogos fixos), rode o `check-ui`, olhe os prints e **apague o exemplo** (confira com `grep`). O cartão de decisão com e sem jogos tem alturas muito diferentes, e isso muda o resto da tela.
- **Antes de olhar um achado de "gráfico achatado":** some a altura do cabeçalho do cartão. Título + frase de dado + margem levam ~120 px; num gráfico de 300 px sobram 180. Tire a frase (vire chip no cabeçalho) antes de mexer na grade.
- **Gráfico que estica com a linha da grade** (o vizinho é mais alto) passa da borda de baixo no ultrawide. Dê altura medida ao gráfico e faça o vizinho acompanhar essa altura, não o contrário.
- **Página recarregando sem parar no `next dev` (Turbopack)** depois de apagar e recriar muitos arquivos: o WebSocket do HMR manda `restart` + `reloadPage: HMR hash mismatch` a cada conexão, e o log enche de "The server could not finish this Suspense boundary". Não é o código: pare o servidor, apague `.next` e suba de novo.
- **Erro de hidratação com `data-darkreader-*` ou `cz-shortcut-listen`** vem de extensão do navegador (Dark Reader, ColorZilla), não do app. Evite no layout raiz: `metadata.other = { 'darkreader-lock': 'true' }` (o Dark Reader deixa o site em paz; ele já tem tema escuro próprio, valor vazio não é renderizado) e `suppressHydrationWarning` no `<body>`.
- **Rotas com limite de chamadas** (ex.: 60 por minuto): o `check-ui` em muitas larguras passa do limite e fotografa a tela de erro. Rode em grupos menores ou espere um minuto entre as rodadas, e não confunda o achado com problema de layout.

## Linha de lista grossa no celular

- **Sintoma:** na lista de métodos, com chip "Hipótese" e "7 versões" numa coluna fixa de 108 px à direita, sobravam ~160 px para o texto: "Cobertura combinatória" e "Mais chance de ao menos uma quadra" quebravam em 2 linhas cada, e cada item ficava com uma altura diferente. O usuário achou "muito grosso e estranho".
- **Correção:** abaixo de ~460 px de largura da lista, o grid vira `ícone | texto | chevron` e o chip e o valor descem para uma linha embaixo da descrição. Todas as linhas ficam iguais (3 linhas curtas) e o texto usa a largura toda.
- **Tela larga também:** lista quebrada em colunas de linhas (`ColumnRows`) com 3 colunas no ultrawide deixa cada coluna com ~500 px; com minigráfico, chip e número fixos sobravam ~130 px para o nome, igual ao celular. Correção: cada coluna de linhas precisa de folga para o texto (≥ ~240 px para nome curto, a frase inteira para pergunta longa). Prefira menos colunas (nunca 3 com menos de ~680 px cada), mostre colunas extras (minigráfico, "Próximo passo") só quando sobra largura, e use o arranjo empilhado (chip e valor embaixo do texto) em qualquer largura onde a tabela não cabe.
- **Ao medir:** contar linhas pelo texto (`range.getClientRects()`), não pela altura do elemento; um chip de `h-6` com `line-height` menor parece ter 2 linhas.
- **Grade de cartões com quantidade fixa** (ex.: 15 jogos): `auto-fill` deixa a última linha incompleta (15 em 4 colunas). Meça a largura e escolha o maior número de colunas que divide a quantidade (3 ou 5), sem cair abaixo da metade do que cabe.

## Celular: seletor e estado vazio que não ocupam o espaço

- **Seletor no cabeçalho do cartão:** no celular a ação do cartão quebra para a linha de baixo, mas continua com a largura do conteúdo (`ml-auto` + `w-44`) e fica encostada à direita. Corrija com a ação em linha própria e largura toda (`max-sm:ml-0 max-sm:basis-full` no invólucro, select com `flex-1 sm:w-44 sm:flex-none`, setas nas pontas). Seletor que é o título do bloco (ex.: método A x método B) também: `w-full` no estreito, `w-auto` só no largo (`@xl:w-auto`).
- **Estado vazio que não estica:** `flex-1` só funciona se toda a cadeia até a raiz for flex em coluna. A moldura do app era `min-h-dvh lg:flex`: no celular não era flex, então o `main` não crescia e o vazio parava em `min-h-[60dvh]`, com um buraco antes da barra inferior. A raiz precisa ser `flex min-h-dvh flex-col lg:flex-row`; aí tire os `min-h-[NNdvh]` fixos do vazio.

## Cartão que estica (vãos por dentro)

Caso real (Comparar métodos do MegaLab, ultrawide, 2026-11-12): "tem espaço em branco na tela, e as rows do primeiro card poderiam estar centralizadas".
- **Nunca `justify-around` ou `justify-between` em linhas de lista.** Num cartão esticado pela grade, as linhas se espalham com buracos de 100 px. Linhas com altura fixa (`min-h-14`) e o bloco inteiro **(título + linhas) centralizado** na vertical (`justify-center` no pai). Título preso em cima e linhas no meio também é vão.
- **Duas colunas comparáveis (A x B, antes x agora) têm a mesma regra**: as duas centralizadas, com a mesma altura de linha, para as linhas ficarem na mesma altura dos dois lados. Linha com barra e linha sem barra precisam da mesma altura mínima.
- **Gráfico com teto de altura (`useFitHeight` com `max` baixo) ao lado de um cartão que estica** deixa vão embaixo do gráfico. Na mesma faixa, todos acompanham a mesma altura. Em telas altas (1100 a 1300 px) suba o `max` (~900) para o gráfico chegar até a borda.
- **Bloco de texto curto ao lado de gráficos altos na mesma faixa (ultrawide)**: o cartão de texto fica com metade vazia, por mais que se centralize. Mude a composição: o bloco de texto inteiro em cima e os gráficos embaixo, crescendo até a borda.
- **Linhas de comparação com mais de ~768 px** ficam com o valor longe do rótulo: limite o bloco (`w-full max-w-3xl`) dentro da coluna, **sem** `mx-auto`: centralizado, o texto ganha um recuo à esquerda em relação ao título do cartão (reprovado num painel industrial).
- O `check-ui` agora acusa "cartão com vão vazio por dentro", "cartão com conteúdo espalhado" e compara a altura dos cartões mesmo dentro de um invólucro sem fundo (o `div` com `ref` de medir). Antes ele não via nenhum dos três.
- **Linha que abre detalhe dentro da lista** (acordeão) faz o cartão da lista crescer, a linha da grade cresce junto e o vizinho esticado (`flex-1`, `[&>*]:h-full`) cresce também: no MegaLab, tocar numa estratégia da classificação fazia o pódio ao lado descer e mudar de tamanho. O vizinho fica com `min-height` da primeira tela e `lg:self-start` (não estica com a lista). Teste: meça o vizinho antes e depois de abrir uma linha, em todas as larguras.
- **Seletor nativo com a seta em `absolute`:** o `label` em volta não pode esticar (pai `flex-col` sem `items-start`), senão a seta vai para a borda da coluna, longe da pílula.

## Dados

- **Cálculo inverso para "quanto falta":** se a regra é "medida ≥ limite" e a medida cresce com uma variável (o prêmio), uma busca binária dá o valor da variável que alcança o limite. Trate o caso "nunca alcança" como resultado (mostre "Nenhum"), não como erro ("Sem estimativa").
- **Variação sem juízo não ganha chip verde ou vermelho:** o prêmio cair 94% porque alguém ganhou não é "pior" para o usuário.
- **Consulta das listas do usuário agrupada por item** (`group by contest_number`) e cruzada em memória com a lista geral (`Map`), em vez de uma consulta por linha.
