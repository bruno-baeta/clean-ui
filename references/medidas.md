# Medidas calibradas (o usuário escolheu olhando)

Em 2026-11-13 o usuário respondeu a 11 comparações lado a lado (4 opções cada, nos dois temas). Este arquivo é o resultado. Ele existe porque os dois erros que ainda apareciam nas telas eram **espaçamento desigual** e **desalinhamento**: sem números fixos, cada cartão saía com um respiro diferente.

Dois tipos de resposta:

- **Padrão:** o valor usado quando a direção do projeto não pede outro. Se mudar, mude no app inteiro e diga o motivo na entrega.
- **Aprovado / reprovado:** vale em qualquer direção. O que não foi aprovado não entra, mesmo que combine com o estilo.

## 1. Tabela de medidas

| Item | Medida | Tipo |
|---|---|---|
| Padding do cartão | **16 px** (`p-4`), igual em todos os cartões da tela | Padrão |
| Rótulo até o número | **4 px** (`mt-1`) | Padrão |
| Número até o chip ou a legenda | **8 px** (`mt-2`) | Padrão |
| Espaço entre cartões | **12 px** (`gap-3`), o mesmo na horizontal e na vertical | Padrão |
| Margem da página | **12 px** no web, 16 px no celular | Padrão |
| Texto base | **15 px**; secundário 14 px; chip e eixo 12 px | Padrão |
| Linha de lista | **56 px** de altura mínima, ícone em container de 36 px, 12 px entre ícone e texto | Padrão |
| Número de destaque | **36 px, peso 600**, `tracking-tight`, `tabular-nums`, altura de linha 1,1 | Padrão |
| Botão | **Altura 40 px, pílula** (`rounded-full`), texto 14 px peso 600, 18 px de lado, ícone de 18 px a 8 px do texto; botão só de ícone 40 × 40 | Padrão |
| Superfície do cartão | **Degrau de cor sem borda**, ou degrau de cor com **sombra suave** | Aprovado |
| Arredondamento do cartão | **16 a 24 px**; interno 10 px com cartão de 16, pílula com cartão de 24 | Aprovado |
| Separação das linhas de lista | **Linha fina sólida** ou **tracejada**, uma das duas no app inteiro | Aprovado |
| Abas e filtros | Trilho segmentado, pílulas soltas, sublinhado ou fundo suave no ativo: os quatro servem, **um só por app** | Aprovado |
| Campo de formulário | **Preenchido, sem borda** (`bg-accent`, raio interno, 44 px de altura); foco com anel neutro de 2 px | Aprovado |
| Fonte | **Grotesca neutra** (Hanken Grotesk) ou **humanista** (Figtree) e parentes delas | Aprovado |

## 2. Reprovados na calibragem

- **Cartão com borda fina**, com ou sem degrau de cor. Painel "só contorno" com o fundo da página também.
- **Raio de 4 a 10 px no cartão** (cara técnica). O mínimo é 16.
- **Linhas de lista em blocos com fundo próprio** e **lista zebrada**.
- **Campo com contorno**, preenchido com contorno, ou só com linha embaixo.
- **Fonte geométrica no corpo** (Manrope e parecidas) e **fonte de exibição só nos números** (Bricolage nos números com outra no texto). Projeto com identidade já aprovada mantém a dele (MegaLab continua com Plus Jakarta Sans).
- **Respiro largo dentro do cartão** (padding de 24 a 32 px com o número a 16 ou 20 px do rótulo) não é o padrão: o usuário prefere cartão justo, com o ar **entre** os grupos, não dentro deles.

## 3. Sistema de espaçamento (o que acaba com o espaço desigual)

Use só estes degraus, cada um com um papel. Antes de escrever um `gap` ou `padding`, pergunte qual é a relação entre os dois elementos e pegue o degrau dela. Nunca escolha "no olho".

| Degrau | Papel | Exemplos |
|---|---|---|
| 4 px | Mesma informação | Rótulo e valor, nome e descrição, ícone e texto dentro do chip |
| 8 px | Mesma linha ou mesmo grupo | Número e chip, chip e legenda, botões vizinhos, ícone e texto do botão |
| 12 px | Peças do mesmo bloco | Ícone e texto da linha de lista, entre cartões, título do cartão e o conteúdo |
| 16 px | Borda do bloco | Padding do cartão, margem lateral no celular, entre campos de formulário |
| 24 px | Grupos diferentes dentro do bloco | Entre duas partes de um cartão, entre o cabeçalho da página e o conteúdo |
| 32 px ou mais | Seções diferentes da página | Entre seções com título próprio |

Regras:

- **Mesma relação, mesmo número, na tela inteira.** Se o rótulo fica a 4 px do valor num cartão, fica a 4 px em todos.
- **Um `gap` por grade.** A grade da página usa um valor só (`gap-3`), horizontal e vertical. Nada de `gap-3` numa faixa e `gap-4` na outra, nem `mt-*` solto num filho para "ajustar".
- **Espaço vem do pai** (`gap`, `space-y`), não de margem em cada filho. Margem em filho é a origem de quase todo espaço desigual.
- **Padding igual nos cartões vizinhos.** Lista dentro de cartão: a linha tem o mesmo recuo lateral (16 px) que o título do cartão.
- **Nada fora da escala.** Sem 6, 10, 14, 18, 22 px em `gap`, `padding` e `margin` de layout (dentro de chip e de botão pode).
- **Dentro é menor que fora.** O espaço dentro de um grupo é no máximo metade do espaço que separa esse grupo do vizinho.

## 4. Sistema de alinhamento (o que acaba com o "quase alinhado")

- **Um eixo esquerdo por cartão.** Título, número, chip, legenda, gráfico e primeira coluna da lista começam no mesmo x (a borda do cartão + 16). Conte os x de início: se passar de dois (o eixo e a coluna depois do ícone), tem erro.
- **Um eixo direito por cartão.** Ação do cabeçalho, valores à direita e chevrons terminam no mesmo x (borda − 16).
- **Diferença de 1 a 6 px é sempre erro.** Ou alinha exatamente, ou afasta pelo menos um degrau da escala (12 px ou mais) de propósito.
- **Causas comuns:** `px` diferente no cabeçalho e no corpo do cartão; `-ml-*` para compensar ícone; botão sem fundo com padding que empurra o texto; gráfico com margem interna (zere a margem esquerda e alinhe o eixo com o título); `InfoTip` com área de toque maior que o desenho.
- **Entre cartões:** os que estão na mesma coluna têm a mesma largura e as mesmas bordas; os da mesma faixa têm a mesma altura e o título na mesma linha de base.
- **Colunas de lista e tabela com largura fixa** (grid com `grid-template-columns`), para todo valor começar ou terminar no mesmo x em todas as linhas. Número alinhado à direita, texto à esquerda, cabeçalho alinhado com o dado da coluna.
- **Ícone e texto da mesma linha** centrados entre si (`items-center`); número grande com unidade pequena pela base (`items-baseline`).
- **Tamanho por papel, um só:** todos os botões com a mesma altura, todos os chips com 24 px, todos os containers de ícone com 36 px, todas as linhas da mesma lista com a mesma altura.

## 5. Conferência (faça no print, antes de mostrar)

1. Escolha dois cartões vizinhos e compare: padding, distância do título ao conteúdo, distância do rótulo ao número. Iguais?
2. Meça os espaços entre todos os cartões da tela. Um valor só?
3. Em cada cartão, passe uma régua vertical no eixo esquerdo. Algo começa 2, 4 ou 6 px para o lado?
4. Faça o mesmo no eixo direito.
5. Rode o `check-ui.mjs`: ele acusa "espaços diferentes entre cartões vizinhos", "conteúdo começa em distâncias diferentes da borda", "espaço fora da escala de 4 px" e "quase alinhado à esquerda". O `lint-ui.mjs` acusa espaçamento arbitrário fora da escala, cartão com borda, cartão com raio pequeno, lista zebrada e campo com contorno.
