# Anatomia de dashboard (medida nas referências do usuário)

As fotos estão em `exemplos-dashboards/`. Elas definem o **nível de acabamento** que o usuário gosta, e este arquivo traduz esse acabamento em medidas. Use as medidas como **valores de partida** quando a direção do projeto não pedir outra coisa. O que é princípio (respiro entre rótulo e número, chip suave com seta, título discreto, marcas finas, tabela numa linha só, nenhum cartão colorido) vale sempre; o que é estilo (raio de 20 px, título cinza de 15 px, ícone em círculo, número de 30 px, barras em pílula, separador tracejado) pode mudar com a direção visual, desde que coerente no app inteiro. Os componentes prontos estão em `assets/dashboard.tsx`.

**Quando uma medida daqui discordar de `medidas.md`, vale `medidas.md`:** ele é a escolha direta do usuário (2026-11-13), mais justa que as fotos (padding 16, número 36/600 a 4 px do rótulo, 12 entre cartões).

## Superfície

| Item | Medida | De onde |
|---|---|---|
| Fundo da página | um degrau mais escuro que o cartão (claro `#f1f1f4`, escuro `#0b0b0e`) | todas |
| Cartão | `rounded-[20px] bg-card`, **sem contorno**, sem sombra no claro | Skymetrics, Spectra |
| Padding do cartão | 16 px (`p-4`) | calibragem |
| Espaço entre cartões | 12 px | calibragem |
| Margem da página | 12 px no web, 16 px no celular | calibragem |
| Título da página | 28 px semibold; frescor do dado em 13 px cinza ao lado ou embaixo | Skymetrics "General metrics" |
| Cartão colorido de destaque | **não usar** (o usuário reprovou) | |

## Cabeçalho de cartão

```
Vendas e devoluções   (i)                     [Abas | com | contagem]   ← ação à direita
Total de vendas subiu 7% na semana                                       ← (opcional) frase de dado, 14 px, cor normal
```
- Título: 15 px, peso médio, **cinza** (`text-muted-foreground`). Não é negrito escuro.
- Sem ícone em quadradinho ao lado do título. Ícone, quando houver, vai num **círculo tingido no canto direito** (`IconCircle`, NiceDash).
- Ação à direita: abas, seletor de período ou "Ver todos". Nunca as duas coisas (ícone e ação).

## Indicador (KPI)

```
Pedidos                              (◎)      ← 14 px cinza, ícone em círculo tingido 36 px
2.792                                          ← 36 px, peso 600, tabular, 4 px abaixo do rótulo
[↗ 11%]  Vs semana anterior                    ← chip + 13 px cinza na MESMA linha, 8 px abaixo do número
```
- Padding de 16 px, cartão justo: o ar fica entre os cartões e os grupos, não entre as três linhas.
- Todos os indicadores iguais: mesma estrutura, mesma altura (Skymetrics tem 5 lado a lado).
- No celular: 1 por linha no 320, 2 por linha a partir de 390 só se o número couber sem quebrar.
- Sem variação disponível: só o texto cinza ("Seg, 26 out", "Recorde do período").

## Chips

| Tipo | Forma | Cores |
|---|---|---|
| Variação | `rounded-md` (6 px), altura 24, `px-1.5`, 12 px semibold, seta antes do número | melhor: verde suave (`bg-positive/12 text-positive`); pior: vermelho suave; zero: cinza |
| Status de linha | `rounded-md`, altura 24, `px-2`, 12 px médio | tons suaves: cinza, destaque, verde, âmbar, vermelho (Moveon) |
| Contagem ao lado de título | `rounded-md` com contorno fino, 12 px cinza (Moveon "Orders 264") | |
| Seta de tabela | círculo de 20 px com seta de 12 px, verde ou vermelho suave (Skymetrics) | |

Pílula redonda (`rounded-full`) fica para **botões e abas**, não para chips de dado.

## Números no topo de um gráfico (Skymetrics "Sales & Returns")

```
Leituras por dia                                  ● Celular          ● Computador
Leituras caíram 4% no mês                         4,8 mi [↘ 4%]      1,2 mi [↗ 2%]
```
- À esquerda: título e frase de dado. À direita: uma coluna por série com bolinha + nome (13 px cinza), número (26 px médio) e chip.
- Substitui a legenda: a bolinha já identifica a série. No kit: `DashCard aside={<SeriesStat .../>}`; com `onClick` vira filtro ligado.
- Gráfico com altura fixa no celular (`h-64`) e `lg:flex-1` só no web: `flex-1` sem `lg:` zera a altura no celular (o gráfico some).

## Gráficos

- Grade horizontal **tracejada** (`4 4`), sem linha de eixo, texto do eixo 12 px cinza.
- Barras em pílula **finas** (até 18 px), cinza, com **uma** destacada na cor de destaque e etiqueta escura em pílula em cima (Spectra).
- Linha suave (`monotone`) de 2 px com área em degradê bem leve (Acquire, Skymetrics); comparação em cinza claro atrás.
- Balão do hover: cartão branco com canto de 12 px, linha 1 cinza (data), linha 2 escura (valor). Sem animação.
- Entrada: barras sobem do zero e linhas andam da esquerda para a direita em ~800 ms quando a tela abre (`chart.enter` + `useChartMotion`).
- Funil/etapas (Skymetrics "Sales conversion"): barras finas cinza com a primeira de cada etapa colorida e o % em cima.

## Partes de um todo (Skymetrics "Traffic Sources")

```
Gasto         Custo/lead    Impressões    Cliques        ← StatColumns: rótulo 13 px cinza, valor 14 px médio
R$ 11.596     R$ 5,40       7.574.183     60.784
- - - - - - - - - - - - - - - - - - - - - - - - - -        ← tracejado
████████████▌ ███████▌ ██▌ █▌ ▌                          ← StackedBar 8 px, pílulas separadas por 4 px
● Loja      3.707          ● Direto    1.490             ← LegendGrid 2 colunas, linhas de 36 px
● Instagram   979          ● Google      728
```

## Medidor (Skymetrics "Sessions", Delivery "Score")

- Cartão estreito (3 de 12 colunas). Medidor e valores lado a lado quando o **cartão** tem largura (`@container` / `@sm:flex-row`), empilhados quando estreito.

- Meia-lua, traço de 12, pontas redondas, resto em cinza claro. Número 28 px no centro, legenda 13 px cinza embaixo.
- **Largura máxima 224 px** (`max-w-56`). Em cartão grande, sobra espaço em volta, não aumenta o desenho.
- Rodapé: tracejado + `KeyValue` ("Total de sessões ······ 4.182").

## Tabela (Skymetrics "Sales by Region", Moveon "Orders")

- **Numa linha só no web.** Colunas: posição, nome, números (`4.5rem`) e chips (`5.25rem`, "Vs véspera": DeltaChip ou "Novo"). Chip com chip, número com número; nunca chip logo depois do número. No celular, número em cima do chip numa coluna só.

- Cabeçalho: 13 px cinza, sem fundo (ou faixa cinza arredondada, como no Delivery).
- Linhas: 48 a 56 px, separadas por **linha tracejada**, primeira coluna escura em peso médio, números à direita.
- Status em `StatusChip`; variação com `TrendDot` ao lado do número.
- Abas com contagem em cima à direita (`Tabs`): "Todos 100 | Subindo 39 | Novos 19".
- Largura da linha até ~900 px. Lista longa (mais de ~8 linhas): cartão vertical próprio de 3 ou 4 colunas da grade, ao lado dos gráficos, com uma coluna de linhas e páginas pela altura. Nunca blocos de linhas lado a lado dentro do mesmo cartão; se precisar dividir, são cartões separados, cada um com título.

## Celular (Spectra mobile)

- Os mesmos cartões empilhados, padding de 20 px, título e ação na mesma linha (a ação desce se não couber).
- Tabela: esconda colunas secundárias; nunca empilhe dois chips por linha.
- Cabeçalho da página em duas linhas: logo, título e tema compacto; seletor de período sozinho na largura toda.

## O que NÃO copiar das fotos

- Cartão colorido de destaque (NiceDash, Spectra, Delivery): o usuário reprovou.
- Cartão dentro de cartão (Delivery): use divisórias tracejadas.
- Ilustração decorativa (Spectra "Profit"), avatar sem função, texto clicável "More" (vira botão).
- Rótulo em CAIXA ALTA (Acquire): o usuário reprovou no estilo "centro de operações".
