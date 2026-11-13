# clean-ui

Uma skill no padrão [Agent Skills](https://agentskills.io) (Claude Code, Codex, GitHub Copilot, Cursor, Gemini CLI e Windsurf) para criar interfaces **minimalistas, com dados em primeiro lugar, que cabem na tela e funcionam nos temas claro e escuro**, com cara de produto feito por gente, não de tela gerada por IA.

A skill não impõe um visual. Ela tem três camadas:

1. **Proibido.** Erros que já irritaram alguém de verdade (card desalinhado, gráfico passando da borda, texto que ninguém lê, hover que pula). Nunca acontecem.
2. **Acabamento obrigatório.** Cabe na tela, simetria, dois temas, contraste, estados. Os scripts medem.
3. **Escolhas do agente.** Paleta, fonte, raio, densidade, composição e uma assinatura visual por projeto, guiadas por fundamentos de design. Dois projetos feitos com a skill não devem parecer a mesma tela com outro logo.

## O que ela faz

Quando você pede para criar, ajustar ou revisar uma tela, componente, gráfico ou e-mail HTML, o agente carrega a skill e segue um processo:

1. **Informação antes do layout.** Primeiro decide o que mostrar, em que ordem de prioridade e onde cada coisa fica.
2. **Direção visual própria.** Escreve em 5 linhas a personalidade, a cor, a tipografia, a forma e a assinatura do projeto, tiradas do assunto, e escolhe a composição pela pergunta da tela (não pela faixa de 4 indicadores de sempre).
3. **Monta**, reaproveitando o comportamento do kit (balão que não sai da tela, lista paginada pela altura, animação de gráfico) com o visual do projeto.
4. **Confere com scripts**: a paleta nos dois temas, o código e prints em vários tamanhos de tela.
5. **Mostra antes de publicar.** Nada vai para commit ou deploy sem aprovação.

## Princípios

| | |
|---|---|
| **Dados primeiro** | Números, listas e gráficos no lugar de frases. Explicação só no ícone "i". |
| **Cabe na tela** | A primeira tela cabe inteira em 390×844, 1366×650, 1536×730 e 1920×950. Gráfico e mapa nunca passam da borda de baixo. |
| **Dois temas** | Claro e escuro desde o início, seguindo o sistema, com botão para trocar. Cor sempre por token. |
| **Simetria** | Cards lado a lado com a mesma altura, colunas alinhadas, grids completos, nenhum vão dentro de um card. |
| **Cor com propósito** | Paleta própria por projeto, base neutra e uma cor de destaque, conferida para contraste e daltonismo. Número nunca pintado. |
| **Cara própria** | Cada projeto com direção visual e assinatura próprias; nada de esqueleto repetido. |
| **Tela larga ganha colunas** | Em 1920, 2560 e ultrawide 21:9 a tela abre mais colunas em vez de esticar. |
| **Toque responde** | Mãozinha em tudo que é clicável, estado pressionado no celular, hover que só muda o fundo. |
| **Uma lista por tela** | Nada de várias listas parecidas: uma lista com filtro ou ordem. |

## Instalação

Clone em qualquer pasta e rode o instalador (precisa de Node 18 ou mais novo):

```bash
git clone https://github.com/bruno-baeta/clean-ui.git ~/.claude/skills/clean-ui
node ~/.claude/skills/clean-ui/install.mjs
```

O instalador encontra os agentes da máquina e coloca a skill na pasta de cada um, com link, para um `git pull` atualizar todos de uma vez (`--copy` copia em vez de linkar):

| Agente | Pasta do usuário | Como usa |
|---|---|---|
| Claude Code | `~/.claude/skills/clean-ui` | Carrega sozinho em trabalho de interface; também como `/clean-ui` |
| Codex | `~/.agents/skills` e `~/.codex/skills` | Carrega sozinho pela descrição |
| GitHub Copilot (VS Code e CLI) | `~/.copilot/skills` | Carrega sozinho pela descrição |
| Cursor | `~/.cursor/skills` | Carrega sozinho pela descrição |
| Gemini CLI | `~/.gemini/skills` | Carrega sozinho pela descrição |
| Windsurf | Sem pasta de usuário | Use o modo projeto, abaixo |

Use `--only=codex,cursor` para escolher os agentes e `--dry-run` para ver o que ele faria antes.

### Num projeto (para o time todo)

```bash
node ~/.claude/skills/clean-ui/install.mjs --project caminho/do/projeto
```

Copia a skill para `.agents/skills/clean-ui` (a pasta comum que Codex, Copilot, Cursor e Gemini leem) e escreve uma regra curta para cada agente, apontando para ela:

| Arquivo | Agente |
|---|---|
| `AGENTS.md` (bloco marcado, sem apagar o que já existe) | Codex e outros que leem AGENTS.md |
| `.github/instructions/clean-ui.instructions.md` | GitHub Copilot, nos arquivos de interface |
| `.cursor/rules/clean-ui.mdc` | Cursor, nos arquivos de interface |
| `GEMINI.md` (bloco marcado) | Gemini CLI |
| `.windsurf/rules/clean-ui.md` | Windsurf, nos arquivos de interface |
| `.claude/skills/clean-ui` | Claude Code, quando o projeto já tem `.claude` |

Rodar de novo atualiza tudo no lugar. Faça commit dessas pastas no projeto.

## Conteúdo

```
clean-ui/
├── SKILL.md                    regras, processo e checklist
├── install.mjs                 instala nos agentes (usuário ou projeto)
├── references/
│   ├── informacao.md           o que mostrar, prioridade e posição
│   ├── direcao-visual.md       a cara de cada projeto, composições e teste da mesmice
│   ├── fundamentos.md          hierarquia, espaço, grade, tipo, cor, forma, estados
│   ├── padroes-aprovados.md    blocos que já foram aprovados
│   ├── armadilhas.md           erros técnicos que já custaram retrabalho
│   ├── migracao.md             roteiro para redesenhar um app inteiro
│   ├── dashboards.md           princípios e composições de dashboard
│   ├── anatomia-dashboard.md   o acabamento das referências em medidas de partida
│   ├── paletas.md              papéis da paleta, como montar e 4 exemplos
│   ├── exemplos.md             casos reais de errado e certo
│   └── exemplos-dashboards/    as 7 referências visuais
├── assets/
│   ├── tokens.css              base dos dois temas, foco e gráficos (Tailwind v4)
│   ├── ui.tsx                  componentes base
│   ├── dashboard.tsx           kit de dashboard (Recharts)
│   └── painel.tsx              ajudantes de altura e mapa
└── scripts/
    ├── paleta.mjs              confere (e gera) a paleta nos dois temas
    ├── lint-ui.mjs             revisão estática do código
    └── check-ui.mjs            prints e medidas no navegador
```

## Scripts

**`paleta`** confere a paleta do projeto nos dois temas: contraste de texto, destaque, chips, eixos, escala ordenada e se as séries do gráfico se distinguem para daltônicos. Também gera um ponto de partida a partir de uma cor.

```bash
node ~/.claude/skills/clean-ui/scripts/paleta.mjs check src/app/globals.css
node ~/.claude/skills/clean-ui/scripts/paleta.mjs gerar --destaque=#4d7c4a --neutro=quente
```

**`lint-ui`** varre o código atrás de hover que move, texto cortado com "…", bordas coloridas, fontes proibidas, cor fixa ou solta fora dos tokens e outros deslizes.

```bash
node ~/.claude/skills/clean-ui/scripts/lint-ui.mjs src
```

**`check-ui`** abre a página de verdade em 320 e 390 px (celular), 1366, 1536 e 1920 px (notebook e monitor) e 2560, 2752 e 3440 px (ultrawide), nos dois temas. Salva os prints e aponta estouro, cards de alturas diferentes, vãos dentro de card, scroll interno, balão fora da tela e mais.

```bash
node ~/.claude/skills/clean-ui/scripts/check-ui.mjs http://localhost:3000/rota --out=prints
```

Opções: `--widths=390,1366x650`, `--dark` ou `--light`, `--user=` e `--pass=` para páginas com senha. Precisa do Playwright no projeto (`npm i -D playwright`).

## Stack

Os componentes e tokens são para **React/Next.js com Tailwind CSS v4**, gráficos com **Recharts**, ícones **lucide-react** e tema com **next-themes**. As regras valem para qualquer stack. Os scripts rodam com Node em qualquer agente que tenha terminal.

---

As regras, referências e comentários estão em português.
