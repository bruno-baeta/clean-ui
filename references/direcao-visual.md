# Direção visual: cada projeto com a sua cara

A skill não define a cara do produto. Ela define o que nunca pode acontecer e o nível de acabamento. Paleta, fonte, forma, densidade, composição e detalhes são decisão sua, tomada a partir do assunto e do plano de informação. Esta página explica como decidir sem cair no esqueleto de sempre.

## Por que isto existe

Projetos feitos com a skill estavam saindo quase iguais: faixa de 4 indicadores no alto, grade de cartões embaixo, mesma fonte, mesmo raio, mesmo azul. Cada tela seguia as regras, mas o conjunto tinha cara de template. **Regra cumprida não é design feito.** Depois de evitar o que é ruim, ainda falta tomar decisões.

## 1. Escreva a direção antes do código (5 linhas)

Depois do plano de informação (`informacao.md`) e antes de qualquer componente, escreva e entregue junto com os prints:

```
Personalidade: calma, precisa, de bolso          ← 3 adjetivos tirados do assunto e de quem usa
Cor: verde-musgo #4d7c4a, neutros quentes        ← de onde veio (marca, assunto, contraste com o projeto anterior)
Tipo: Fraunces nos títulos, Figtree no resto      ← família(s) e escala (ex.: 1,25)
Forma: raio 8, superfície única com divisórias, densidade compacta
Assinatura: a régua de meses no topo de cada lista ← um elemento que só este projeto tem
```

- **Personalidade** vem do assunto e do uso: um app de finanças da família é diferente de um monitor de servidores, que é diferente de um diário de leitura. Escolha adjetivos que excluem coisas ("de bolso" exclui telas largas cheias de cartão; "editorial" pede tipografia de leitura).
- **Assinatura** é o detalhe que faz alguém reconhecer o app num print sem o logo: a bola numerada da loteria, uma faixa de status colorida em cima da tela, números enormes numa fonte com personalidade, um mapa de calor como fundo de seção, uma linha do tempo vertical que costura a página. Uma só, usada com consistência. Não é enfeite: ela também mostra dado.

## 2. Eixos para variar

Mude pelo menos **dois eixos** em relação ao último projeto que você fez com a skill (ou ao kit padrão, se não souber qual foi).

| Eixo | Opções |
|---|---|
| **Superfície** | Cartões soltos em degrau de cor, sem borda; os mesmos com sombra suave; superfície única com divisórias finas; blocos em fundo tingido sem cartão; folha larga (cara de relatório). Cartão com borda foi reprovado (`medidas.md`). |
| **Raio** | 16 px (macio), 20 px, 24 px com botões em pílula (bem macio). Abaixo de 16 foi reprovado. Um raio só no app. |
| **Densidade** | O padrão é cartão justo (padding 16, 12 entre cartões, texto 15, linha de 56 px). Mais compacto ou mais solto só com motivo forte, no app inteiro. |
| **Tipografia** | Grotesca neutra ou humanista (aprovadas); uma segunda família só nos títulos. Geométrica no corpo e fonte de exibição só nos números foram reprovadas. |
| **Escala** | Moderada (títulos 22 a 28 px, números 36 px peso 600); contrastada (um número ou título herói de 48 a 72 px e o resto pequeno) |
| **Cor** | Neutro com destaque mínimo; destaque forte em poucas superfícies (botão, seleção, uma faixa); monocromática (escala de uma cor fazendo hierarquia); fundo levemente tingido da cor da marca |
| **Navegação** | Menu lateral; barra no topo com abas; abas dentro da página; sem moldura (uma tela só); barra inferior no celular |
| **Cabeçalho** | Título grande editorial; compacto de ferramenta (título + filtros numa linha); cabeçalho que já é dado (o número principal no lugar do título) |
| **Desenho de dado** | Linhas finas e pontos; barras em pílula; áreas suaves; tabela com micrográficos; pictogramas e quadros de 100 |

## 3. Composição: escolha pela pergunta, não pelo hábito

A **faixa de 4 indicadores no alto + grade de cartões** não é o padrão. Use só quando a pessoa acompanha esses números todo dia e eles mudam decisão. Na maioria das telas, o número importante mora dentro do bloco que explica o número (o saldo no cartão do saldo, junto do gráfico dele).

Repertório (detalhes das sete primeiras em `dashboards.md`):

| Composição | Quando |
|---|---|
| Herói + trilho | Existe uma imagem central (mapa, gráfico de preço) e poucos números de apoio |
| Pequenos múltiplos | Comparar a mesma medida entre regiões, produtos, contas |
| Mestre e detalhe | A pessoa escolhe um item e quer ver tudo dele; ótimo em tela larga |
| Linha do tempo protagonista | A pergunta é "quando" |
| Mosaico por importância | Visão geral com dados de tipos diferentes, blocos de tamanhos diferentes |
| Painel operacional | Acompanhar ao vivo: o que precisa de ação agora em cima |
| Leitura guiada | Relatório: cada bloco com uma conclusão no título e o gráfico que prova |
| **Tabela protagonista** | O trabalho é olhar linhas (estoque, pedidos, carteira): a tabela é a tela, com filtros e totais no topo da própria tabela |
| **Pergunta única** | Um número ou estado responde tudo ("Posso apostar hoje?"): ele enorme, o motivo embaixo, o resto pequeno |
| **Quadro (colunas de estado)** | Itens que andam por etapas (a fazer, em andamento, feito) |
| **Agenda ou calendário** | O dado tem data e a pessoa planeja (sorteios, vencimentos, plantões) |
| **Comparador lado a lado** | Duas ou três opções com as mesmas medidas (métodos, planos, períodos) |
| **Feed** | Eventos em ordem, cada um com seu dado (alertas, movimentações) |
| **Etapas** | Formulário ou configuração longa: um passo por vez, progresso visível |

Na mesma tela, **misture tamanhos**: um bloco grande e vários pequenos lê melhor que seis iguais. Na mesma aplicação, telas diferentes podem ter composições diferentes; o que se repete é o acabamento (fonte, raio, cor, chips, linhas).

## 4. Pontos de partida por assunto (sugestões, não regras)

| Assunto | Pode puxar para |
|---|---|
| Finanças pessoais, carteira | Neutros quentes, um destaque sóbrio (verde-escuro, azul-petróleo, vinho), números grandes e calmos, tabela protagonista |
| Monitoramento ao vivo, infraestrutura | Densidade compacta, raio pequeno, painéis encostados, status em faixa, cor só para estado |
| Leitura, conteúdo, educação | Serifa nos títulos, fundo levemente quente, leitura guiada, bastante respiro |
| Esporte, jogos, sorteios | Destaque vivo, escala contrastada, assinatura forte (bolas, placar, camisa), cartões macios |
| Saúde, bem-estar | Humanista, raio grande, cores suaves e frias, pergunta única ("Como estou hoje?") |
| Ciência, clima, mapas | Mapa protagonista, escala de uma cor bem construída, neutro frio, tipografia técnica |
| Ferramenta interna, operação | Compacta, tabela protagonista, atalhos visíveis, cor mínima |
| Varejo, vendas | Mosaico, destaque quente, gráficos de período com comparação |

## 5. Cara de template de IA (evite)

Estes sinais fazem uma tela parecer gerada. Nenhum é proibido por lei, mas cada um precisa de um motivo forte:

- Faixa de 4 indicadores com ícone no canto como abertura de toda tela.
- Grade de cartões todos do mesmo tamanho.
- Três cartões "ícone + título + descrição" lado a lado (landing page de sempre).
- Degradê roxo para azul, vidro fosco (glassmorphism), brilho neon, sombra grande em tudo.
- Emoji no lugar de ícone; ilustração 3D genérica; avatar sem função.
- "Bem-vindo de volta, Fulano!" como título; frases de efeito no cabeçalho.
- Tudo centralizado; raio de 24 px + sombra em todos os elementos.
- Cinza claro sobre cinza (texto que ninguém lê) para "parecer elegante".
- Botão em degradê; contador de número rolando; selo "Novo" sem motivo.
- Mesma fonte, mesmo raio e mesmo azul do projeto anterior.

## 6. Teste da mesmice (antes de mostrar)

1. Ponha o print ao lado do último projeto feito com a skill (ou do kit padrão). Tirando o logo, dá para confundir? Mude dois eixos.
2. A assinatura aparece na primeira tela?
3. Se você trocar o assunto (vendas por clima), a tela continua fazendo sentido sem mudar nada? Então ela não foi desenhada para este assunto.
4. Os fundamentos (`fundamentos.md`) e as proibições (SKILL.md) continuam todos cumpridos? Liberdade não desliga nenhum deles.
