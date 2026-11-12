# Dashboards profissionais

Base: Nielsen Norman Group (atributos pré-atentivos), Stephen Few (*Information Dashboard Design*), IBM Carbon (paletas de dados) e o guia de visualização de dados (`dataviz`). Leia antes de criar qualquer tela que mostre números, gráficos ou mapas.

**Referência visual que manda:** as imagens em `exemplos-dashboards/`, escolhidas pelo usuário como "dashboards modernos". O acabamento medido está em `anatomia-dashboard.md` e o kit em `assets/dashboard.tsx` (cartões de 20 px sem contorno, título cinza, número médio grande, chip de variação verde/vermelho com seta, barras em pílula com uma destacada, tabela limpa com abas; nenhum cartão colorido). Se algo aqui conflitar com as imagens, as imagens vencem.

## 1. O que separa amador de profissional

| Amador | Profissional |
|---|---|
| Todo cartão tem o mesmo peso; a tela é uma grade de caixas iguais | Hierarquia clara: um bloco principal grande, apoio menor, detalhe por último |
| Cor em tudo: cada faixa de valor com uma cor diferente (cinza, azul, amarelo, vermelho) | Base neutra (cinzas) + uma cor de destaque; cor só onde carrega significado |
| Números pintados com a cor da série (o "5,1" amarelo, o "6,4" vermelho) | Números sempre na cor do texto; a cor fica numa marca pequena ao lado (ponto, barra fina) |
| Barras grossas e saturadas ocupando o cartão inteiro | Marcas finas, grade em linha fina e apagada, respiro |
| Várias listas e gráficos dizendo a mesma coisa | Cada bloco responde uma pergunta diferente |
| Layout que só estica no monitor largo (gráficos achatados, linhas de 3000 px) | Layout que **ganha colunas** quando a tela cresce |
| Mesmo esqueleto em todo projeto (4 indicadores + grade 2×2 + listas) | Composição escolhida pelo trabalho que o dado faz (seção 3) |

## 2. Princípios

0. **Informação antes de forma.** Faça o plano de `informacao.md` (perguntas do usuário, níveis, filtro, mapa de posições) antes de escolher composição, cor ou componente.
1. **Um trabalho por tela.** Diga em uma frase a pergunta que a tela responde ("Onde e quão forte a Terra tremeu?"). Tudo que não ajuda a responder sai ou vai para outra tela.
2. **De 3 a 5 números de destaque**, não mais. O mais importante fica no canto de cima à esquerda (o olho começa ali e desce em Z/F).
3. **Ordem de leitura:** destaque → tendência (tempo) → composição (de onde vem) → detalhe (lista/tabela).
4. **Posição e comprimento** são os jeitos mais fáceis de comparar quantidades (barra, linha, ponto num eixo). Área e ângulo (pizza, bolha) são piores: use só quando a forma importa (mapa).
5. **Cor é para chamar atenção.** Se tudo é colorido, nada se destaca. Um item destacado entre cinzas é visto em menos de um quarto de segundo.
6. **Dado ordenado = uma cor só, do claro ao escuro** (magnitude, faixa de idade, nível). Nunca arco-íris. Categorias sem ordem (países, produtos) = paleta categórica em ordem fixa, no máximo 3 cores juntas; o resto vira "Outros".
7. **Vermelho, laranja de alerta e amarelo são de status** (crítico, atenção) e sempre vêm com ícone e rótulo. Não use como "série 4" nem como enfeite.
8. **Texto nunca na cor da série.** Valores, rótulos e legendas em cor de texto (principal, secundária, apagada).
9. **Tudo responde ao mesmo filtro.** Um único lugar de filtro (período, região) no topo, valendo para a tela toda.
10. **Ao recarregar, mantenha a tela anterior** levemente apagada (sem piscar esqueleto) e mostre o anel de carregando.

## 3. Composições (varie entre projetos)

Escolha **uma** pelo plano de informação (`informacao.md`): onde fica a decisão, o motivo, a situação do usuário e a lista. Não monte várias versões para o usuário escolher. Não use a mesma composição no projeto seguinte só porque funcionou no anterior.

### A. Herói + trilho
Um visual dominante (mapa, gráfico principal) ocupa ~2/3; um trilho lateral empilha os números de destaque e 1 ou 2 mini gráficos. Bom quando existe uma imagem central (mapa, linha do tempo de preço).
```
┌──────────────────────────────┬──────────┐
│                              │ Número 1 │
│        Visual principal      │ Número 2 │
│        (mapa / gráfico)      │ Número 3 │
│                              ├──────────┤
│                              │ Mini     │
├──────────────────────────────┴──────────┤
│ Lista única com filtro                  │
└─────────────────────────────────────────┘
```

### B. Faixa de números + pequenos múltiplos
Linha fina de números no topo e, abaixo, vários gráficos pequenos **iguais** (mesmo eixo, mesma escala), um por categoria. Bom para comparar regiões, produtos, contas.
```
┌────┬────┬────┬────┐
│ N1 │ N2 │ N3 │ N4 │   ← faixa baixa, sem cartão por número
├────┴────┴────┴────┤
│ ▁▃▅ │ ▂▄▆ │ ▁▂▇ │ ▃▃▅ │   ← mesmos eixos, comparação lado a lado
│ ▂▆▃ │ ▁▁▄ │ ▅▃▂ │ ▄▆▇ │
└─────────────────────┘
```

### C. Mestre e detalhe
Lista (mestre) à esquerda; ao escolher um item, o detalhe aparece à direita, na mesma tela. No celular o detalhe vira tela própria. Ótima para telas largas e ultrawide (o detalhe fica sempre aberto).
```
┌─────────────┬────────────────────────────┐
│ ▸ Item A    │  Título do item            │
│   Item B    │  ┌────────┐ Números        │
│   Item C    │  │ visual │ ...            │
│   Item D    │  └────────┘                │
└─────────────┴────────────────────────────┘
```

### D. Linha do tempo protagonista
Um gráfico de tempo largo no topo, com seleção de intervalo; tudo abaixo mostra o intervalo escolhido. Bom quando a pergunta é "quando".
```
┌─────────────────────────────────────────┐
│ ▁▂▃▅▇▅▃▂▁▂▄▆█▆▄▂  [====seleção====]     │
├──────────────┬──────────────┬───────────┤
│ Composição   │ Ranking      │ Números   │
└──────────────┴──────────────┴───────────┘
```

### E. Mosaico (bento) por importância
Grade de 12 colunas em que o tamanho de cada bloco segue a importância (6+3+3, 8+4, 4+4+4). Sem caixas todas iguais. Bom para visão geral com tipos de dado variados.
```
┌──────────────────┬────────┬────────┐
│   Principal (6)  │ Apoio  │ Apoio  │
│                  │  (3)   │  (3)   │
├────────┬─────────┴────────┴────────┤
│ Apoio  │       Tendência (8)       │
│  (4)   │                           │
└────────┴───────────────────────────┘
```

### F. Painel operacional (centro de operações; reprovado como visual: ficou "ficção científica". Use o layout, mas com o acabamento da SKILL.md seção 9)
Para acompanhar ao vivo: faixa de status no topo (o que precisa de ação agora), fila de eventos recentes em destaque, contexto ao lado. Números mudam no lugar, sem pular o layout.

### G. Leitura guiada (relatório)
Uma coluna de blocos em sequência, cada um com uma conclusão curta no título ("Alasca concentrou 1 em cada 3 tremores") e o gráfico que prova. No web, o gráfico ao lado do texto. Bom para dados estáticos e para leigos.

## 4. Telas largas e ultrawide (21:9)

Tamanhos úteis para testar (já descontadas as barras do navegador): 1920×950, 2560×960 (21:9 de 2560×1080), 3440×1300 (21:9 de 3440×1440).

- **Ganhe colunas, não esticar.** Defina o grid por largura: 1 coluna no celular, 2 a 3 no notebook, 4 no full HD e 5 a 6 a partir de 2560 px (`3xl:grid-cols-4 4xl:grid-cols-6`; os breakpoints `3xl` = 1920 px e `4xl` = 2560 px vêm no `tokens.css`. Não use `min-[1920px]:`: no Tailwind v4 variantes em px saem antes de `lg:` no CSS e perdem). Prefira `grid-template-columns: repeat(auto-fit, minmax(22rem, 1fr))` para blocos de apoio.
- **Proporção máxima dos gráficos.** Gráfico de tempo até ~4:1 (largura:altura); barras e mapas até ~2,5:1. Se o espaço for mais largo que isso, ponha outro bloco ao lado.
- **Linhas de lista com até ~720 px.** Mais que isso, a lista vira 2 ou 3 colunas, ou passa a ser o mestre de um mestre e detalhe.
- **Use a largura extra para o que antes era escondido:** o painel de detalhe fica aberto ao lado, a tabela aparece ao lado do gráfico, o filtro vira barra lateral fixa.
- **Mantenha largura total** (regra da skill): nada de coluna estreita centralizada; o que muda é o número de colunas.
- **Altura:** ultrawide costuma ser baixo em relação à largura; a primeira tela (cabeçalho + destaque + visual principal) precisa caber em 960 px de altura útil.

## 5. Cor (resumo prático)

- Use uma paleta pronta de `paletas.md`. Elas já foram validadas (contraste e daltonismo) nos dois temas.
- Base: cinzas da paleta (fundo, cartão, borda, texto) fazem ~90% da tela.
- Destaque (`--primary`): ações, item selecionado e **um** dado que importa.
- Escala ordenada (`--seq-1..4`): magnitude, níveis, faixas. Mais forte = mais escuro no claro e mais claro no escuro.
- Categórica (`--cat-1..3`): séries sem ordem, na ordem fixa. Mais de 3 séries: "Outros" ou pequenos múltiplos.
- Crítico (`--critical`): só para estado ruim de verdade, com ícone e rótulo.
- Selo de valor (ex.: magnitude numa lista): fundo neutro (`bg-muted`) com o número em cor de texto e uma barra ou ponto na cor da escala ao lado; nunca o número pintado.

## 6. Marcas e acabamento

- Barras finas (largura ≤ 60% do espaço), ponta arredondada de 4 px só na ponta do dado.
- Linhas de 2 px; pontos ≥ 8 px; separação de 2 px (cor do fundo) entre barras e segmentos, nunca contorno.
- Grade em linha fina, sólida e apagada; eixo sem linha quando houver grade.
- Rótulo direto só no que importa (o maior, o último, o selecionado); o resto vai no tooltip.
- Todo gráfico com tooltip no hover/toque e uma forma de ver os números em tabela.
- Legenda sempre que houver 2 séries ou mais; com 1 série, o título já diz o que é.
- Número grande de destaque com algarismos proporcionais; `tabular-nums` em colunas, tabelas e eixos.
