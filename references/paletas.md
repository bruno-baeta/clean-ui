# Paletas validadas

Cada paleta é um conjunto que combina: cinzas da base, uma cor de destaque, uma escala ordenada de uma cor só (`--seq-1` fraco → `--seq-4` forte) e três cores categóricas em ordem fixa. Todas passaram no validador do guia `dataviz` (`validate_palette.js`) contra o cartão claro `#ffffff` e o escuro `#111111`:

- escala ordenada: `--ordinal` (uma cor, claridade crescente, degraus visíveis, ponta fraca com contraste ≥ 2:1);
- categóricas: `--pairs all` (faixa de claridade, daltonismo e visão normal entre todos os pares).

Avisos que exigem cuidado:
- Aqua `#1baf7a` no tema claro tem contraste 2,8:1: quando usada, a série precisa de rótulo direto ou tabela.
- A cor categórica 3 é para gráficos com 3 séries; nunca vire cor de marca.

**Como usar:** projeto com marca usa a família da marca (MegaLab: Coral). Sem marca, escolha você a paleta que combina com o assunto e diga qual e por quê na entrega. Não renderize várias paletas para o usuário escolher. Copie o **bloco completo** do fim deste arquivo para o CSS do projeto, no lugar do trecho de cores do `tokens.css`. Se precisar de uma paleta nova, valide antes:

```sh
node <dataviz>/scripts/validate_palette.js "#claro,#...,#forte" --ordinal --mode light --surface "#ffffff"
node <dataviz>/scripts/validate_palette.js "#cat1,#cat2,#cat3" --pairs all --mode dark --surface "#111111"
```

Crítico (igual em todas): claro `#c53030`, escuro `#f87171`. Para estado ruim (com ícone e rótulo) e para o chip de variação "piorou".
Positivo (igual em todas): claro `#15803d`, escuro `#4ade80`. Só para o chip de variação "melhorou" e status bom; **nunca** como cor de marca.

## Cobalto (azul; cinzas frios)
Ciência, mapas, finanças, ferramentas. A mais neutra.

| Papel | Claro | Escuro |
|---|---|---|
| Fundo / cartão / borda | `#f5f6f8` / `#ffffff` / `#e2e5ea` | `#07080a` / `#111317` / `#23262d` |
| Texto / secundário | `#0d1117` / `#57606a` | `#eef1f5` / `#9aa3ad` |
| Destaque | `#256abf` | `#5598e7` |
| Escala 1→4 | `#86b6ef` `#5598e7` `#256abf` `#104281` | `#184f95` `#2a78d6` `#5598e7` `#9ec5f4` |
| Categórica 1, 2, 3 | `#2a78d6` `#eb6834` `#1baf7a` | `#3987e5` `#d95926` `#199e70` |

## Índigo (violeta-azulado; cinzas frios)
Produtos digitais, educação, dados de uso. Mais marcante que o Cobalto.

| Papel | Claro | Escuro |
|---|---|---|
| Fundo / cartão / borda | `#f6f6f9` / `#ffffff` / `#e4e4ec` | `#08080b` / `#121218` / `#25252f` |
| Texto / secundário | `#0e0e16` / `#5a5a6e` | `#efeff6` / `#a0a0b4` |
| Destaque | `#4338ca` | `#959efa` |
| Escala 1→4 | `#959efa` `#6366f1` `#4338ca` `#312e81` | `#4338ca` `#6366f1` `#959efa` `#c7d2fe` |
| Categórica 1, 2, 3 | `#5b54e8` `#e8743b` `#1baf7a` | `#7b7ff0` `#d95926` `#199e70` |

## Ciano (azul-esverdeado; cinzas frios)
Oceano, clima, saúde, sensores. Clima técnico e calmo.

| Papel | Claro | Escuro |
|---|---|---|
| Fundo / cartão / borda | `#f3f7f8` / `#ffffff` / `#dde6e9` | `#060909` / `#0f1414` / `#1f2829` |
| Texto / secundário | `#0a1214` / `#51636a` | `#ecf4f5` / `#97a9ae` |
| Destaque | `#0e7490` | `#22d3ee` |
| Escala 1→4 | `#22b8d4` `#0891b2` `#0e7490` `#164e63` | `#155e75` `#0891b2` `#22d3ee` `#a5f3fc` |
| Categórica 1, 2, 3 | `#0a8fb0` `#e8743b` `#6250d6` | `#1aa0bf` `#d95926` `#8a6ee8` |

## Coral (laranja; cinzas quentes)
Esporte, jogos, varejo, energia. A mais quente (é a família do MegaLab).

| Papel | Claro | Escuro |
|---|---|---|
| Fundo / cartão / borda | `#f7f6f4` / `#ffffff` / `#e7e3de` | `#0a0908` / `#141210` / `#2a2622` |
| Texto / secundário | `#14110f` / `#625a52` | `#f5f2ee` / `#aca39a` |
| Destaque | `#c2410c` | `#fb923c` |
| Escala 1→4 | `#fb923c` `#ea580c` `#c2410c` `#7c2d12` | `#9a3412` `#ea580c` `#fb923c` `#fed7aa` |
| Categórica 1, 2, 3 | `#e2602a` `#2a78d6` `#1baf7a` | `#d95926` `#3987e5` `#199e70` |

## Blocos CSS completos (copie inteiro)

Cada bloco já traz tudo que os componentes da skill usam (cinzas, gráfico, mapa, positivo/negativo para os chips de variação).
O escuro é grafite quase neutro (o usuário preferiu ao preto azulado). **Como encaixar:** comece pelo `assets/tokens.css` inteiro e troque só os valores destas variáveis nas três formas que ele já tem (`:root`, `@media (prefers-color-scheme: dark) { :root:not(.light) }` e `:root.dark`). O resto do `tokens.css` (`color-scheme`, `--font-brand`, `--info` = destaque, `--focus` = texto secundário, `--scrim`, `@theme`, base) fica como está.

### Cobalto

```css
:root {
  --background: #f5f6f8; --card: #ffffff; --card-2: #fafbfc; --muted: #eff1f3; --accent: #ebedf0;
  --border: #e2e5ea; --foreground: #0d1117; --muted-foreground: #57606a;
  --primary: #256abf; --primary-foreground: #ffffff;
  --seq-1: #86b6ef; --seq-2: #5598e7; --seq-3: #256abf; --seq-4: #104281;
  --cat-1: #2a78d6; --cat-2: #eb6834; --cat-3: #1baf7a;
  --critical: #c53030; --critical-foreground: #ffffff; --negative: #c53030; --positive: #15803d; --warning: #b45309;
  --chart-1: var(--cat-1); --chart-muted: #cdcfd2; --chart-grid: #eeeff2; --chart-axis: #6b737c;
  --map-sea: #ffffff; --map-land: #e9ecef; --map-line: #c6cad0;
}
:root.dark {
  --background: #0b0c0e; --card: #16181c; --card-2: #111215; --muted: #1f2228; --accent: #21252b;
  --border: #262a31; --foreground: #eef1f5; --muted-foreground: #9aa3ad;
  --primary: #5598e7; --primary-foreground: #06121f;
  --seq-1: #184f95; --seq-2: #2a78d6; --seq-3: #5598e7; --seq-4: #9ec5f4;
  --cat-1: #3987e5; --cat-2: #d95926; --cat-3: #199e70;
  --critical: #f87171; --critical-foreground: #1a0606; --negative: #f87171; --positive: #4ade80; --warning: #fbbf24;
  --chart-1: var(--cat-1); --chart-muted: #40444a; --chart-grid: #202329; --chart-axis: #8a929c;
  --map-sea: #16181c; --map-land: #262a31; --map-line: #3d424a;
}
```

### Índigo

```css
:root {
  --background: #f3f3f6; --card: #ffffff; --card-2: #f9f9fb; --muted: #f0f0f5; --accent: #ececf2;
  --border: #e4e4ec; --foreground: #0e0e16; --muted-foreground: #5a5a6e;
  --primary: #4338ca; --primary-foreground: #ffffff;
  --seq-1: #959efa; --seq-2: #6366f1; --seq-3: #4338ca; --seq-4: #312e81;
  --cat-1: #5b54e8; --cat-2: #e8743b; --cat-3: #1baf7a;
  --critical: #c53030; --critical-foreground: #ffffff; --negative: #c53030; --positive: #15803d; --warning: #b45309;
  --chart-1: var(--cat-1); --chart-muted: #ceced4; --chart-grid: #efeff4; --chart-axis: #6e6e7f;
  --map-sea: #ffffff; --map-land: #ebebf1; --map-line: #c8c8d3;
}
:root.dark {
  --background: #0b0b0e; --card: #17171c; --card-2: #111115; --muted: #212129; --accent: #24242c;
  --border: #2a2a33; --foreground: #efeff6; --muted-foreground: #a0a0b4;
  --primary: #959efa; --primary-foreground: #0e0e16;
  --seq-1: #4338ca; --seq-2: #6366f1; --seq-3: #959efa; --seq-4: #c7d2fe;
  --cat-1: #7b7ff0; --cat-2: #d95926; --cat-3: #199e70;
  --critical: #f87171; --critical-foreground: #1a0606; --negative: #f87171; --positive: #4ade80; --warning: #fbbf24;
  --chart-1: var(--cat-1); --chart-muted: #43434d; --chart-grid: #22222a; --chart-axis: #9090a2;
  --map-sea: #17171c; --map-land: #2a2a33; --map-line: #42424d;
}
```

### Ciano

```css
:root {
  --background: #f1f5f6; --card: #ffffff; --card-2: #f8fafb; --muted: #ecf1f3; --accent: #e7eef0;
  --border: #dde6e9; --foreground: #0a1214; --muted-foreground: #51636a;
  --primary: #0e7490; --primary-foreground: #ffffff;
  --seq-1: #22b8d4; --seq-2: #0891b2; --seq-3: #0e7490; --seq-4: #164e63;
  --cat-1: #0a8fb0; --cat-2: #e8743b; --cat-3: #6250d6;
  --critical: #c53030; --critical-foreground: #ffffff; --negative: #c53030; --positive: #15803d; --warning: #b45309;
  --chart-1: var(--cat-1); --chart-muted: #cbd0d2; --chart-grid: #ebf0f2; --chart-axis: #66767c;
  --map-sea: #ffffff; --map-land: #e6ecef; --map-line: #c1ccd0;
}
:root.dark {
  --background: #0a0c0d; --card: #151a1b; --card-2: #101314; --muted: #1e2628; --accent: #20292b;
  --border: #253032; --foreground: #ecf4f5; --muted-foreground: #97a9ae;
  --primary: #22d3ee; --primary-foreground: #04191d;
  --seq-1: #155e75; --seq-2: #0891b2; --seq-3: #22d3ee; --seq-4: #a5f3fc;
  --cat-1: #1aa0bf; --cat-2: #d95926; --cat-3: #8a6ee8;
  --critical: #f87171; --critical-foreground: #1a0606; --negative: #f87171; --positive: #4ade80; --warning: #fbbf24;
  --chart-1: var(--cat-1); --chart-muted: #3f484a; --chart-grid: #1f2729; --chart-axis: #87989c;
  --map-sea: #151a1b; --map-land: #253032; --map-line: #3c484b;
}
```

### Coral

```css
:root {
  --background: #f5f4f2; --card: #ffffff; --card-2: #fafaf9; --muted: #f2f0ed; --accent: #eeebe8;
  --border: #e7e3de; --foreground: #14110f; --muted-foreground: #625a52;
  --primary: #c2410c; --primary-foreground: #ffffff;
  --seq-1: #fb923c; --seq-2: #ea580c; --seq-3: #c2410c; --seq-4: #7c2d12;
  --cat-1: #e2602a; --cat-2: #2a78d6; --cat-3: #1baf7a;
  --critical: #c53030; --critical-foreground: #ffffff; --negative: #c53030; --positive: #15803d; --warning: #b45309;
  --chart-1: var(--cat-1); --chart-muted: #d0cecb; --chart-grid: #f1eeeb; --chart-axis: #756e67;
  --map-sea: #ffffff; --map-land: #edeae6; --map-line: #ccc8c2;
}
:root.dark {
  --background: #0d0c0b; --card: #191715; --card-2: #131210; --muted: #25211e; --accent: #282421;
  --border: #2e2a26; --foreground: #f5f2ee; --muted-foreground: #aca39a;
  --primary: #fb923c; --primary-foreground: #1a0c03;
  --seq-1: #9a3412; --seq-2: #ea580c; --seq-3: #fb923c; --seq-4: #fed7aa;
  --cat-1: #d95926; --cat-2: #3987e5; --cat-3: #199e70;
  --critical: #f87171; --critical-foreground: #1a0606; --negative: #f87171; --positive: #4ade80; --warning: #fbbf24;
  --chart-1: var(--cat-1); --chart-muted: #484440; --chart-grid: #26221f; --chart-axis: #9a928a;
  --map-sea: #191715; --map-land: #2e2a26; --map-line: #47423d;
}
```
