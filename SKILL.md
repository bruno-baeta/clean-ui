---
name: clean-ui
description: Clean UI, regras de design de interface (dados primeiro, cabe na tela, dois temas, cara de produto feito por gente) para qualquer trabalho de front-end (telas, componentes, cards, listas, gráficos, e-mails HTML, ajustes de layout, mobile e web). Use sempre que for criar, ajustar ou revisar UI, CSS, Tailwind ou componentes React/Next, antes de mostrar prints ou publicar.
---

# Clean UI

Interface minimalista, moderna, com tema claro e escuro, que cabe na tela, com dados em primeiro lugar e cara de produto feito por gente, não por IA. As regras abaixo vieram de pedidos reais de ajuste. Cada uma já irritou o usuário quando foi quebrada: trate como requisito, não como sugestão.

## Arquivos da skill

Caminhos relativos à pasta desta skill.

| Arquivo | Quando usar |
|---|---|
| `references/informacao.md` | **Toda tela nova ou redesign, antes do layout.** Como escolher o que mostrar, a ordem de prioridade e a posição de cada informação (inventário, perguntas do usuário, níveis, filtro, mapa de posições, plano escrito). |
| `references/padroes-aprovados.md` | Blocos que o usuário aprovou ("ficou bem melhor"): cartão de decisão, gráfico da medida da decisão com a linha do limite, cartão de situação com saldo ao longo do tempo, lista do próprio usuário, apoio sazonal, cabeçalho do celular, ordem por prioridade, ultrawide. Use como ponto de partida para o conteúdo, não como esqueleto fixo. |
| `references/armadilhas.md` | Erros técnicos que já custaram retrabalho (Tailwind v4, `cn` sem merge, especificidade de `[&>*]:`, next-themes, servidor com CSS velho, testar estados que o banco local não tem). Leia antes de escrever o código. |
| `references/migracao.md` | **Redesenhar o app inteiro** (várias telas): tela de referência aprovada primeiro, base feita por você (moldura, peças de página, tokens no body, tema salvo), frentes paralelas com brief comum, integração (pedidos para o kit, apagar código antigo só no fim, reiniciar, verificar tudo). |
| `references/exemplos.md` | Casos reais de errado e certo. Leia ao criar uma tela nova ou quando estiver em dúvida se algo está bom. |
| `references/dashboards.md` | **Toda tela com números, gráficos ou mapas.** O que separa amador de profissional, princípios (NN/g, Stephen Few, IBM Carbon), 7 composições (escolha a que serve ao plano de informação), regras para telas largas e ultrawide, cor e acabamento dos gráficos. |
| `references/paletas.md` | Paletas prontas e validadas (Cobalto, Índigo, Ciano, Coral) com cinzas, destaque, escala ordenada e cores de séries para os dois temas. Escolha por aqui, nunca cores soltas. |
| `assets/tokens.css` | Projeto novo ou sem identidade: tema claro e escuro (segue o sistema, com troca manual), fonte, foco, gráficos e toque já configurados (Tailwind v4). Vem com a paleta Cobalto só como ponto de partida: troque pelo bloco completo da escolhida (fim de `paletas.md`). Inclui a variante `tall`, positivo/negativo/aviso e a mãozinha. |
| `references/exemplos-dashboards/` | As 7 referências do usuário de dashboard moderno. **Abra todas antes de desenhar qualquer dashboard.** |
| `references/anatomia-dashboard.md` | As referências traduzidas em medidas: cartão, título, indicador, chips, números no topo do gráfico, gráficos, partes de um todo, medidor, tabela, celular, e o que não copiar. |
| `assets/dashboard.tsx` | **Kit de dashboard** medido nas referências: DashCard, Kpi, IconCircle, DeltaChip, StatusChip, TrendDot, CountBadge, Tabs, SeriesStat, StatColumns, Dashed, KeyValue, StackedBar, LegendGrid, Gauge, classes TH/TR de tabela, TooltipCard, PillMark, props `chart` para Recharts, ListaAlta (a lista num cartão vertical, com páginas pela altura), Divergentes (o que somou e o que tirou), Quadro100 (de cada 100), Colunas (colunas flutuantes; cascata e funil foram reprovados como difíceis), useFitRows (quantas linhas cabem) e useFitHeight (altura de um gráfico pelo que sobra da janela; mede de novo quando o cartão de cima cresce). |
| `assets/painel.tsx` | Ajudantes de mapa: useMapColumns (largura da coluna do mapa) e FillMap (mapa-múndi que preenche). |
| `assets/ui.tsx` | Componentes base prontos (Card, Section, IconBox, Chip, Pill, Button, BottomActions, ListRow, ListCard, StatCard, DateBlock, FillEmpty, InfoTip, NavLoading, Spinner, ThemeToggle, FitScreen). Reaproveite ou adapte em vez de inventar. Se o projeto já tem equivalentes, use os do projeto. |
| `scripts/lint-ui.mjs` | `node <skill>/scripts/lint-ui.mjs src`: varre o código alterado (hover que move, reticências, bordas coloridas, largura estreita, fontes proibidas, cor fixa que quebra um dos temas, "—", " · ", minúscula, "Rótulo: valor"). |
| `scripts/check-ui.mjs` | `node <skill>/scripts/check-ui.mjs http://localhost:3000/rota --out=prints`: tira prints em 320 e 390 px (mobile) e na área útil do navegador em 1366×650, 1536×730 e 1920×950 (notebooks e monitor) e 2560×960, 2752×1100 (21:9 com zoom de 125% do Windows) e 3440×1300 (ultrawide 21:9), nos temas escuro **e** claro, e mede estouro horizontal e vertical (cartão passando da borda de baixo da primeira tela ou mais alto que a tela), listas parecidas repetidas, gráfico esticado e linha de lista larga demais, "…", cartões vizinhos com alturas diferentes (também dentro de invólucro sem fundo), cartão com vão vazio por dentro ou conteúdo espalhado, grid incompleto, ícone sem container, hover que move, scroll interno, conteúdo estreito, fonte, clicável sem mãozinha, bordas de cartões quase alinhadas entre linhas, balão do "i" fora da tela (abre cada um), barra de rolagem no celular, linha de tabela larga demais (qualquer linha repetida), texto espremido e página vazia ou de erro (espera o carregamento; se os dados não vieram, o check não vale). Cada achado vem com tamanho e tema. Precisa de Playwright no projeto; `--user`/`--pass` para páginas com senha. |

Os scripts são guias: confira cada achado e, principalmente, abra os prints e olhe.

## 1. Processo (o que mais causa retrabalho)

1. **Faça só o que foi pedido.** Nunca remova, troque ou "simplifique" elementos existentes sem pedido explícito. Se a proposta exige tirar algo, pergunte antes. Na dúvida, mantenha.
2. **Respeite o breakpoint pedido.** Pediu ajuste no mobile: o web não muda (use `sm:`/`md:` para preservar o web, e vice-versa).
3. **Mostre antes de publicar, olhando todos os tamanhos.** Antes de dizer que está bom, abra o print de **cada** tamanho do check (inclusive 1366, 1536 e 2752, onde tabela quebra e cartão sobra), não só 390 e 1920. Trabalho de agente delegado também: confira você mesmo. Rode localmente, tire print no **mobile (390 px, e confira 320 px)** e no **web (1366×650, 1536×730 e 1920×950, a área útil real do navegador)**, nos **dois temas**, olhe de verdade cada print e só faça commit/push/deploy com aprovação explícita.
4. **Tela nova ou redesign: primeiro as informações, depois o layout.** Siga `references/informacao.md` (e veja os blocos de `references/padroes-aprovados.md` e os erros de `references/armadilhas.md`): inventário do que o produto sabe (inclusive tudo que a tela antiga mostrava), perguntas do usuário em ordem de urgência, níveis de prioridade, filtro de cada informação, mapa de posições e o plano escrito. A composição sai desse plano. Escolha você a composição e a paleta (a da marca, se o projeto tiver; senão a de `paletas.md` que combina com o assunto). **Não monte várias versões ou visões da tela para o usuário escolher.** Construa uma, a melhor, e diga em poucas linhas por que cada coisa está onde está. Nunca parta do esqueleto de um projeto anterior nem repita "4 indicadores + grade de cartões + listas" por padrão.
5. **Detalhe reprovado duas vezes = opções lado a lado.** Só quando o usuário já reprovou o mesmo detalhe (posição de um chip, fonte) duas vezes, mostre 2 ou 3 variações desse detalhe em print. Nunca para a tela inteira.
6. **Depois de apagar ou recriar arquivos, reinicie o servidor de desenvolvimento** (ou salve o CSS de novo) antes do check: o Tailwind pode continuar servindo o CSS antigo, sem as classes novas.
7. **Revise com a checklist (seção 10) antes de cada print.** Se não houver simetria, não está pronto.

## 2. Tipografia

- **Proibidas (cara de IA):** Inter, Roboto, Arial, Helvetica, system-ui como fonte de marca, Geist, Poppins, Montserrat, Space Grotesk, Open Sans, Lato.
- **Boas e pouco usadas por IA:** Plus Jakarta Sans (preferida e já aprovada), Manrope, Onest, Figtree, Hanken Grotesk, Schibsted Grotesk, Instrument Sans, Albert Sans, Familjen Grotesk. Para títulos de destaque, Bricolage Grotesque. Uma família só por app.
- Números com `font-variant-numeric: tabular-nums` (`tabular-nums`). Nada de fonte mono com zero cortado ou pontilhado.
- Hierarquia por peso e tamanho moderados. Rótulo pequeno em cima (12 px, cor apagada) e valor embaixo (16 px, semibold). Valores lado a lado com o mesmo tamanho de fonte. Nada de texto gigante colorido.
- **Todo texto visível começa com maiúscula**, inclusive abreviações soltas ("Qui", "Sex"). No meio de uma frase, escreva normal: "Vs terça anterior", não "Vs Ter anterior". Títulos em sentence case, nunca CAIXA ALTA.

## 3. Cor e tema

- **Sempre dois temas, claro e escuro.** Todo app nasce com os dois: segue o tema do sistema (`prefers-color-scheme`) e tem um botão para trocar (`ThemeToggle` em `assets/ui.tsx`), com a escolha salva. E-mails e prévias também respondem a `prefers-color-scheme`. Nenhuma tela pode existir só num tema.
- **Cores sempre por token** (`var(--card)`, `bg-card`, `text-muted-foreground`). Nada de `#000`, `#fff`, `bg-black`, `text-white` ou hex solto em componente, gráfico ou SVG: isso quebra o outro tema.
- **Escuro:** fundo bem escuro (perto de preto), cartão um degrau acima, borda discreta, texto quase branco. **Claro:** fundo cinza muito claro, cartão branco, borda leve, texto quase preto. Os dois com o mesmo cuidado e conferidos em print.
- **Paleta não é fixa, mas também não é solta.** Não existe "preto + laranja" padrão: use uma paleta inteira de `references/paletas.md` (cinzas, destaque, escala e séries que combinam e já foram validadas para contraste e daltonismo), escolhida pelo assunto e mostrada renderizada. Nada de juntar cores avulsas (o azul de um lugar, o amarelo de outro, o vermelho de outro). Projeto com marca segue a sua (ex.: o MegaLab escolheu laranja); cor nova só passando no validador do guia `dataviz`.
- **Base neutra, cor com propósito.** Cinzas fazem ~90% da tela. Uma cor de destaque por app (versão por tema). Dado ordenado (magnitude, nível, faixa) usa a escala de **uma cor só** (`--seq-1..4`), nunca arco-íris de cinza, azul, amarelo e vermelho. Séries sem ordem usam `--cat-1..3` em ordem fixa. Vermelho/amarelo de alerta só para status de verdade, com ícone e rótulo. **Verde nunca é cor de marca**, mas pode aparecer em dado: chip de variação "melhorou", status bom e a série categórica 3 das paletas validadas. Sem roxo aleatório, sem marrom.
- **Número nunca pintado.** Valores e rótulos ficam na cor do texto; a cor do dado vai numa marca pequena ao lado (ponto, barra fina, selo neutro com barrinha colorida).
- **Variação para melhor e para pior** (como nas referências do usuário): chip verde suave e chip vermelho suave, **sempre com seta** para quem não distingue as cores (`DeltaChip`). Igual: chip cinza.
- Estados parecidos (ex.: Errei, Difícil, Bom, Fácil) precisam de cores claramente diferentes entre si.
- **Sem bordas ou anéis coloridos** para destacar cartões. Destaque só com fundo suave da cor (`bg-primary/10`).
- Texto sempre legível nos dois temas, inclusive legendas e tooltips de gráficos depois de clicados.

## 4. Layout e simetria

- **Largura total no web.** Nada de conteúdo estreito centralizado (`max-w-*` + `mx-auto` na página). Use grid para ocupar a tela.
- **Tela larga ganha colunas, não esticar.** De 1920 px para cima e em ultrawide 21:9 (2560 e 3440 px), aumente o número de colunas com `3xl:` (1920 px) e `4xl:` (2560 px), definidos no `tokens.css`; nunca `min-[1920px]:` (no Tailwind v4 ele perde para `lg:`), abra painéis que antes ficavam escondidos (detalhe ao lado, tabela ao lado do gráfico) e limite a proporção: gráfico de tempo até ~4:1, barras e mapas até ~2,5:1, linha de lista até ~720 px. Veja `references/dashboards.md` seção 4.
- **Mobile first.** Espaçamento lateral confortável (16 px), nada apertado, carrossel com respiro horizontal, primeiro item com espaço em cima.
- **Cabe na altura da tela.** O conteúdo se adapta à janela nas duas direções, não só à largura. Nenhum mapa, gráfico, imagem ou cartão de tamanho fixo passa da borda de baixo da primeira tela nem é mais alto que a janela (só listas continuam abaixo, rolando a página): mapas, gráficos e imagens grandes têm a altura limitada pela janela (`max-h-[calc(100dvh-<cabeçalho>)]`, `h-[min(…,60dvh)]`, SVG com `preserveAspectRatio="xMidYMid meet"` dentro de um container de altura definida). Nunca dimensione um visual largo só pela largura (`w-full h-auto`, `aspect-[2/1]`): num monitor largo ou num notebook ele estoura para baixo. A primeira tela (cabeçalho, indicadores e o bloco principal) cabe inteira em 390×844, 1366×650, 1536×730 e 1920×950 (área útil do navegador, já descontadas as barras; a tela inteira não serve de medida). Use `FitScreen` de `assets/ui.tsx`.
- **Tela sempre preenchida.** O último bloco estica até o fim (`flex-1`). Sem metade da tela vazia: use conteúdo real ou um estado vazio visual (ícone em container + 1 linha).
- **Simetria é obrigatória:**
  - cartões lado a lado com a **mesma altura** (`items-stretch`, `h-full`), e o conteúdo interno (gráfico, tabela) cresce junto e ocupa toda a altura;
  - mesmo número de linhas de texto à esquerda e à direita;
  - cartão esticado pela grade não fica com vão por dentro: linhas de lista com altura fixa e o bloco (título + linhas) centralizado na vertical, nunca `justify-around`/`justify-between` espalhando as linhas; colunas comparáveis (A x B) com a mesma altura de linha, para as linhas se alinharem (ver `references/armadilhas.md`, "Cartão que estica");
  - linhas do grid completas (sem 3 + 1 sobrando);
  - na mesma coluna, itens e chips com a mesma largura;
  - colunas de informação começam no mesmo x em todas as linhas de uma lista (use grid com colunas fixas, não `flex` solto);
  - ícones do mesmo tamanho e alinhados na mesma altura do texto;
  - itens de um cabeçalho igualmente espaçados; elementos "vs" e separadores centralizados de verdade, inclusive na vertical.
- **Título de seção fora do cartão** em telas de app (listas, detalhes, formulários). **Exceção: dashboards** (seção 9), onde cada cartão é um bloco de dado com o título cinza dentro, em cima à esquerda, como nas referências. Fora dos dashboards, nunca título como legenda dentro do cartão. Seções lado a lado têm os títulos na mesma linha.
- **Sem cartão dentro de cartão.** Dentro de um cartão, separe com divisórias (`divide-y`, `border-t`, `border-l`).
- **Sem texto cortado com "…".** Deixe quebrar linha ou reorganize no mobile; em linha de lista use `min-w-0` para não estourar.
- **Sem scroll interno**: menu lateral que cabe na tela, texto longo fora de container rolável, nada vazando da borda do container.

## 5. Texto (menos é mais)

- Dados primeiro: números, listas compactas, gráficos, status curtos. Corte toda frase que não seja dado ou rótulo.
- Explicação só sob demanda, no ícone "i" (tooltip/popover). Nada de nota de rodapé, frase-resumo ("Você apostou R$ X com saldo de Y") ou parágrafo em cartão de visão geral.
- **Proibido:** travessão (—) em qualquer lugar, inclusive como valor vazio (use "Sem dados", "Nenhuma"); frases "Rótulo: valor"; várias informações numa linha separadas por " · " (cada informação vira um elemento: linha, coluna ou chip com ícone).
- Título e descrição não podem dizer a mesma coisa. Abrevie quando couber.
- Linguagem para leigo: sem jargão técnico ou estatístico. Explique com passos visuais (ícone + poucas palavras).
- **Uma lista por tela.** Várias listas com itens parecidos na mesma tela (ex.: "Mais fortes" e "Mais recentes", "Últimos jogos" e "Próximos jogos") cansam: mostre uma lista só e troque o recorte por um controle de ordem ou filtro (pílulas "Recentes", "Mais fortes"). Outros ângulos dos mesmos dados viram gráfico ou indicador, não outra lista. **Blocos com o mesmo desenho também contam como listas iguais**: dois cartões vizinhos de barras deitadas com nome e valor (dois rankings lado a lado) leem como a mesma lista repetida. Cada bloco vizinho ganha um desenho diferente (ver seção 9, "Um desenho por bloco").
- Esconda o que não existe: seção sem dados, histórico vazio ou cartão que nunca vai mostrar nada não aparece.

## 6. Componentes

- **Ícone é obrigatório (sem exceção):**
  - **Ícone da aba** em todo app e página: favicon (`icon`), `apple-icon` e `<title>` curto. Nunca a aba com o ícone padrão do framework ou do navegador.
  - **Ícone em todo item de menu:** lateral, barra inferior, menu suspenso, abas de navegação entre áreas. Item de menu só com texto não existe.
  - Ícone de PWA (`manifest`) quando o app pode ser instalado.
- **Ícones de conteúdo:** todo ícone de conteúdo fica dentro de um container quadrado arredondado com fundo da cor (ex.: `size-9 rounded-xl bg-primary/14 text-primary`), também dentro de cartões. Exceção: chevron de linha clicável e ícone dentro de botão/badge que já tem fundo. Não tire ícones para ganhar espaço: encurte o texto. Use ícones de verdade (logos de empresa quando fizer sentido).
- **Nada de texto clicável.** Toda ação é botão (pílula com fundo) ou a linha/cartão inteiro clicável. Inclui "Ver todas", breadcrumbs e nomes em tabelas.
- **Linha de lista padrão:** `[ícone em container] [rótulo pequeno em cima / valor embaixo] [coluna direita: chip em cima, valor embaixo] [chevron]`. Chip de status vai no canto direito, em cima do valor; nunca grudado no título nem numa linha solta.
- **Datas:** em blocos (dia grande, mês/semana pequeno), não uma string longa.
- **Animação de entrada nos gráficos (obrigatória):** quando a tela abre, as barras sobem do zero e as linhas e áreas andam da esquerda para a direita (~800 ms, `ease-out`). Réguas, medidores e barras empilhadas feitos à mão crescem com `.grow-x` / `.grow-y` (`tokens.css`). Use `chart.enter` + `useChartMotion()` do kit: anima na entrada e ao trocar o período, e fica parado para quem pede "reduzir movimento" no sistema (o `check-ui` tira os prints assim). O que **não** anima: o balão do hover (`<Tooltip isAnimationActive={false} />`), a etiqueta de valor em cima da barra (`PillMark`: aparece direto na posição final, desenhada com `<ReferenceDot shape>` e não com `LabelList`, que espera ou acompanha a animação), o hover em si e números (nada de contador rolando).
- **Gráficos:** ocupam toda a altura e largura do cartão; eixo com respiro (o primeiro rótulo não encosta na linha); sem contorno branco ao clicar (`.recharts-wrapper *:focus { outline: none }`); legenda e tooltip com cores do tema. Tooltip sem animação (`<Tooltip isAnimationActive={false} />` no Recharts): a animação padrão faz a caixa deslizar atrás do mouse, lenta.
- **Menu lateral (web) padronizado e compactável:** cada área com **uma palavra** ("Início", "Vendas", "Estoque"; o título comprido fica só na página), ícones da mesma família, mesmo tamanho (18 px) e mesmo peso, o ativo com fundo `bg-accent` e o ícone na cor de destaque. O botão de recolher fica **sempre embaixo**, como último item do menu (depois do tema), no mesmo lugar com o menu aberto ou recolhido; nunca no topo ao lado da marca. Recolhido, o menu mostra só os ícones (largura ~84 px, nome no `title` e no `aria-label`, tema em botão único) e a escolha fica salva. Itens com textos de tamanhos diferentes, ícones de estilos misturados ou menu que não recolhe foram apontados como amadores.
- **Chip do filtro ligado fica à esquerda dos controles** ("Abr ×" antes das abas e do seletor), e o seletor tem largura fixa: quando o chip aparece, nada sai do lugar. À direita ele empurrava o seletor ("desloca o filtro e fica feio").
- **Cabeçalho do celular (aprovado):** a **marca** à esquerda (logo em quadrado + nome do app) e um **botão de menu** redondo com ícone à direita. O menu abre as ferramentas secundárias (cada uma com ícone) e o tema. O título da página ("Início") fica só no web (`sr-only lg:not-sr-only`); no celular a barra inferior já diz onde a pessoa está. Nada de logo + título + subtítulo + tema espremidos numa linha (o usuário achou estranho).
- **Barra inferior do celular:** 4 áreas, cada uma com ícone e rótulo; a ativa com o ícone dentro de uma pílula tingida (`h-7 w-12 rounded-full bg-primary/14`) e o texto na cor de destaque.
- **Mobile:** botões principais de uma tela de detalhe fixos no rodapé; tela de detalhe mostra só o necessário; ao selecionar outra opção, rolar para o topo.

## 7. Interação

- **Balão do "i" sempre inteiro na tela:** abre num portal com posição fixa, preso a 8 px das bordas e virando para cima quando falta espaço embaixo (`InfoTip` em `assets/ui.tsx`). Nunca `absolute` dentro do cartão: corta em `overflow-hidden` e vaza pela borda direita ou de baixo.
- **Sem barra de rolagem visível no celular** (abaixo de `lg`): `scrollbar-width: none` e `::-webkit-scrollbar { display: none }` (já em `assets/tokens.css`). A rolagem continua pelo dedo.
- **Tudo que é clicável mostra a mãozinha** (`cursor: pointer`). O Tailwind v4 deixa botão com a seta padrão: a regra global está no `@layer base` de `assets/tokens.css`; o `check-ui` acusa clicável sem mãozinha.
- **Hover só muda o fundo.** Proibido hover que sobe, cresce ou move (`translate`, `scale`, sombra que "eleva") e hover que muda ou acende borda.
- O fundo do hover acompanha o arredondamento do item: primeiro e último item de uma lista arredondada também têm cantos arredondados no hover (`overflow-hidden` no cartão ou `first:rounded-t-* last:rounded-b-*`).
- **Todo toque tem resposta imediata:** estado pressionado no mobile (`active:bg-*` ou leve `scale(0.98)` só ao pressionar, nunca no hover) e tela de carregando assim que a navegação começa: fundo do tema com anel girando na cor de destaque (`NavLoading`/`Spinner` em `assets/ui.tsx`). Nada de skeleton cinza que não tem a forma da tela real.
- Selects e dropdowns com respiro entre o texto e a seta.

## 8. Padrões de código úteis (Tailwind)

```tsx
// Ícone em container
<span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/14 text-primary [&_svg]:size-[18px]"><Wallet /></span>

// Linha de lista clicável (hover só no fundo, sem mover)
<a className="flex min-h-16 items-center gap-3 px-4 py-2.5 hover:bg-accent/40 active:bg-accent/60">...</a>

// Seção: título fora do cartão
<section><h2 className="mb-2 text-sm font-semibold">Últimos jogos</h2><div className="rounded-2xl bg-card">...</div></section>

// Dois cartões simétricos
<div className="grid gap-3 lg:grid-cols-2 items-stretch"><Card className="h-full" /><Card className="h-full" /></div>
```

## 9. Dashboards (painéis de dados)

**Primeiro o plano de informação** (`references/informacao.md`): o que mostrar, em que ordem e onde. A beleza das referências não salva um painel com os dados errados ou nos lugares errados.

**Copie as referências do usuário de verdade.** Antes de desenhar, abra todas as imagens de `references/exemplos-dashboards/` e leia `references/anatomia-dashboard.md` (as fotos traduzidas em medidas: espaçamento, posição de cada texto, formato dos chips). Monte com o kit `assets/dashboard.tsx`, que já segue essas medidas. O usuário aprovou este caminho ("80% bem legal"); o que falta é ficar **mais parecido** com as fotos, não mais criativo.

Reprovados (não repita):
- Estilo "centro de operações": contorno de 8 px, CAIXA ALTA espaçada, ciano neon, mapa escuro com grade e brilho, pulsos constantes ("filme de ficção científica").
- **Cartão de destaque preenchido de cor** ("péssima ideia"). Todos os cartões são neutros; cor só nas marcas de dado e nos chips.
- Título de cartão com ícone em quadradinho ao lado e em negrito escuro. Nas fotos o título é cinza, peso médio, sozinho.

Estrutura (genérica, escolha pelo plano de informação; a posição segue a prioridade):
- **Faixa de indicadores** (`Kpi`): 4 ou 5 iguais lado a lado. Rótulo cinza + ícone em círculo tingido à direita; número de 30 px; chip de variação + texto cinza na mesma linha.
- **Área principal:** o gráfico ou mapa protagonista ao lado da única tabela, ou dois gráficos.
- **Faixa de apoio:** 3 ou 4 cartões menores (partes de um todo, medidor, distribuição).
- **Uma grade só para todas as faixas** (ex.: 12 colunas ou `repeat(5, 1fr)`), cada cartão com `col-span-*`, para as bordas ficarem alinhadas de cima a baixo. O `check-ui` acusa bordas "quase alinhadas".

Regras do padrão:
- **Cada informação aparece uma vez.** Se um cartão mostra a divisão (ex.: celular x computador), o gráfico principal não repete essa divisão nos números do topo nem nas linhas. O gráfico principal compara o período atual com o anterior (linha cinza tracejada).
- **Cartão do tamanho do conteúdo.** Medidor, número único e legenda curta ficam em cartões estreitos (3 de 12 colunas). Dentro do cartão, troque o arranjo pela largura **do cartão**, não da tela (`@container` + `@sm:flex-row`): lado a lado quando cabe, empilhado quando estreito. Nunca um medidor pequeno no meio de um cartão de meia tela.
- **Linha de tabela numa linha só** no web: posição, nome, coluna de números e coluna de chips (variação "Vs véspera" ou "Novo"), com larguras fixas para alinhar entre as linhas. Nunca chip grudado depois do número: chip fica na coluna de chips, número na coluna de números. Chips de uma mesma coluna têm **a mesma largura** (largura fixa com conteúdo centrado, ex.: `w-[4.75rem] justify-center`), nunca do tamanho do texto. No celular, número em cima do chip na coluna da direita.
- **Contador de aba bate com o que dá para ver.** Se a aba diz "Todos 60" e só cabem 5 linhas, a lista tem páginas: rodapé baixo com "1 a 5 de 60" e dois botões redondos de seta (sem rolagem interna). Ao trocar de aba, volta para a primeira página.
- **Partes de um todo mostram a porcentagem de cada parte** (Como leem: site no celular, computador, aplicativo), não só um medidor de uma parte só.
- **Variação:** compare com o período anterior de mesmo tamanho. Chip de canto pequeno (6 px) com seta: verde suave quando melhorou, vermelho suave quando piorou, cinza quando igual (`DeltaChip`, com `invert` quando subir é ruim).
- **Neutro primeiro:** 80 a 90% da tela em cinza. Barras em pílula finas cinza com **uma** destacada na cor e etiqueta escura em pílula (`PillMark`). Grade tracejada, linha de média pontilhada.
- **Separadores tracejados** dentro do cartão (`Dashed`), entre linhas de tabela e antes de rodapés `KeyValue`.
- **Uma lista por tela.** Conta como lista: linhas com nome + vários valores (tabela, feed, ranking com colunas). Não conta: até 8 barras com nome e valor (é um gráfico) e legenda, **desde que o desenho não se repita em outro cartão da tela**. A lista tem abas com contagem (`Tabs`).
- **Lista longa (mais de ~8 linhas) mora num cartão vertical próprio**: uma coluna da grade (3 ou 4 de 12), ao lado dos gráficos, de cima a baixo (`row-span`), com uma coluna de linhas só e páginas pela altura (`ListaAlta` do kit: "1 a 11 de 23"). Alternativa quando os grupos têm sentido (por porte, por status): 3 cartões separados lado a lado, cada um com título. **Nunca** um cartão largo no fim da tela com as linhas partidas em 2 ou 3 blocos lado a lado: as linhas parecem se juntar na horizontal e a tela fica bagunçada (reprovado num painel industrial). No celular a lista vai para o fim. No cartão estreito ficam 2 ou 3 colunas de dado; as outras aparecem pela largura do cartão (`@container`).
- **Um desenho por bloco.** Na mesma tela, dois cartões não usam o mesmo desenho para dados diferentes. Repertório para variar: barras deitadas (ranking de motivos), partes de um todo (barra empilhada + legenda com %), colunas (distribuição), colunas agrupadas (comparar 2 ou 3 medidas entre categorias), alvo em anéis (distância de um ponto), cascata, funil, linha no tempo.
- **Blocos de texto lado a lado não viram cartão alto.** Três blocos "nome + número + linhas" em colunas dentro de um cartão alto deixam vão em cima e embaixo (reprovado em "Por tipo de item"). Se os blocos comparam as mesmas medidas entre categorias, vire um gráfico de colunas agrupadas (uma cor por medida, legenda curta no cabeçalho, medidas no mesmo sentido: todas "quanto menor, melhor"), que ocupa a altura do cartão.
- **Gráfico de bater o olho.** Se a pessoa precisa raciocinar para ler, o gráfico está errado. "O que somou e o que tirou" (meta ao realizado) são **barras que saem do meio**: para a esquerda o que tirou, para a direita o que somou, uma linha por fator, valor com sinal ao lado, o resultado em número no canto do cartão e o "feito de planejado" embaixo de cada nome (`Divergentes`). "Para onde vai o total" é um **quadro de 100 quadradinhos** ("De cada 100 horas, 40 produzindo"), com a legenda e a % ao lado (`Quadro100`). Reprovados num painel industrial, nesta ordem: barras deitadas com segmento solto, barra 100% de 5 cores, **cascata** e **funil** ("ainda são gráficos complexos de entender").
- **Partes de um todo sempre da maior para a menor**, no desenho e na legenda (40%, 25%, 15%, 12%, 8%). Nunca na ordem do cadastro.
- **Muitos itens pequenos e parecidos viram poucos temas.** Dezenas de motivos com poucos % cada, em barras, não dizem nada ("gráfico bem normal e ruim"). Agrupe em 6 a 8 temas com nome de uma palavra (Espera, Pessoas, Transporte) e mostre em colunas com a % em cima de cada uma; o detalhe de cada tema vai no "i".
- **Blocos proporcionais (treemap): todo bloco precisa dar para ler.** No máximo 5 ou 6 blocos; os pequenos entram em "Outros". Cada bloco mostra nome e %, sem texto cortado e sem quadradinho mudo. O maior na cor de destaque, os outros neutros. O desenho ocupa o corpo todo do cartão.
- **O conteúdo do cartão começa na borda do cartão.** Rótulos e barras alinham à esquerda com o título, sem recuo. Bloco centralizado com `mx-auto` + `max-w-*` dentro de um cartão largo cria um recuo à esquerda que parece erro ("muito padding no texto do gráfico, padding start"). Para limitar a largura de uma linha, use só `max-w-*`, sem centralizar.
- **Sem sobra dentro do cartão.** Desenho pequeno no meio de um cartão largo foi reprovado ("muito espaço vago", "muito espaço no gráfico de posição"). Duas saídas: o desenho toma a forma do cartão pela largura dele (`@container`: quadro 10 x 10 com legenda ao lado no estreito, 20 x 5 de ponta a ponta com legenda embaixo no largo; alvo com a altura do cartão), ou o cartão encolhe e a faixa ganha outro cartão pequeno com outra informação.
- **Tamanho máximo dos desenhos:** medidor até 224 px de largura e número de 28 px; minibarras até 64 px de altura; número de indicador até 30 px. Em cartão grande, sobra espaço em volta (ou o cartão ganha outro conteúdo), o desenho não cresce.
- **Frescor do dado:** só para dado ao vivo, que muda várias vezes por hora: chip "Atualizado há 2 min" (relativo, anda sozinho) perto do dado. Dado de sorteio, de fechamento diário ou de publicação esparsa **não ganha subtítulo de frescor**: "Dados até 8 nov" embaixo do título foi reprovado ("bem ruim"). A data já aparece no próprio dado (o último sorteio na lista, a data do próximo no cartão). Nunca "Atualizado agora".
- **Filtros ligados:** tocar numa barra, região ou linha de legenda filtra a tela e mostra uma pílula "Nome ×" no cabeçalho para limpar. O gráfico mostra a seleção: a etiqueta de valor vai para a barra escolhida (nunca fica no item atual), as outras ficam apagadas, e tocar de novo desfaz.
- **Cabeçalho da página:** web: título de 28 px semibold sozinho (como "General metrics" do Skymetrics), sem subtítulo; à direita o período em pílulas (se houver), a pílula do filtro ligado ("Concurso 3080 ×") e o tema. Celular: o cabeçalho é o do app (marca + menu, seção 6); o título da página some (`sr-only`), o tema vai para o menu e o período, se houver, fica numa linha sozinho na largura toda.
- **Carregando e erro:** só o anel girando enquanto carrega; erro com `FillEmpty` (ícone + uma linha). Nunca outro cabeçalho piscando.
- **21:9 (4xl) sem cartão vazio:** use uma grade de 12 colunas. Linha principal: gráfico protagonista 5, segundo gráfico 3 ou 4, lista 3 ou 4 no cartão vertical dela (uma coluna de linhas; nunca partida em blocos lado a lado). Faixa de apoio: nenhum cartão com mais de ~40% de área vazia: ponha medidor e valores lado a lado, dê 3 ou 4 colunas à legenda, ou acrescente mais um cartão pequeno. Gráfico nunca mais largo que ~4:1.
- **Tela larga cabe na janela, sem rolagem** (o usuário usa widescreen e cobrou: "a skill pede para o dash tentar ao máximo ficar na altura"). A partir de 1920 x 800 (variante `fit:` do `tokens.css`) o dashboard inteiro fica na altura da janela: moldura `fit:h-dvh fit:overflow-hidden`, grade `fit:h-full fit:grid-rows-[auto_minmax(0,1fr)_minmax(0,1fr)]` (indicadores + duas faixas iguais), cartões `fit:h-auto!` e gráficos ocupando o corpo. São no máximo duas faixas de gráficos: redistribua as colunas (`fit:col-span-*`, `fit:order-*`) em vez de criar uma terceira faixa. A lista fica no cartão vertical dela, pelas duas faixas, paginada pela altura. Nem estica (cartões de 800 px) nem passa da borda. Abaixo disso (notebook) a tela rola, com a primeira tela cabendo inteira.
- **Altura:** em tela alta (≥ 800 px, variante `tall` do `tokens.css`) tudo cabe sem rolagem (`lg:tall:h-dvh`). Em notebook baixo, a área principal ocupa o resto da primeira tela e a faixa de apoio fica logo abaixo. No 21:9 a grade ganha colunas (mais um gráfico ou a tabela em duas colunas), nunca um cartão vazio nem um desenho gigante.
- **Mapa** (quando houver): terra cinza, mar da cor do cartão, sem grade; fracos em cinza, fortes na cor, rótulo nos 3 principais; pulso só no que acabou de chegar. Mapa-múndi em `FillMap`; coluna com a largura da proporção em `useMapColumns` (`assets/painel.tsx`).
- Continuam valendo: dois temas, paleta validada inteira (bloco completo em `paletas.md`), sem "—", " · " ou "…", hover só no fundo, mãozinha, check e prints. Marque a raiz com `data-ui="painel"`.

## 10. Checklist antes de mostrar (rode e olhe os prints)

- [ ] Ícone da aba (favicon, apple-icon, título) e ícone em todo item de menu? Celular com marca à esquerda e menu à direita, sem subtítulo de frescor embaixo do título?
- [ ] Gráficos com animação de entrada (barras sobem, linhas andam), balão do hover sem animação, e parados com "reduzir movimento"?
- [ ] Mãozinha em tudo que é clicável? Balões do "i" e caixas de hover dentro da tela e sem animação atrasada? Sem barra de rolagem no celular?
- [ ] Cartões de faixas diferentes com as bordas alinhadas (mesma grade)? Nenhum cartão preenchido de cor? Chips de variação verde/vermelho suaves com seta?
- [ ] Mexi só no que foi pedido e só no breakpoint pedido? Nada existente sumiu?
- [ ] Prints em 390 px, 1366×650, 1536×730 e 1920×950 conferidos um a um, nos temas claro **e** escuro (e 320 px sem estouro horizontal)?
- [ ] Nada passa da borda de baixo da primeira tela? Mapas e gráficos limitados pela altura da janela?
- [ ] Tema segue o sistema, tem botão de troca e nenhuma cor fixa (`#000`, `#fff`, hex solto) quebra o outro tema? Cor de destaque escolhida para este projeto, não laranja por padrão?
- [ ] Tela larga (1920 x 950, 2560 x 960, 2752 x 1100, 3440 x 1300): o dashboard cabe na janela sem rolagem, sem cartão esticado e sem sobra dentro de cartão? Cada gráfico se entende de bater o olho? Partes de um todo da maior para a menor?
- [ ] Menu lateral com uma palavra por área, ícones iguais e botão de recolher? Chip do filtro à esquerda, sem deslocar os controles?
- [ ] Só uma lista na tela? Outros recortes viraram filtro, ordenação ou gráfico? Lista longa num cartão vertical próprio (ou em cartões separados), nunca em blocos de linhas lado a lado no mesmo cartão? Nenhum desenho repetido em dois cartões (duas barras deitadas iguais)?
- [ ] Paleta inteira de `paletas.md` (sem cores avulsas)? Dado ordenado numa cor só? Nenhum número pintado com cor de série? Vermelho/amarelo só para status?
- [ ] Plano de informação feito (`informacao.md`)? A decisão ou ação mais urgente está em cima à esquerda, junto com o motivo e o prazo? Nada importante faltando, nada da tela antiga sumido sem destino, nenhum indicador de curiosidade ou quase sempre zero?
- [ ] Uma versão só da tela (sem `?visao=`, sem seletor de versões)? Hierarquia clara: um bloco principal, poucos números de destaque, e só os que mudam uma decisão?
- [ ] Em 2560×960 e 3440×1300 a tela ganha colunas, sem gráfico achatado nem linha de lista gigante?
- [ ] Fonte fora da lista proibida, números tabulares, todo texto começando com maiúscula?
- [ ] Simetria: cartões vizinhos com a mesma altura, conteúdo preenchendo, colunas alinhadas, grid sem sobra, mesmo número de linhas dos dois lados?
- [ ] Abrir uma linha da lista (acordeão), trocar de aba ou filtrar não mexe nos cartões vizinhos (nada desce, cresce ou muda de tamanho)?
- [ ] Nenhum cartão com vão por dentro (linhas espalhadas, título preso em cima e conteúdo no meio, gráfico com teto ao lado de vizinho esticado)? No ultrawide, texto curto não divide a faixa com gráficos altos?
- [ ] Títulos de seção fora dos cartões (no dashboard: título cinza dentro, em cima à esquerda) e alinhados? Nenhum cartão dentro de cartão?
- [ ] Dashboard: abri as fotos de referência e comparei lado a lado (título, indicador, chips, tabela, legenda, medidor)? Nenhum medidor ou minibarra gigante no 21:9?
- [ ] Todo ícone em container? Nenhum texto clicável? Chips no canto direito em cima do valor?
- [ ] Sem bordas coloridas, sem hover que move ou muda borda, hover com cantos certos?
- [ ] Sem frases explicativas fixas, sem "Rótulo: valor", sem " · ", sem "—", sem "…"?
- [ ] Tela preenchida até o fim, sem metade vazia e sem seções vazias?
- [ ] Largura total no web, sem `max-w` centralizado?

Rode antes de mostrar:

```sh
node <pasta-da-skill>/scripts/lint-ui.mjs src
node <pasta-da-skill>/scripts/check-ui.mjs http://localhost:3000/<rota-alterada> --out=.ui-check
```

Sem Node ou Playwright, faça a varredura mínima:

```sh
grep -rnE "hover:(-?translate|scale|shadow|border|ring)|truncate|text-ellipsis|line-clamp| · |—|max-w-(3|4|5|6|7)xl.*mx-auto|Inter|Roboto|Geist|Poppins" src
```
