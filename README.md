# clean-ui

Uma skill do [Claude Code](https://claude.com/claude-code) para criar interfaces **minimalistas, com dados em primeiro lugar, que cabem na tela e funcionam nos temas claro e escuro**, com cara de produto feito por gente, não de tela gerada por IA.

Cada regra daqui nasceu de um pedido real de ajuste: um card desalinhado, um gráfico que passava da borda, um texto que ninguém lia. Por isso a skill trata as regras como requisito, não como sugestão.

## O que ela faz

Quando você pede para criar, ajustar ou revisar uma tela, componente, gráfico ou e-mail HTML, o Claude carrega a skill e segue um processo:

1. **Informação antes do layout.** Primeiro decide o que mostrar, em que ordem de prioridade e onde cada coisa fica. Só depois desenha.
2. **Monta com um kit pronto**, medido em dashboards de referência: cards, indicadores, chips, abas, tabelas e gráficos.
3. **Confere com scripts**, que tiram prints em vários tamanhos de tela, nos dois temas, e apontam o que quebrou.
4. **Mostra antes de publicar.** Nada vai para commit ou deploy sem aprovação.

## Princípios

| | |
|---|---|
| **Dados primeiro** | Números, listas e gráficos no lugar de frases. Explicação só no ícone "i". |
| **Cabe na tela** | A primeira tela cabe inteira em 390×844, 1366×650, 1536×730 e 1920×950. Gráfico e mapa nunca passam da borda de baixo. |
| **Dois temas** | Claro e escuro desde o início, seguindo o sistema, com botão para trocar. Cor sempre por token. |
| **Simetria** | Cards lado a lado com a mesma altura, colunas alinhadas, grids completos, nenhum vão dentro de um card. |
| **Cor com propósito** | Base neutra, uma cor de destaque, paletas validadas para contraste e daltonismo. Número nunca pintado. |
| **Tela larga ganha colunas** | Em 1920, 2560 e ultrawide 21:9 a tela abre mais colunas em vez de esticar. |
| **Toque responde** | Mãozinha em tudo que é clicável, estado pressionado no celular, hover que só muda o fundo. |
| **Uma lista por tela** | Nada de várias listas parecidas: uma lista com filtro ou ordem. |

## Instalação

Clone na pasta de skills do Claude Code:

```bash
git clone https://github.com/bruno-baeta/clean-ui.git ~/.claude/skills/clean-ui
```

Na próxima conversa ela aparece como `/clean-ui`. O Claude também a usa sozinho sempre que o trabalho for de interface.

## Conteúdo

```
clean-ui/
├── SKILL.md                    regras, processo e checklist
├── references/
│   ├── informacao.md           o que mostrar, prioridade e posição
│   ├── padroes-aprovados.md    blocos que já foram aprovados
│   ├── armadilhas.md           erros técnicos que já custaram retrabalho
│   ├── migracao.md             roteiro para redesenhar um app inteiro
│   ├── dashboards.md           princípios e composições de dashboard
│   ├── anatomia-dashboard.md   as referências traduzidas em medidas
│   ├── paletas.md              paletas Cobalto, Índigo, Ciano e Coral
│   ├── exemplos.md             casos reais de errado e certo
│   └── exemplos-dashboards/    as 7 referências visuais
├── assets/
│   ├── tokens.css              temas, fonte, foco e gráficos (Tailwind v4)
│   ├── ui.tsx                  componentes base
│   ├── dashboard.tsx           kit de dashboard (Recharts)
│   └── painel.tsx              ajudantes de altura e mapa
└── scripts/
    ├── lint-ui.mjs             revisão estática do código
    └── check-ui.mjs            prints e medidas no navegador
```

## Scripts

**`lint-ui`** varre o código atrás de hover que move, texto cortado com "…", bordas coloridas, fontes proibidas, cor fixa que quebra um dos temas e outros deslizes.

```bash
node ~/.claude/skills/clean-ui/scripts/lint-ui.mjs src
```

**`check-ui`** abre a página de verdade em 320 e 390 px (celular), 1366, 1536 e 1920 px (notebook e monitor) e 2560, 2752 e 3440 px (ultrawide), nos dois temas. Salva os prints e aponta estouro, cards de alturas diferentes, vãos dentro de card, scroll interno, balão fora da tela e mais.

```bash
node ~/.claude/skills/clean-ui/scripts/check-ui.mjs http://localhost:3000/rota --out=prints
```

Opções: `--widths=390,1366x650`, `--dark` ou `--light`, `--user=` e `--pass=` para páginas com senha. Precisa do Playwright no projeto (`npm i -D playwright`).

## Stack

Os componentes e tokens são para **React/Next.js com Tailwind CSS v4**, gráficos com **Recharts**, ícones **lucide-react** e tema com **next-themes**. As regras valem para qualquer stack.

---

As regras, referências e comentários estão em português.
