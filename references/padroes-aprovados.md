# Padrões aprovados

Blocos que o usuário aprovou no novo Início do MegaLab (2026-11-12: "ficou bem melhor o design da tela agora"). Eles nasceram do plano de informação (`informacao.md`), não de um esqueleto. Use como repertório: escolha o bloco pela pergunta que ele responde, nunca para preencher a grade.

## 1. Cartão de decisão (herói)

Responde: "Tenho que fazer algo agora? Por quê? Até quando?" Fica em cima à esquerda (8 de 12 colunas).

```
Concurso 3084                                           [Sem aposta]   ← título cinza + StatusChip da decisão
Prêmio estimado                 ┆  Volta por real (i)
R$ 3,5 mi                       ┆  R$ 0,10  de R$ 0,38                 ← o número que decide + o limite em cinza
Acumulado do anterior  R$ 0,00  ┆  ▓▓▓░░░░░░░░░░░|░░░░                ← régua: preenchimento + marca do limite
[Ter 10 Nov] Terça, 21h         ┆  Mínimo para apostar ....... R$ 0,38
             Apostas até 10 nov ┆  Prêmio para valer (i) ..... Nenhum ← quanto falta, na língua do usuário
[Faltam 2 dias]                 ┆
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
8 jogos                                                     [Copiar]   ← o material da ação, sem clique
1 (04)(11)(23)(35)(47)(58)     2 (02)(19)(27)(33)(41)(60)
```

- **Duas metades** separadas por linha tracejada vertical (web) ou horizontal (celular), trocadas pela largura do **cartão** (`@container`, `@2xl:grid-cols-2`).
- **A decisão vira chip no título** (Apostar, Sem aposta, Gerando, Pausado), com o tom da paleta (destaque, neutro, aviso, crítico).
- **O prazo tem contagem regressiva** ("Faltam 2 dias", "Faltam 5 h", "Encerradas") em chip, que anda sozinho (`setInterval` de 1 min). Em cartão estreito o chip desce para uma linha própria embaixo da data, para não espremer o texto.
- **"Quanto falta" em valor do mundo real:** além do limite técnico (R$ 0,38 por real), mostre o equivalente que o usuário entende (o prêmio que faria valer). Quando nenhum valor chega lá, diga "Nenhum" e explique no "i", em vez de "Sem estimativa".
- **Um número de contexto embaixo do principal** (`KeyValue` "Acumulado do anterior") preenche a coluna e explica o número grande.
- **Jogos/itens da ação** em grade `repeat(auto-fill, minmax(14.5rem, 1fr))`, numerados, com botão "Copiar" em pílula (vira "Copiados" com ✓ por 2 s).

## 2. Gráfico da medida da decisão

Responde: "Isso costuma acontecer? Está perto?" Fica logo abaixo do cartão de decisão.

- Mostra **a mesma medida da decisão** ao longo do tempo (volta por real por sorteio), não outra métrica solta.
- **Linha tracejada do limite** (`ReferenceLine`, `strokeDasharray="4 4"`, rótulo "Mínimo" em `insideTopRight`).
- **Barras acima do limite na cor de destaque**, abaixo em cinza; o item atual (o próximo) também na cor, com `PillMark` mostrando só o valor ("R$ 0,10"). A etiqueta não anima: aparece direto no lugar enquanto as barras sobem (`ReferenceDot` com `shape`, não `LabelList`). Rótulo longo na pílula ("Próximo R$ 0,10") cobre a barra vizinha.
- **Resumo em chip no cabeçalho** ("8 de 23 acima"), ao lado das abas de período, e não como frase embaixo do título: a frase custa ~28 px de altura e achata o gráfico no notebook.
- Tocar numa barra filtra a lista e mostra a pílula "Concurso 3080 ×" no cabeçalho.
- **A seleção move a etiqueta:** com uma barra selecionada, a etiqueta do valor (`PillMark`) sai do item atual e vai para a barra escolhida, e as outras barras ficam apagadas (`fillOpacity` 0,3). Tocar de novo nela, ou no item atual, desfaz. Etiqueta parada no item atual enquanto outra barra está selecionada foi apontada como erro.

## 3. Cartão de situação do usuário

Responde: "Estou ganhando ou perdendo?" Fica ao lado do herói (4 de 12).

- Saldo grande com sinal (`+R$ 120,00`, `-R$ 48,00`), na cor do texto (nunca pintado).
- `StatColumns` com 3 números de apoio (Apostado, Prêmios, Concursos).
- **Saldo ao longo do tempo** (área suave de 2 px com degradê leve) no espaço que sobra (`flex-1 min-h-20`). Assim o cartão não fica com um vão quando o herói ao lado cresce (com os jogos). Só aparece com 2 pontos ou mais.
- Rodapé tracejado com `KeyValue` (melhor faixa, pendências).

## 4. Lista do próprio usuário

- A única lista da tela junta o dado geral com o do usuário: sorteios + colunas "Minha aposta" (chip) e "Saldo".
- **Colunas do usuário somem quando ele não tem dados** (sem apostas: sem a coluna e sem a aba "Apostei"). A coluna toda com "Sem aposta" é ruído.
- Colunas definidas pela largura **de cada coluna de linhas**, medida em JS (`ResizeObserver`) e aplicada com `gridTemplateColumns` inline, na ordem de prioridade: no estreito sai primeiro o saldo, depois o que é menos importante. Abaixo de ~400 px, a linha empilha (número e chip em cima, dezenas embaixo).
- Tela larga: a lista continua com uma coluna de linhas, num cartão vertical ao lado dos gráficos (`ListaAlta`), com páginas "1 a 10 de 60". Blocos de linhas lado a lado no mesmo cartão foram reprovados num painel industrial (2026-11-12): "os itens parecem se juntar horizontalmente, fica meio bagunçado".

## 5. Apoio sazonal e secundário

- Cartão sazonal (Mega da Virada) com o valor principal, chips de estado ("15 jogos prontos", "Faltam 48 dias") e botão redondo com chevron para a tela própria. Some fora da temporada.
- Cartão do "quem decide" (campeã da arena) com nome, quando foi escolhida e 2 números em `StatColumns` no rodapé.
- Falha de rotina: **faixa de alerta** no topo (`bg-critical/12`, ícone em círculo, seta), só enquanto existir. Nada de cartão fixo "Tudo certo".

## 6. Posições e ordem

- Uma grade de 12 colunas para todas as faixas. Web: herói 8 + situação 4; gráfico 8 + apoio 4 (empilhado); lista 12.
- **Ordem do celular = ordem de prioridade**, com `order-*` nos filhos da grade: herói, situação, contexto, lista, apoio (`order-5 lg:order-4`).
- Ultrawide (`4xl`): herói 5 + situação 3 + os dois de apoio 2 + 2 na primeira faixa; gráfico 5 + lista 7 na segunda, com a lista na mesma altura do gráfico e as linhas por coluna calculadas dessa altura. Empilhar o apoio numa coluna estreita deixava a primeira faixa alta e cheia de vãos.
- Gráfico com altura pela janela (`useFitHeight` em `assets/painel.tsx`): ocupa o que sobra até a borda de baixo (mínimo 280 px, máximo 480 px) e mede de novo quando o cartão de cima cresce.

## 7. Moldura do app

- Web: menu lateral num cartão de 20 px (logo + nome em cima, áreas principais, ferramentas embaixo), todos os itens com ícone, o ativo com fundo `bg-accent`.
- Celular: cabeçalho com a marca e o botão de menu à direita (ferramentas com ícone em círculo tingido + tema); barra inferior com 4 áreas, a ativa com o ícone numa pílula tingida.
