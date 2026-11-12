# Escolha das informações (antes de qualquer layout)

Uma tela pode estar bonita e ainda assim errada: dados que não importam em destaque, o que importa faltando ou escondido, a decisão num canto e o motivo dela em outro. Isso aconteceu no novo Início do MegaLab ("ficou bonito, mas os dados e os lugares estão estranhos, tem coisa importante faltando"). **Escolher o que mostrar e onde é a parte principal do trabalho.** Cor, cartão e chip vêm depois.

Faça os seis passos abaixo **antes de escrever o layout** e entregue o plano (passo 6) junto com os prints.

## 1. Inventário: o que o produto sabe

- Leia o banco (tabelas e colunas), as consultas que já existem, as telas atuais e as configurações.
- **Tudo que a tela antiga mostrava entra na lista.** Num redesign, cada item antigo fica na tela nova ou ganha um destino explícito (outra tela, o "i", um alerta). Nada some sem você dizer onde foi parar (regra de não remover).
- Anote também o que o produto sabe e **nenhuma tela mostra ainda**. Muitas vezes é ali que está o dado mais útil (no MegaLab, o histórico de "quanto volta por real" de cada concurso).

## 2. Perguntas do usuário

Escreva as perguntas com que a pessoa abre a tela, da mais urgente para a menos urgente. Use a língua dela, não o nome das tabelas.

Exemplo (MegaLab, Início):
1. Tenho que apostar no próximo concurso? Em quais jogos? Até quando?
2. Por que sim ou por que não? Quanto falta para valer a pena?
3. Estou ganhando ou perdendo dinheiro?
4. Como foram as últimas apostas e os últimos sorteios?
5. Os jogos da Mega da Virada estão prontos?
6. Está tudo funcionando?

## 3. Prioridade em níveis

| Nível | O que é | Exemplo |
|---|---|---|
| 1. Ação agora | O que fazer, o prazo e o material para fazer (jogos, botão) | Apostar ou não no 3084, jogos, "Apostas até ter 20h" |
| 2. Motivo da decisão | O número que decide e quanto falta | Volta por real R$ 0,10 contra o mínimo de R$ 0,38 |
| 3. Situação do usuário | O que é **dele**: dinheiro, resultado, progresso | Saldo da carteira, apostado, prêmios |
| 4. Contexto | Tendência e histórico que explicam o nível 2 | Volta por real nos últimos concursos, com a linha do mínimo |
| 5. Detalhe | A lista dos próprios itens | Últimos sorteios com o resultado das minhas apostas |
| 6. Apoio e saúde | Sazonal, configuração, rotinas | Virada (sobe de nível perto da data), campeã da arena, falhas |

## 4. Filtro: cada informação precisa passar

- **Responde a uma das perguntas do passo 2?** Se não, sai da tela (ou vai para o "i").
- **É do usuário?** Dados dele (apostas, saldo, resultados dos jogos dele) vêm antes de dados genéricos (todos os sorteios). Se há os dois, junte: a lista de sorteios ganha a coluna "Minha aposta".
- **Muda uma decisão ou só é curiosidade?** Curiosidade ("acumulou 0 vezes seguidas") não vira indicador.
- **Tem valor na maior parte do tempo?** Um indicador que quase sempre mostra 0 ou "Sem dados" desperdiça a melhor posição da tela.
- **A cor diz a verdade?** Chip verde ou vermelho só quando subir é bom ou ruim de verdade para o usuário. Uma variação sem juízo (o prêmio caiu porque alguém ganhou) vai sem chip colorido, ou nem aparece.
- **Aparece uma vez só.** O mesmo número em dois cartões é desperdício.
- **Status de sistema só quando há problema.** Um cartão "Tudo certo" fixo ocupa o lugar de um dado. A falha vira faixa de alerta no topo. Quando tudo está bem, basta o frescor ("Dados até 8 nov") no cabeçalho.
- **Sazonal tem prazo.** Um item de época (Virada, fechamento do mês) ganha destaque quando está perto e some quando não se aplica.

## 5. Mapa de posições

O olho começa em cima à esquerda e desce em Z. A posição é a prioridade.

```
┌──────────────────────────────────────┬──────────────────┐
│ 1+2. Decisão + motivo + prazo + ação │ 3. Situação dele │
│     (cartão herói, 8 de 12)          │    (4 de 12)     │
├──────────────────────────────────────┼──────────────────┤
│ 4. Contexto: o gráfico que explica   │ 6. Apoio         │
│    o motivo (8 de 12)                │    (sazonal etc.)│
├──────────────────────────────────────┴──────────────────┤
│ 5. Detalhe: a única lista, com abas                     │
└─────────────────────────────────────────────────────────┘
```

- **Decisão, motivo e prazo no mesmo cartão.** Nunca o "Sem aposta" num cartão e o "volta R$ 0,10, mínimo R$ 0,38" em outro.
- **O material da ação aparece sem clique.** Se há jogos para apostar, eles ficam no cartão herói (com o botão de copiar), não numa tela à parte.
- **O gráfico principal explica o cartão herói.** Ele mostra a mesma medida da decisão ao longo do tempo, com a linha do limite, não outra métrica solta.
- **No celular, a ordem é a ordem de prioridade:** herói, situação, contexto, lista, apoio.
- **O alerta entra acima de tudo**, e só enquanto existir.
- **Faixa de indicadores (KPIs) não é obrigatória.** Use quando há 3 a 5 números do mesmo nível. Não invente indicadores para completar a faixa.

## 6. Plano escrito (entregue junto com os prints)

Antes do código, monte a tabela e confira se cada linha passou no filtro do passo 4:

| Informação | Pergunta | Nível | Posição | Formato | Quando some |
|---|---|---|---|---|---|
| Apostar ou não, prêmio, data e prazo | 1 | 1 | Herói, topo à esquerda | Chip de status + número grande + bloco de data | Nunca |
| Volta por real e mínimo | 2 | 2 | Herói, à direita | Régua com marca do mínimo | Sem estimativa: "Sem estimativa" |
| Jogos do próximo concurso | 1 | 1 | Herói, embaixo | Dezenas + Copiar | Sem jogos |
| ... | | | | | |

Na entrega, resuma o plano em poucas linhas: o que entrou, o que saiu e para onde foi.

## Errado e certo (MegaLab, Início)

| Errado | Certo |
|---|---|
| "Sem aposta" num cartão pequeno da faixa de baixo e a volta por real num medidor em outro cartão | Cartão herói em cima à esquerda: status, prêmio, data, prazo e a régua da volta por real contra o mínimo |
| Indicador "Sem ganhador: 0" (curiosidade, quase sempre 0) | Fora. "Acumulou" aparece como chip na lista de sorteios |
| Prêmio estimado com chip vermelho "↘ 94%" porque alguém ganhou o anterior | Prêmio sem chip de juízo; o que importa é se vale apostar |
| Gráfico de prêmio por concurso (não explica a decisão) | Gráfico da volta por real por concurso com a linha tracejada do mínimo; acima dela, em destaque |
| Lista genérica de todos os sorteios | A mesma lista com a coluna "Minha aposta" (acertos e saldo) e a aba "Apostei" |
| Cartão "Rotinas: Tudo certo" fixo | Faixa de alerta só quando uma rotina falha |
| Jogos recomendados só na tela de apostas | Jogos no cartão herói quando existem, com Copiar |
| Carteira reduzida a "Saldo R$ 0,00" | Cartão de situação: saldo, apostado, prêmios e melhor acerto |
