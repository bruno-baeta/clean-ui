#!/usr/bin/env node
/**
 * Prints + verificação visual automática das regras da skill clean-ui.
 *
 * Uso:
 *   node check-ui.mjs <url> [<url>...] [--out=pasta] [--widths=320,390,1366x650,1536x730,1920x950,2560x960,2752x1100,3440x1300] [--themes=dark,light] [--user=x --pass=y]
 *
 * Para cada URL, tamanho de tela e tema (escuro e claro por padrão): tira print da página inteira e mede:
 *   - rolagem horizontal (algo estourando a largura)
 *   - mapa/gráfico passando da borda de baixo da primeira tela ou mais alto que a janela
 *   - várias listas com itens parecidos na mesma tela
 *   - em telas largas: gráfico achatado (proporção > 4:1) e linha de lista com mais de 900 px
 *   - página que não muda entre os temas, ou superfície grande com cor fixa do outro tema
 *   - texto cortado com "…"
 *   - cartões lado a lado com alturas diferentes (simetria), também dentro de invólucros sem fundo
 *   - cartão com vão vazio por dentro (esticou e o conteúdo ficou espalhado ou num canto)
 *   - grid com a última linha incompleta
 *   - ícones soltos (svg sem container com fundo)
 *   - hover que move ou muda borda (regras CSS :hover)
 *   - texto visível começando com minúscula, " · ", "—"
 *   - caixas com scroll interno
 *   - conteúdo estreito centralizado no web
 *   - fonte principal da lista proibida
 *
 * Requer Playwright no projeto (npm i -D playwright ou @playwright/test) e um navegador
 * (npx playwright install chromium; ou usa o Edge/Chrome instalado).
 * O relatório é um guia: abra os prints e confirme com os olhos.
 */
import { mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { createRequire } from 'node:module';

const args = process.argv.slice(2);
const opt = Object.fromEntries(args.filter((a) => a.startsWith('--')).map((a) => { const [k, v] = a.slice(2).split('='); return [k, v ?? true]; }));
const urls = args.filter((a) => !a.startsWith('--'));
if (!urls.length) { console.log('Uso: node check-ui.mjs <url> [--out=pasta] [--widths=320,390,1366x650,1536x730,1920x950,2560x960,2752x1100,3440x1300] [--themes=dark,light] [--user=x --pass=y]'); process.exit(2); }
const out = resolve(opt.out || 'ui-check');
// Alturas = área útil do navegador (tela menos barras), não a tela inteira. "390" usa 844 no mobile e 900 no web.
const sizes = String(opt.widths || '320,390,1366x650,1536x730,1920x950,2560x960,2752x1100,3440x1300').split(',').map((v) => {
  const [w, h] = v.toLowerCase().split('x').map(Number);
  return { width: w, height: h || (w < 800 ? 844 : 900) };
});
const themes = opt.light ? ['light'] : opt.dark ? ['dark'] : String(typeof opt.themes === 'string' ? opt.themes : 'dark,light').split(',');
mkdirSync(out, { recursive: true });

// Playwright do projeto atual (procura a partir da pasta de onde o comando é rodado).
const req = createRequire(join(process.cwd(), 'noop.js'));
let chromium;
for (const m of ['playwright', '@playwright/test', 'playwright-core']) { try { ({ chromium } = req(m)); break; } catch {} }
if (!chromium) { console.error('Playwright não encontrado neste projeto. Rode: npm i -D playwright && npx playwright install chromium'); process.exit(2); }

async function launch() {
  for (const channel of [undefined, 'chrome', 'msedge']) {
    try { return await chromium.launch(channel ? { channel } : {}); } catch {}
  }
  throw new Error('Nenhum navegador disponível (npx playwright install chromium)');
}

/** Roda dentro da página: devolve a lista de problemas. */
function audit(theme) {
  const BANNED = ['inter', 'roboto', 'arial', 'helvetica', 'geist', 'poppins', 'montserrat', 'space grotesk', 'open sans', 'lato', 'system-ui', '-apple-system', 'segoe ui'];
  const issues = [];
  const add = (rule, el, extra = '') => {
    const txt = (el?.innerText || el?.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 60);
    const tag = el ? `<${el.tagName.toLowerCase()}${el.className && typeof el.className === 'string' ? ` class="${el.className.slice(0, 50)}"` : ''}>` : '';
    issues.push(`${rule}${extra ? ` (${extra})` : ''}${tag ? `  ${tag}` : ''}${txt ? `  "${txt}"` : ''}`);
  };
  const vw = document.documentElement.clientWidth;
  const visible = (el) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && +s.opacity > 0; };
  const bg = (el) => { const c = getComputedStyle(el).backgroundColor; return c && c !== 'transparent' && !/rgba\(.*,\s*0\)$/.test(c); };
  const all = [...document.body.querySelectorAll('*')].filter(visible);

  // Clicável sem mãozinha
  const clickable = all.filter((el) => el.matches('button:not(:disabled), a[href], [role="button"], [onclick]') || (el.tagName === 'g' && getComputedStyle(el).cursor === 'pointer'));
  const noHand = clickable.filter((el) => el.matches('button, a[href], [role="button"]') && getComputedStyle(el).cursor !== 'pointer');
  if (noHand.length) add(`clicável sem mãozinha no hover (${noHand.length} elementos; use cursor: pointer)`, noHand[0]);

  // Simetria: linhas de cartões empilhadas cujas bordas verticais quase coincidem (2 a 40 px de diferença)
  // Só faixas de cartões: grade com 2+ filhos visíveis de pelo menos 120 px de largura.
  const grids = all.filter((el) => getComputedStyle(el).display === 'grid' && [...el.children].filter((c) => visible(c) && c.getBoundingClientRect().width >= 120).length >= 2);
  const edgesOf = (g) => [...g.children].filter(visible).flatMap((c) => { const r = c.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.right)]; });
  for (const g of grids) {
    const next = g.nextElementSibling;
    if (!next || !grids.includes(next)) continue;
    const a = edgesOf(g), b = edgesOf(next);
    const off = b.filter((x) => a.some((y) => Math.abs(x - y) >= 2 && Math.abs(x - y) <= 40) && !a.some((y) => Math.abs(x - y) < 2));
    if (off.length) add('cartões de linhas vizinhas com bordas quase alinhadas (alinhe as colunas entre as linhas)', next, `x=${off.slice(0, 3).join(', ')}`);
  }

  // Rolagem horizontal
  if (document.documentElement.scrollWidth > vw + 1) {
    const culprit = all.find((el) => el.getBoundingClientRect().right > vw + 1 && getComputedStyle(el).position !== 'fixed' && !el.closest('.no-scrollbar, [class*="overflow-x-auto"]'));
    add('estoura a largura da tela', culprit, `${document.documentElement.scrollWidth}px > ${vw}px`);
  }

  // Fonte
  const fam = getComputedStyle(document.body).fontFamily.split(',')[0].replace(/["']/g, '').trim().toLowerCase();
  if (BANNED.some((b) => fam.startsWith(b))) add('fonte proibida', null, fam);

  for (const el of all) {
    const s = getComputedStyle(el);
    // Reticências de verdade (texto maior que a caixa)
    if ((s.textOverflow === 'ellipsis' || +s.webkitLineClamp > 0) && (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1)) add('texto cortado com "…"', el);
    // Scroll interno (fora html/body e faixas horizontais de chips)
    if (/(auto|scroll)/.test(s.overflowY) && el.scrollHeight > el.clientHeight + 4 && el.clientHeight > 40 && el !== document.body && el !== document.documentElement && el.tagName !== 'SELECT' && el.tagName !== 'TEXTAREA' && !el.closest('[role="dialog"], [role="listbox"], [role="menu"]')) add('caixa com scroll interno', el);
  }

  // Simetria: irmãos com fundo (cartões) na mesma linha precisam ter a mesma altura;
  // e um grid não pode terminar com linha incompleta.
  for (const parent of all) {
    const s = getComputedStyle(parent);
    if (!(s.display.includes('grid') || (s.display.includes('flex') && !s.flexDirection.startsWith('column')))) continue;
    const kids = [...parent.children].filter(visible);
    // O cartão pode vir dentro de um invólucro sem fundo (div com ref para medir a altura): desce enquanto houver um filho só.
    const cardOf = (k) => { let e = k; while (e && !bg(e) && e.children.length === 1) e = e.children[0]; return e && bg(e) && parseFloat(getComputedStyle(e).borderRadius) >= 8 ? e : null; };
    const cards = kids.map(cardOf).filter((c) => c && c.getBoundingClientRect().height > 48);
    if (cards.length < 2) continue;
    const rows = new Map();
    for (const c of cards) { const r = c.getBoundingClientRect(); const key = Math.round(r.top / 4); (rows.get(key) || rows.set(key, []).get(key)).push(r.height); }
    for (const hs of rows.values()) if (hs.length > 1 && Math.max(...hs) - Math.min(...hs) > 2) add('cartões lado a lado com alturas diferentes', parent, hs.map((h) => Math.round(h)).join(' vs '));
    if (s.display.includes('grid') && kids.length > 1 && kids.every(bg)) {
      const cols = s.gridTemplateColumns.split(' ').filter(Boolean).length;
      if (cols > 1 && kids.length > cols && kids.length % cols !== 0 && !kids.some((k) => /span/.test(getComputedStyle(k).gridColumn))) add('grid com a última linha incompleta', parent, `${kids.length} itens em ${cols} colunas`);
    }
  }

  // Vão por dentro do cartão: o cartão esticou (flex-1, linha do grid) e o conteúdo ficou espalhado ou num canto
  // (linhas com justify-around, bloco preso em cima). Mede o maior trecho vertical sem nada visível.
  for (const card of all) {
    // Menu lateral fica de fora: o vão entre as áreas e as ferramentas é de propósito.
    if (!bg(card) || parseFloat(getComputedStyle(card).borderRadius) < 8 || card.closest('nav, aside, [role="dialog"]')) continue;
    const cr = card.getBoundingClientRect();
    if (cr.height < 280 || cr.width < 200) continue;
    const boxes = [];
    for (const el of card.querySelectorAll('*')) {
      if (!visible(el)) continue;
      const leaf = el.tagName === 'svg' || el.tagName === 'IMG' || el.tagName === 'CANVAS' || [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) || (bg(el) && el !== card);
      if (!leaf || el.closest('svg') !== null && el.tagName !== 'svg') continue;
      const r = el.getBoundingClientRect();
      if (r.height > 0) boxes.push([r.top, r.bottom]);
    }
    if (!boxes.length) continue;
    boxes.sort((a, b) => a[0] - b[0]);
    let gap = boxes[0][0] - cr.top, end = boxes[0][1], empty = Math.max(0, boxes[0][0] - cr.top);
    for (const [t, b] of boxes) { if (t > end) empty += t - end; gap = Math.max(gap, t - end); end = Math.max(end, b); }
    gap = Math.max(gap, cr.bottom - end); empty += Math.max(0, cr.bottom - end);
    // Estado vazio centralizado de propósito (vão igual em cima e embaixo, poucas peças) não conta.
    const centered = boxes.length <= 6 && Math.abs((boxes[0][0] - cr.top) - (cr.bottom - end)) < 32;
    if (!centered && gap > Math.max(140, cr.height * 0.25)) add('cartão com vão vazio por dentro (conteúdo preso num canto)', card, `${Math.round(gap)} px sem nada em ${Math.round(cr.height)} px`);
    // Linhas espalhadas (justify-around/between num cartão esticado): nenhum vão grande sozinho, mas a soma é mais da metade.
    // Estado vazio (ícone + uma linha no meio) tem poucas peças e fica de fora.
    else if (cr.height > 400 && boxes.length >= 6 && empty > cr.height * 0.5) add('cartão com conteúdo espalhado (mais da metade da altura vazia)', card, `${Math.round(empty)} px vazios em ${Math.round(cr.height)} px`);
  }

  // Ícones soltos: svg sem fundo no próprio elemento ou nos 2 ancestrais, fora de botões/links/chips.
  for (const svg of document.querySelectorAll('svg')) {
    // Modo central de dados (data-ui="painel"): ícone pequeno sem quadradinho é permitido.
    if (!visible(svg) || svg.closest('button, a, [role="button"], summary, select, label, .recharts-wrapper, [role="img"], [data-ui="painel"]')) continue;
    const r = svg.getBoundingClientRect();
    if (r.width < 12 || r.width > 40) continue;
    let p = svg.parentElement, ok = false;
    for (let i = 0; i < 2 && p; i++, p = p.parentElement) if (bg(p)) { ok = true; break; }
    if (!ok && !/chevron/i.test(svg.getAttribute('class') || '')) add('ícone sem container com fundo', svg.parentElement);
  }

  // Texto visível: minúscula no início, " · ", "—"
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const seen = new Set();
  for (let n; (n = walker.nextNode());) {
    const t = n.textContent.trim();
    const el = n.parentElement;
    if (!t || !el || seen.has(el) || !visible(el) || el.closest('script, style, code, pre, svg, input, textarea, [aria-hidden="true"]')) continue;
    const prev = n.previousSibling;
    const first = !prev || (prev.nodeType === 1 && getComputedStyle(prev).display !== 'inline');
    if (first && /^[a-záéíóúâêôãõç]/.test(t) && !/^(de|da|do|e|ou|em|a|o|no|na|x|vs|https?:)\b/.test(t)) { seen.add(el); add('texto começando com minúscula', el); }
    if (/ · /.test(t)) { seen.add(el); add('informações separadas por " · "', el); }
    if (/—/.test(t)) { seen.add(el); add('travessão no texto', el); }
  }

  // Cabe na altura da tela: mapas, gráficos e imagens não passam da borda de baixo da primeira tela
  // nem ficam mais altos que a janela (listas podem continuar abaixo). "Primeira tela" = blocos que começam
  // nos 60% de cima; um bloco que começa perto do rodapé naturalmente continua rolando.
  const vh = window.innerHeight;
  const cards = all.filter((el) => bg(el) && parseFloat(getComputedStyle(el).borderRadius) >= 8 && el.getBoundingClientRect().height > 48 && getComputedStyle(el).position !== 'fixed' && !el.closest('[role="dialog"]'));
  const outer = cards.filter((c) => !cards.some((o) => o !== c && o.contains(c)));
  for (const c of outer) {
    const visual = [...c.querySelectorAll('svg[viewBox], canvas, img, video, .recharts-wrapper')].some((v) => v.getBoundingClientRect().height > 120);
    if (!visual) continue;
    const r = c.getBoundingClientRect();
    const top = r.top + window.scrollY;
    if (r.height > vh - 32) add('mapa/gráfico mais alto que a tela', c, `${Math.round(r.height)}px, tela ${vh}px`);
    else if (top < vh * 0.6 && top + r.height > vh + 1) add('mapa/gráfico passa da borda de baixo da primeira tela', c, `vai até ${Math.round(top + r.height)}px, tela ${vh}px`);
  }

  // Gráfico que sumiu (contêiner com altura zero, ex.: flex-1 com altura fixa no celular).
  for (const c of document.querySelectorAll('.recharts-responsive-container, [data-chart]')) {
    const r = c.getBoundingClientRect();
    if (getComputedStyle(c).display !== 'none' && r.width > 0 && r.height < 40) { add('gráfico sem altura (sumiu da tela; no celular não use flex-1 junto com altura fixa)', c.parentElement, Math.round(r.height) + 'px'); break; }
  }

  // Texto espremido: bloco de texto bem mais alto que largo, com poucas letras por linha.
  {
    let hits = 0;
    for (const el of all) {
      if (hits >= 2) break;
      if (el.children.length || el.closest('svg')) continue;
      const t = (el.textContent || '').trim();
      if (t.length < 8) continue;
      const r = el.getBoundingClientRect();
      const lh = parseFloat(getComputedStyle(el).lineHeight) || parseFloat(getComputedStyle(el).fontSize) * 1.3;
      const lines = Math.round(r.height / lh);
      const fsz = parseFloat(getComputedStyle(el).fontSize) || 14;
      if (lines >= 3 && (t.length / lines < 6 || r.width < fsz * 6)) { hits++; add('texto espremido (coluna estreita demais: poucas letras por linha)', el, `${lines} linhas, ${Math.round(r.width)}px`); }
    }
  }

  // Linha de lista com título ou descrição quebrando porque uma coluna à direita (chip, valor) espreme o texto.
  // Vale em toda largura: no ultrawide a lista em 3 colunas espreme igual ao celular.
  {
    let hits = 0;
    for (const list of document.querySelectorAll('ul, ol')) {
      if (hits >= 3) break;
      const items = [...list.children].filter((li) => li.tagName === 'LI' && visible(li));
      if (items.length < 3) continue;
      let wrapped = 0, sample = null;
      for (const li of items) {
        const lr = li.getBoundingClientRect();
        const texts = [...li.querySelectorAll('*')].filter((el) => !el.children.length && !el.closest('svg') && visible(el) && (el.textContent || '').trim().length >= 8);
        const bad = texts.find((el) => {
          // Conta as linhas pelo texto de verdade (chip de altura fixa não engana).
          const range = document.createRange(); range.selectNodeContents(el);
          const rects = [...range.getClientRects()].filter((q) => q.width > 1);
          const lines = new Set(rects.map((q) => Math.round(q.top / 4))).size;
          // Borda da coluna do texto (bloco que o contém), não do fim da última palavra: quebra de palavra deixa sobra.
          let col = el; while (col.parentElement && getComputedStyle(col).display === 'inline') col = col.parentElement;
          const right = col.getBoundingClientRect().right;
          // Quebrou e ainda sobra uma coluna com conteúdo à direita do texto.
          return lines >= 2 && lr.right - right > 64;
        });
        if (bad) { wrapped++; sample ||= bad; }
      }
      if (wrapped >= (vw < 1024 ? 2 : 1)) { hits++; add(vw < 1024 ? 'linha de lista com texto quebrando no celular (coluna à direita espreme o título/descrição: desça chip e valor para uma linha embaixo do texto)' : 'linha de lista com texto quebrando (colunas da lista estreitas demais: menos colunas de linhas, tire o minigráfico ou estreite as colunas fixas)', sample, `${wrapped} de ${items.length} linhas`); }
    }
  }

  // Tela larga: gráfico achatado (proporção exagerada) e linha de lista larga demais.
  if (vw >= 1366) {
    for (const v of document.querySelectorAll('.recharts-wrapper, svg[viewBox], canvas')) {
      if (!visible(v) || v.closest('.recharts-wrapper') !== null && v.tagName.toLowerCase() === 'svg') continue;
      const r = v.getBoundingClientRect();
      if (r.height < 80) continue;
      const ratio = r.width / r.height;
      if (ratio > 4.2) add('gráfico achatado (largo demais para a altura; ganhe colunas)', v.parentElement, `${Math.round(r.width)}×${Math.round(r.height)}`);
    }
    let rowHits = 0;
    const repeated = [...document.querySelectorAll('a, button, div')].filter((el) => {
      const d = getComputedStyle(el).display;
      if (d !== 'grid' && d !== 'flex') return false;
      const sib = el.parentElement ? [...el.parentElement.children].filter((c) => c.className === el.className) : [];
      return sib.length >= 3 && el.className;
    });
    for (const li of [...document.querySelectorAll('li, [role="row"]'), ...repeated]) {
      if (rowHits >= 2 || !visible(li)) continue;
      const r = li.getBoundingClientRect();
      if (r.width > 900 && r.height < 120) { rowHits++; add('linha de lista larga demais (use colunas ou mestre e detalhe)', li, `${Math.round(r.width)}px`); }
    }
  }

  // Uma lista por tela: listas com itens de mesma estrutura repetidas, ou listas demais.
  const lists = [...document.querySelectorAll('ul, ol, [role="list"]')]
    .filter((l) => visible(l) && !l.closest('nav, [role="dialog"], [role="listbox"], [role="menu"]') && [...l.children].filter(visible).length >= 3);
  const sig = (li) => [...li.querySelectorAll('*')].slice(0, 30).map((e) => e.tagName).join('.');
  const groups = new Map();
  for (const l of lists) { const k = sig(l.children[0]); groups.set(k, [...(groups.get(k) || []), l]); }
  for (const g of groups.values()) if (g.length > 1) add('listas com itens parecidos repetidas na tela (use uma lista com filtro/ordem)', g[1], `${g.length} listas`);
  if (lists.length > 2) add('listas demais na mesma tela', null, `${lists.length} listas`);

  // Tema: superfícies grandes com a cor do outro tema (cor fixa no código).
  // Converte qualquer formato de cor (rgb, oklab, color-mix...) pelo canvas.
  const cv = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
  const lum = (c) => {
    if (!c || c === 'none' || c === 'transparent') return null;
    cv.clearRect(0, 0, 1, 1); cv.fillStyle = '#000'; cv.fillStyle = c; cv.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = cv.getImageData(0, 0, 1, 1).data;
    if (a < 128) return null;
    const [r2, g2, b2] = [r, g, b].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
    return 0.2126 * r2 + 0.7152 * g2 + 0.0722 * b2;
  };
  const area = vw * vh;
  let themeHits = 0;
  // Só elementos que pintam: HTML pelo fundo, SVG pelas formas (svg/g "herdam" preto sem pintar nada).
  for (const el of [...all.filter((e) => !(e instanceof SVGElement)), ...document.querySelectorAll('svg path, svg rect, svg circle, svg ellipse, svg polygon')]) {
    if (themeHits >= 5) break;
    const r = el.getBoundingClientRect();
    if (r.width * r.height < area * 0.03) continue;
    const s = getComputedStyle(el);
    if (el instanceof SVGElement && (s.fill === 'none' || s.fill.startsWith('url(') || +s.fillOpacity < 0.5 || el.closest('[aria-hidden="true"]'))) continue;
    const L = lum(el instanceof SVGElement ? s.fill : s.backgroundColor);
    if (L == null) continue;
    if (theme === 'light' && L < 0.03) { themeHits++; add('superfície escura no tema claro (cor fixa?)', el); }
    if (theme === 'dark' && L > 0.6) { themeHits++; add('superfície clara no tema escuro (cor fixa?)', el); }
  }

  // Conteúdo estreito centralizado no web
  if (vw >= 1200) {
    const main = document.querySelector('main') || document.body;
    for (const el of [main, ...main.children]) {
      const s = getComputedStyle(el); const r = el.getBoundingClientRect();
      if (s.maxWidth !== 'none' && r.width < vw * 0.7 && r.height > window.innerHeight * 0.4 && Math.abs(r.left - (vw - r.right)) < 24) { add('conteúdo estreito centralizado no web', el, `${Math.round(r.width)}px de ${vw}px`); break; }
    }
  }
  return issues;
}

/** Regras CSS de :hover que movem ou mudam borda (lidas das folhas de estilo). */
function hoverRules() {
  const bad = new Set();
  const visit = (rules) => {
    for (const r of rules) {
      if (r.cssRules) visit(r.cssRules);
      if (!r.selectorText || !r.selectorText.includes(':hover')) continue;
      const st = r.style;
      const props = ['transform', 'translate', 'scale', 'rotate', 'border-color', 'border-top-color', 'outline-color', '--tw-ring-color', '--tw-translate-y', '--tw-translate-x', '--tw-scale-x', '--tw-shadow', 'box-shadow'].filter((p) => st.getPropertyValue(p));
      if (props.length) bad.add(`${r.selectorText.slice(0, 80)} { ${props.join(', ')} }`);
    }
  };
  for (const sh of document.styleSheets) { try { visit(sh.cssRules); } catch {} }
  return [...bad];
}

const browser = await launch();
let total = 0;
for (const url of urls) {
  const slug = url.replace(/^https?:\/\//, '').replace(/[^a-z0-9]+/gi, '-').replace(/-+$/, '').slice(0, 60) || 'pagina';
  for (const { width, height } of sizes) {
   const bodyBg = {};
   for (const theme of themes) {
    const ctx = await browser.newContext({
      viewport: { width, height },
      deviceScaleFactor: width < 800 ? 2 : 1,
      isMobile: width < 800, hasTouch: width < 800,
      colorScheme: theme,
      // Prints com o estado final: os gráficos animam na entrada, mas respeitam "reduzir movimento" (useChartMotion no kit).
      reducedMotion: 'reduce',
      ...(opt.user ? { httpCredentials: { username: opt.user, password: opt.pass || '' } } : {}),
    });
    const page = await ctx.newPage();
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
    } catch (e) { console.log(`\n${url} @ ${width}x${height} ${theme}: não abriu (${e.message.split('\n')[0]})`); await ctx.close(); continue; }
    // Espera o anel de carregando sumir (até 20 s) para medir a tela de verdade.
    await page.waitForFunction(() => !document.querySelector('[role="status"][aria-label="Carregando"], [aria-busy="true"]'), null, { timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(600);
    const vazia = await page.evaluate(() => {
      const t = document.body.innerText.trim();
      if (document.querySelector('[role="status"][aria-label="Carregando"]')) return 'ainda carregando depois de 20 s';
      if (t.length < 60) return 'quase sem conteúdo';
      if (/não foi possível|sem conexão|erro ao carregar|tente de novo/i.test(t) && t.length < 400) return 'tela de erro';
      return '';
    });
    const file = join(out, `${slug}-${width}x${height}-${theme === 'light' ? 'claro' : 'escuro'}.png`);
    await page.screenshot({ path: file, fullPage: true });
    const issues = await page.evaluate(audit, theme);
    bodyBg[theme] = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    if (theme === themes[0]) {
      // Balões do "i": cada um precisa abrir inteiro dentro da janela.
      const tips = page.locator('button[aria-label^="Sobre"], button[aria-label="Mais informações"]');
      const n = await tips.count();
      for (let i = 0; i < n; i++) {
        const t = tips.nth(i);
        if (!(await t.isVisible())) continue;
        await t.scrollIntoViewIfNeeded();
        await t.click();
        await page.waitForTimeout(60);
        const r = await page.evaluate(() => { const el = document.querySelector('[role="tooltip"]'); if (!el) return null; const b = el.getBoundingClientRect(); return [b.left, b.top, b.right, b.bottom, document.documentElement.clientWidth, innerHeight]; });
        if (r && (r[0] < 0 || r[1] < 0 || r[2] > r[4] + 0.5 || r[3] > r[5] + 0.5)) issues.push(`balão de informação fora da tela  "${await t.getAttribute('aria-label')}"`);
        await page.keyboard.press('Escape');
      }
      await page.evaluate(() => scrollTo(0, 0));
      // Celular: barra de rolagem visível ocupa espaço e destoa.
      if (width < 1024) {
        const sb = await page.evaluate(() => getComputedStyle(document.documentElement).scrollbarWidth);
        if (sb !== 'none') issues.push('barra de rolagem visível no celular (esconda com scrollbar-width: none abaixo de lg, ver tokens.css)');
      }
    }
    if (width === sizes[0].width && theme === themes[0]) issues.push(...(await page.evaluate(hoverRules)).map((r) => `hover que move ou muda borda: ${r}`));
    if (theme === themes[themes.length - 1] && themes.length > 1 && new Set(Object.values(bodyBg)).size === 1) issues.push('a página não muda entre tema claro e escuro (falta um dos temas)');
    total += issues.length;
    console.log(`\n${url} @ ${width}x${height} ${theme === 'light' ? 'claro' : 'escuro'}  ->  ${file}`);
    if (vazia) issues.unshift(`a página não mostrou os dados (${vazia}): o check não vale, confira a API e rode de novo`);
    const tag = `[${width}x${height} ${theme === 'light' ? 'claro' : 'escuro'}]`;
    console.log(issues.length ? issues.map((i) => `  - ${tag} ${i}`).join('\n') : '  ok');
    await ctx.close();
   }
  }
}
await browser.close();
console.log(`\n${total} achado(s). Abra os prints e confira com os olhos antes de mostrar.`);
process.exit(total ? 1 : 0);
