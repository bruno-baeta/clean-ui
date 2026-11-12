# Errado e certo (casos reais)

Cada caso abaixo aconteceu de verdade e foi reclamado. Use como referência quando bater a dúvida "isso está bom?".

## Aparência geral ("cara de IA")

| Errado | Certo |
|---|---|
| Fonte Inter/Geist/Roboto, padrão de template | Plus Jakarta Sans (ou outra da lista boa), uma família só |
| Cartões com bordinha colorida (laranja, verde, roxo) para destacar | Destaque com fundo suave da cor (`bg-primary/10`) e borda neutra |
| Colunas de um grid com larguras e alturas diferentes | Grid com colunas iguais e cartões `h-full` |
| Conteúdo numa coluna de 900 px no meio de um monitor largo | Largura total, grid de 2 a 4 colunas no web |
| Paleta com roxo, verde e marrom misturados | Preto + uma cor de destaque + vermelho só para negativo |
| Hover que levanta o cartão (`hover:-translate-y-1 hover:shadow-lg`) | `hover:bg-accent/40`, nada se move |
| Hover que acende a borda (`hover:border-primary`) | Só o fundo muda |
| Toda tela nova em preto + laranja | Cor de destaque escolhida pelo assunto do projeto (ou a da marca); laranja é do MegaLab |
| App só no tema escuro (Sismos) | Claro e escuro, seguindo o sistema, com `ThemeToggle` no cabeçalho |
| `stroke="#f5f5f5"`, `fill="#1f1f1f"`, `bg-black` em mapa, gráfico ou spinner | Tokens (`var(--map-land)`, `var(--chart-axis)`, `bg-background`) que mudam com o tema |

## Texto

| Errado | Certo |
|---|---|
| `quarta-feira, 4 de novembro de 2026 · Banco Central · data da prova a definir` | Três elementos separados, cada um com ícone em container, todos com maiúscula |
| `Azul · Direto · 2h 35 min` | Linha 1: logo da companhia + nome. Linha 2: chip "Direto" e ícone de relógio com "2h 35 min" |
| `Saldo: R$ 120,00` | Rótulo pequeno "Saldo" em cima, valor "R$ 120,00" embaixo |
| `Você confirmou R$ 48 apostados com saldo de −R$ 12` | Dois indicadores: "Apostado" e "Saldo" |
| Nota de rodapé fixa "Empatadas dividem o prêmio" | Ícone "i" ao lado do título com essa frase dentro |
| `—` como valor vazio | "Sem dados", "Nenhuma", "R$ 0,00" |
| Título "Como se saiu no passado" + descrição "Desempenho histórico do método" | Só o título; a descrição repetia a mesma ideia |
| "Hipótese experimental", "intervalo de 95%", "priori" | "Ainda em teste", "Dentro do esperado pela sorte" |
| `qui`, `sex → dom` | `Qui`, `Sex`, e as datas em blocos |
| Texto verde e grande para o preço | Preço no mesmo peso dos outros valores, com ícone em container ao lado |

## Ícones

| Errado | Certo |
|---|---|
| Ícone de avião solto no texto | Ícone dentro de um quadrado arredondado com fundo da cor |
| Ícone de preço maior que o ícone da cidade na mesma linha | Todos os ícones da linha com o mesmo container (`size-9`) e alinhados na mesma altura |
| Uma linha vazia acima do ícone (ícone desce em relação ao texto) | `items-center` (ou `items-start` com o ícone alinhado à primeira linha), sem espaço sobrando |
| Tirar os ícones porque o texto não cabe | Manter os ícones e encurtar o texto |
| Ícones marrons ou de cores aleatórias numa lista | Todos na cor de destaque; vermelho só para falha |

## Chips e alinhamento

| Errado | Certo |
|---|---|
| Chip "Direto" mais à direita numa linha e mais à esquerda na outra | Grid com colunas fixas: a coluna do chip começa no mesmo x em todas as linhas |
| Chip grudado no fim do título (`Concurso 3084 [Referência]`) | Coluna direita da linha: chip em cima, valor embaixo |
| Chip sozinho numa linha abaixo do título | Mesma regra: canto direito, em cima do valor |
| Quatro informações empilhadas uma em cima da outra num item curto | Informações principais lado a lado em colunas alinhadas; empilhar só o que é rótulo/valor |
| Nome da companhia embaixo do aeroporto em vez de embaixo do logo | Cada texto fica embaixo do ícone a que pertence |
| "VS" entre dois cartões fora do centro vertical | `self-center` / `place-items-center` e conferir no print |
| Três infos do cabeçalho com espaços diferentes entre si | `grid grid-cols-3` ou `justify-between` com larguras iguais |

## Cartões e seções

| Errado | Certo |
|---|---|
| Mesmo esqueleto "4 indicadores + grade 2×2 + listas" em todo projeto (Sismos) | Composição tirada do plano de informação (`informacao.md`), pela pergunta que a tela responde |
| Três versões da tela ("Visão A, B, C") para o usuário escolher (MegaLab) | Uma versão só, a melhor, com o motivo de cada posição explicado em poucas linhas |
| Tela bonita com os dados errados: decisão num canto, motivo em outro, indicador de curiosidade, jogos a apostar faltando (MegaLab) | Plano de informação antes do layout (`informacao.md`): decisão + motivo + prazo + ação no cartão herói, situação do usuário ao lado |
| No monitor 21:9 tudo esticado: mapa enorme, gráfico achatado, linhas de lista de 1700 px (Sismos) | Mais colunas a partir de 1920/2560 px, detalhe aberto ao lado, proporção limitada |
| Central "bonita mas amadora": vãos em painéis de barras curtas, sparkline pequeno com vão, mapa com faixas vazias, poucos ícones, feed + ranking + barras de magnitude + profundidade parecendo 4 listas (Sismos) | Histograma, mapa de blocos e dispersão no lugar das listas, sparkline esticado, etiqueta de tendência, ícones de status no feed, coluna do mapa dimensionada pela proporção |
| Hover sem mãozinha em botões e linhas clicáveis (Tailwind v4 tira o `cursor: pointer`) (Sismos) | Regra global `cursor: pointer` em tudo que é clicável |
| Cartões de baixo terminando alguns pixels antes ou depois dos de cima: "tortos" (Sismos) | Todas as faixas na mesma grade de colunas, cartões com `col-span` |
| Cartão de destaque preenchido de cor (azul claro com texto preto, depois azul profundo): "péssima ideia" (Sismos) | Todos os cartões neutros; cor só nas marcas de dado e nos chips |
| Caixa do hover dos gráficos deslizando lenta atrás do mouse (Sismos) | `<Tooltip isAnimationActive={false} />` |
| Balão do "i" saindo pela borda da tela (Sismos) | Portal com posição fixa, preso à janela, vira para cima |
| Barra de rolagem aparecendo no celular (Sismos) | Esconder abaixo de `lg` |
| "Atualizado 19:53" pequeno embaixo do título, com bolinha: "muito estranho" (Sismos) | Chip "⟳ Atualizado há 2 min" perto do dado; dado diário mostra "Dados até 10 nov" |
| Celular: seletor de período centralizado com o seletor de tema na direita (Sismos) | Linha 1 logo, título e tema compacto; linha 2 período na largura toda |
| Título da seção dentro do cartão numa tela e fora em outra | Sempre fora (componente Section) |
| Cartão de gráfico mais baixo que o cartão de jogos ao lado | `items-stretch` no grid, cartão `h-full`, gráfico `h-full` |
| Matriz/tabela que não cresce junto com o cartão | Tabela `h-full w-full table-fixed` |
| Cartão "Lado a lado" com sub-cartões dentro | Um cartão, colunas separadas por `border-l` (web) / `border-t` (mobile) |
| Esquerda com 3 linhas de texto e direita com 2 | Mesmo número de linhas dos dois lados (ajuste o texto ou acrescente o dado que falta) |
| Grid de 4 cartões com 3 numa linha e 1 sobrando | 2×2 ou 4×1; linhas sempre completas |
| Mapa mundi `w-full h-auto` que passa da borda de baixo da tela num notebook (Sismos, 1536×730) | Altura limitada pela janela (`FitScreen`, SVG `size-full` com `preserveAspectRatio="xMidYMid meet"`); a primeira tela cabe inteira |
| "Mais fortes" e "Mais recentes" como duas listas iguais lado a lado (Sismos) | Uma lista com pílulas "Recentes" e "Mais fortes" para trocar a ordem |
| Metade de baixo da tela vazia | O último bloco com `flex-1`, ou um estado vazio que estica |
| Card "Histórico de preço" vazio dizendo "aparece a partir da segunda variação" | Não mostrar o card até ter dados |

## Mobile

| Errado | Certo |
|---|---|
| Título cortado com "…" | Quebrar linha, encurtar ou reorganizar |
| Setas de navegação do carrossel invisíveis ou fora da tela | Setas visíveis em botões redondos com fundo |
| Pódio confuso com selo "Empate" | Degraus 2º, 1º, 3º, coroa no 1º, sem selo extra |
| Botões de ação no meio de uma tela de detalhe longa | Botões fixos no rodapé |
| Trocar de opção e a tela continuar no meio | Rolar para o topo ao selecionar |
| Tocar e nada acontecer por 2 segundos | Resposta imediata (pressionado) + tela de carregando |
| Skeleton cinza que não tem a forma da tela real | Tela preta com indicador de carregamento na cor de destaque |
| Prova com texto dentro de uma caixa com scroll | Texto no fluxo da página; navegação entre questões por botões |
| Números de questão saindo da borda do container | Grid que quebra linha dentro do container |
| Ajuste pedido no mobile que também mudou o web | Classes sem prefixo só para o mobile, `sm:`/`lg:` preservando o web |

## Gráficos

| Errado | Certo |
|---|---|
| Magnitude em arco-íris: cinza, azul, amarelo, vermelho (Sismos) | Escala de uma cor só (`--seq-1..4`), mais forte = mais intensa |
| Número da lista pintado com a cor da faixa ("5,1" amarelo, "6,4" vermelho) (Sismos) | Número na cor do texto, selo neutro com barrinha da cor da escala |
| Barras grossas e saturadas ocupando o cartão todo | Barras finas, grade fina, cor forte só no que importa |
| Cores avulsas de lugares diferentes (azul + amarelo + vermelho que não conversam) | Uma paleta inteira de `paletas.md` |
| Borda branca grossa ao clicar no gráfico | `outline: none` em `.recharts-wrapper` e filhos |
| Legenda que fica preta e ilegível depois de clicada | Cor da legenda e do tooltip forçada para as cores do tema |
| Primeiro rótulo do eixo X colado na linha do eixo | `tickMargin`, `padding` no eixo e margem do gráfico |
| Gráfico com metade da altura do cartão | Container `h-full` e `ResponsiveContainer height="100%"` |
| Hover retangular nos itens das pontas de uma lista arredondada | Cartão com `overflow-hidden` para o fundo seguir os cantos |

## Processo

| Errado | Certo |
|---|---|
| Publicar cada tentativa direto em produção | Print local, aprovação, depois push |
| Trocar os quadradinhos de acertos por outra visualização "melhor" sem pedir | Manter o que existe; propor e perguntar |
| Remover uma seção para "limpar" a tela | Só remover com pedido explícito |
| Escolher sozinho a posição de um chip depois de errar duas vezes | Mostrar 2 ou 3 variações daquele detalhe (nunca da tela inteira) e deixar escolher |
| Enviar print sem olhar | Abrir cada print (mobile e web) e passar a checklist antes |
| Dashboard "80% bem legal" mas com título em negrito e ícone em quadradinho, chip em pílula redonda, medidor gigante (Leitura na Wikipédia) | Copiar as fotos de perto: título cinza médio, ícone em círculo no canto, chip de 6 px verde/vermelho com seta, medidor até 224 px (anatomia-dashboard.md) |
| Gráfico principal com celular x computador e um cartão "Pelo celular" com a mesma divisão (Leitura na Wikipédia) | Cada informação uma vez: gráfico compara período atual x anterior; a divisão fica só no cartão dela |
| Cartão do medidor do tamanho de meia tela, com o desenho pequeno no meio (Leitura na Wikipédia) | Cartão estreito (3/12) e arranjo pela largura do cartão (`@container`) |
| Linhas da tabela quebrando o nome em 2 ou 3 linhas (coluna de "situação" sobrando) (Leitura na Wikipédia) | 3 colunas: posição, nome, valor com seta; "Novo" em chip no lugar da seta; duas metades pela largura da tabela |
| Gráfico sumindo no celular (`flex-1` com altura fixa) (Leitura na Wikipédia) | `lg:flex-1`; o check acusa "gráfico sem altura" |
| Cartão "Pelo celular" com medidor de uma parte só (Leitura na Wikipédia) | "Como leem": barra empilhada + porcentagem de cada plataforma |
| Chip de variação grudado depois do número na tabela (Leitura na Wikipédia) | Coluna própria de chips "Vs véspera", alinhada; número na coluna de números |
| Gráfico com frase de variação + dois números + legenda, repetindo o indicador do topo (Leitura na Wikipédia) | Gráfico só com título e legenda das linhas; o total e a variação ficam no indicador |
| Chips da coluna "Vs véspera" com larguras diferentes ("7,7%" menor que "31%") (Leitura na Wikipédia) | Largura fixa igual para todos, conteúdo centrado |
| Aba "Todos 60" com a lista mostrando só 5, sem jeito de ver o resto (Leitura na Wikipédia) | Páginas: "1 a 5 de 60" e setas no rodapé do cartão |
