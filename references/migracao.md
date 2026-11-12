# Migrar um app inteiro para o novo visual

Roteiro usado na migração do MegaLab (2026-11-12: Início aprovado, depois cerca de 20 telas em 4 frentes paralelas). Cada passo resolve um problema que apareceu de verdade.

## 1. Primeiro uma tela aprovada

Faça uma tela (de preferência a principal) até o usuário aprovar. Ela vira a **implementação de referência**: os agentes copiam o acabamento dela, não da imaginação. Sem ela, cada frente inventa um estilo.

## 2. A base, antes de dividir

Feita por você, sem agentes, porque todas as telas dependem dela:
- **Moldura do app** (`shell`): menu lateral no web, cabeçalho com marca + menu e barra inferior no celular, todos os itens com ícone. Leve junto tudo o que a moldura antiga fazia: indicador de navegação, registrar o service worker, instalar o app, esconder a barra inferior com o teclado aberto, item ativo otimista ao tocar, ativo também nas subpáginas (`path.startsWith(href + '/')`).
- **Peças de página** num arquivo só (`page.tsx` do kit): cabeçalho da página (título no web; no celular só em subpágina, com voltar), botão redondo, pílula de ação, bolas/chips do domínio, paginação, estado vazio. Assim nenhuma frente cria a sua.
- **Tokens no `body`** (`body:has(.novo)`), não só na raiz da moldura: balões e menus abertos em portal (`document.body`) ficam fora da moldura e pegariam as cores antigas.
- **Tema salvo no banco**, se o app já salvava: o botão novo aplica (`next-themes`) e salva (server action). Confira o valor salvo: o padrão antigo `dark` obriga o app a abrir escuro e o check acusa "não muda entre os temas". O padrão certo é `system`.
- `loading`, `error` e `not-found` do grupo de rotas no visual novo.
- Layout raiz à prova de extensões: `darkreader-lock` no `metadata.other` e `suppressHydrationWarning` no `<body>` (ver `armadilhas.md`).
- Reinicie o servidor e confira que **todas as rotas abrem** (curl com status 200) dentro da moldura nova antes de dividir.

## 3. Dividir em frentes paralelas

Uma frente por área (Carteira, Arena, Laboratório, consulta e administração). Cada agente recebe o mesmo brief:
- **Arquivos dele** (as pastas da área) e a lista do que **não pode tocar**: moldura, kit, `globals.css`, layout, a tela de referência, componentes antigos ainda usados por outras telas, código de domínio e banco. Pedidos para os compartilhados vão no relatório.
- **Servidor compartilhado:** não reiniciar e não rodar scripts de banco (banco local de uma conexão só).
- **Ler a skill inteira antes do código**, principalmente `informacao.md` (inventário e plano), `padroes-aprovados.md` e `armadilhas.md`, e a tela de referência.
- **Nada some:** inventário de cada tela antiga (dados, seções recolhidas, dicas, ações, formulários, exportação, filtros pela URL). Cada item fica, muda de lugar com destino dito ou vai para o "i". Os endereços antigos (`?filtro=`, `?aba=`) continuam funcionando.
- **Estado que o banco local não tem:** dados de exemplo temporários, check, prints e apagar (com grep).
- **Verificação:** typecheck, `lint-ui`, `check-ui` em cada rota (ids reais), prints de 390, 1366, 1536, 1920 e 2560 nos dois temas.
- **Relatório:** plano por tela, o que mudou de lugar, o que saiu (deveria ser nada), pedidos para os compartilhados, pendências.

## 4. Integrar

1. Leia os relatórios inteiros. Aplique os pedidos para os arquivos compartilhados (eles valem para todas as telas) e leve as melhorias do kit de volta para a skill.
2. **Só agora apague o código antigo**, quando nenhuma frente o usa mais (conte as importações de cada arquivo). Apagar antes quebra o build de todas as frentes ao mesmo tempo. Tipos ou funções ainda usados mudam de casa antes (ex.: um tipo de domínio vai para `lib/`).
3. Reinicie o servidor (arquivos apagados).
4. Rode tudo: `tsc`, `eslint` (as regras do React 19 pegam setState em efeito, ref lido durante a renderização e `Date.now()` no componente), os testes, `lint-ui` em `src/app` e `src/components`, e o `check-ui` em todas as rotas.
5. Abra os prints de todas as telas você mesmo antes de mostrar.
6. Na entrega, diga o que não deu para ver com os dados locais (telas com apostas, cliques em ações) e os testes ponta a ponta que precisam ser atualizados para os seletores novos.
