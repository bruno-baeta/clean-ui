#!/usr/bin/env node
/**
 * Paleta própria, conferida. A IA escolhe as cores; este script diz se elas funcionam.
 *
 *   node paleta.mjs check src/app/globals.css
 *       Lê os tokens dos dois temas (:root e .dark / prefers-color-scheme: dark) e confere contraste de texto,
 *       destaque, chips, gráficos (escala ordenada e séries) e se as séries se distinguem para daltônicos.
 *
 *   node paleta.mjs gerar --destaque=#d9480f [--neutro=marca|frio|quente|puro] [--escuro=grafite|azulado]
 *       Monta um ponto de partida a partir de UMA cor (a da marca ou a escolhida pelo assunto): cinzas levemente
 *       tingidos, destaque ajustado para cada tema, escala ordenada, 3 séries distintas e cores de status.
 *       Imprime o bloco CSS no formato do assets/tokens.css e já confere. Ajuste à mão o que quiser e rode check.
 *
 * Sai com código 1 quando há falha. "Aviso" pede cuidado (ex.: série com contraste baixo precisa de rótulo direto).
 * Cores aceitas: #hex, rgb(), hsl(), oklch(), oklab(). color-mix() e afins são ignorados (aparece "não lido").
 */
import fs from 'node:fs';

// ---------- cor ----------
const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const gam = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
const clamp01 = (x) => Math.min(1, Math.max(0, x));

function rgbToOklab([r, g, b]) {
  const [R, G, B] = [r, g, b].map(lin);
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
}
function oklabToLinear([L, a, b]) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s];
}
const oklch = (L, C, h) => [L, C * Math.cos((h * Math.PI) / 180), C * Math.sin((h * Math.PI) / 180)];
const toLch = ([L, a, b]) => [L, Math.hypot(a, b), ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360];
const inGamut = (rgbLin) => rgbLin.every((c) => c >= -0.0005 && c <= 1.0005);
/** OKLCH -> sRGB, reduzindo o croma até caber na tela (mantém claridade e matiz). */
function fromLch(L, C, h) {
  let c = C;
  while (c > 0 && !inGamut(oklabToLinear(oklch(L, c, h)))) c -= 0.002;
  return oklabToLinear(oklch(L, Math.max(0, c), h)).map((x) => clamp01(gam(clamp01(x))));
}
const hex = (rgb) => '#' + rgb.map((x) => Math.round(clamp01(x) * 255).toString(16).padStart(2, '0')).join('');
const lum = (rgb) => { const [r, g, b] = rgb.map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const over = (fg, alpha, bg) => fg.map((c, i) => c * alpha + bg[i] * (1 - alpha));

// Simulação de daltonismo (Machado et al. 2009, severidade total), em RGB linear.
const CVD = {
  protanopia: [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
  deuteranopia: [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.01182, 0.04294, 0.968881]],
  tritanopia: [[1.255528, -0.076749, -0.178779], [-0.078411, 0.930809, 0.147602], [0.004733, 0.691367, 0.3039]],
};
const simulate = (rgb, M) => { const v = rgb.map(lin); return M.map((row) => clamp01(gam(clamp01(row[0] * v[0] + row[1] * v[1] + row[2] * v[2])))); };
const dE = (a, b) => { const [p, q] = [rgbToOklab(a), rgbToOklab(b)]; return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]); };
// Protanopia e deuteranopia (as comuns, ~8% dos homens) decidem; tritanopia é rara e só gera aviso.
const minCvdDist = (a, b) => Math.min(dE(a, b), ...[CVD.protanopia, CVD.deuteranopia].map((M) => dE(simulate(a, M), simulate(b, M))));
const tritanDist = (a, b) => dE(simulate(a, CVD.tritanopia), simulate(b, CVD.tritanopia));

function parseColor(raw) {
  const s = raw.trim().toLowerCase();
  let m;
  if ((m = s.match(/^#([0-9a-f]{3,8})$/))) {
    let h = m[1];
    if (h.length <= 4) h = [...h].map((c) => c + c).join('');
    const n = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
    return { rgb: n, alpha: h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1 };
  }
  const args = (str) => str.replace(/,/g, ' ').replace(/\//g, ' / ').split(/\s+/).filter(Boolean);
  const num = (t, scale = 1) => (t.endsWith('%') ? (parseFloat(t) / 100) * scale : parseFloat(t));
  const alphaOf = (parts) => { const i = parts.indexOf('/'); if (i >= 0) return num(parts[i + 1], 1); return parts.length === 4 ? num(parts[3], 1) : 1; };
  if ((m = s.match(/^rgba?\((.*)\)$/))) {
    const p = args(m[1]);
    return { rgb: p.slice(0, 3).map((t) => num(t, 255) / 255), alpha: alphaOf(p) };
  }
  if ((m = s.match(/^hsla?\((.*)\)$/))) {
    const p = args(m[1]);
    const h = parseFloat(p[0]), sat = num(p[1], 1), l = num(p[2], 1);
    const f = (n) => { const k = (n + h / 30) % 12; return l - sat * Math.min(l, 1 - l) * Math.max(-1, Math.min(k - 3, 9 - k, 1)); };
    return { rgb: [f(0), f(8), f(4)], alpha: alphaOf(p) };
  }
  if ((m = s.match(/^okl(ch|ab)\((.*)\)$/))) {
    const p = args(m[2]);
    const L = num(p[0], 1);
    if (m[1] === 'ch') return { rgb: oklabToLinear(oklch(L, num(p[1], 0.4), parseFloat(p[2]) || 0)).map((x) => clamp01(gam(clamp01(x)))), alpha: alphaOf(p) };
    return { rgb: oklabToLinear([L, num(p[1], 0.4), num(p[2], 0.4)]).map((x) => clamp01(gam(clamp01(x)))), alpha: alphaOf(p) };
  }
  const named = { white: '#ffffff', black: '#000000', transparent: '#00000000' };
  if (named[s]) return parseColor(named[s]);
  return null;
}

// ---------- leitura do CSS ----------
function readTokens(css) {
  const light = {}, dark = {};
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, '');
  // Leitor mínimo de blocos: guarda o seletor de cada bloco e os blocos de fora (@media).
  const stack = [];
  let buf = '';
  for (const ch of clean) {
    if (ch === '{') { stack.push(buf.split(/[;}]/).pop().trim()); buf = ''; continue; }
    if (ch === '}') {
      const sel = stack.pop() ?? '';
      const outer = stack.join(' ');
      if (!/@theme/.test(sel + outer) && /:root|html|:host|body|^\.dark$|^\.light$|\[data-theme/.test(sel)) {
        const isDark = /dark/.test(sel) || /prefers-color-scheme:\s*dark/.test(outer);
        const target = isDark ? dark : light;
        for (const [, k, v] of buf.matchAll(/(--[\w-]+)\s*:\s*([^;]+);?/g)) target[k] = v.trim();
      }
      buf = '';
      continue;
    }
    buf += ch;
  }
  return { light, dark: { ...light, ...dark } };
}

function resolver(map) {
  const cache = {};
  const get = (name, depth = 0) => {
    if (name in cache) return cache[name];
    let v = map[name];
    if (v == null || depth > 8) return null;
    const ref = v.match(/^var\(\s*(--[\w-]+)\s*(?:,\s*(.+))?\)$/);
    const out = ref ? get(ref[1], depth + 1) ?? (ref[2] ? parseColor(ref[2]) : null) : parseColor(v);
    cache[name] = out;
    return out;
  };
  return get;
}

// ---------- conferência ----------
const fmt = (n) => n.toFixed(2).replace('.', ',');

function checkTheme(name, map) {
  const get = resolver(map);
  const rows = [];
  const add = (level, what, detail) => rows.push({ level, what, detail });
  const card = get('--card')?.rgb, bg = get('--background')?.rgb;
  if (!card || !bg) { add('falha', 'sem --card ou --background', 'o script precisa desses dois tokens'); return rows; }
  const solid = (n, base = card) => { const c = get(n); if (!c) return null; return c.alpha < 1 ? over(c.rgb, c.alpha, base) : c.rgb; };
  const need = (n) => { const c = solid(n); if (!c && n in map) add('aviso', n, `não lido (${map[n]})`); return c; };

  const pair = (fgName, bgName, min, warn, label) => {
    const f = need(fgName), b = bgName === '--card' ? card : bgName === '--background' ? bg : need(bgName);
    if (!f || !b) return;
    const c = contrast(f, b);
    add(c < min ? 'falha' : c < warn ? 'aviso' : 'ok', label, `${fgName} sobre ${bgName}: ${fmt(c)}:1 (mín. ${fmt(min)}${warn > min ? `, ideal ${fmt(warn)}` : ''})`);
  };
  pair('--foreground', '--background', 4.5, 7, 'Texto');
  pair('--foreground', '--card', 4.5, 7, 'Texto no cartão');
  pair('--muted-foreground', '--card', 4.5, 4.5, 'Texto secundário');
  pair('--muted-foreground', '--background', 4.5, 4.5, 'Texto secundário no fundo');
  pair('--primary-foreground', '--primary', 4.5, 4.5, 'Texto do botão principal');
  pair('--primary', '--card', 3, 4.5, 'Destaque no cartão');
  if (map['--chart-axis']) pair('--chart-axis', '--card', 3, 4.5, 'Texto do eixo');

  // Cartão x fundo e borda: precisam aparecer, de leve.
  const cb = contrast(card, bg);
  add(cb < 1.03 ? 'aviso' : 'ok', 'Cartão x fundo', `${fmt(cb)}:1 ${cb < 1.03 ? '(o cartão some no fundo; afaste os dois um pouco)' : ''}`);
  const border = need('--border');
  if (border) { const c = contrast(border, card); add(c < 1.08 ? 'aviso' : c > 2 ? 'aviso' : 'ok', 'Borda', `${fmt(c)}:1 sobre o cartão ${c < 1.08 ? '(invisível)' : c > 2 ? '(forte demais: borda é discreta)' : ''}`); }

  // Status: texto do chip suave (cor a 12% sobre o cartão) precisa ser lido.
  for (const n of ['--critical', '--positive', '--warning']) {
    const c = need(n); if (!c) continue;
    const chip = over(c, 0.12, card), k = contrast(c, chip);
    add(k < 3 ? 'falha' : k < 4.5 ? 'aviso' : 'ok', `Chip ${n.slice(2)}`, `texto sobre o chip suave: ${fmt(k)}:1`);
  }

  // Séries e escala.
  const series = Object.keys(map).filter((k) => /^--(cat|chart)-\d+$/.test(k)).sort();
  const cats = [];
  for (const n of series) {
    const c = need(n); if (!c) continue;
    const k = contrast(c, card);
    add(k < 2 ? 'falha' : k < 3 ? 'aviso' : 'ok', `Série ${n.slice(2)}`, `${fmt(k)}:1 sobre o cartão${k < 3 ? ' (só com rótulo direto ou tabela)' : ''}`);
    if (/--cat-/.test(n) && !cats.some((x) => x.rgb.join() === c.join())) cats.push({ n, rgb: c });
  }
  for (let i = 0; i < cats.length; i++) for (let j = i + 1; j < cats.length; j++) {
    const a = cats[i], b = cats[j];
    const normal = dE(a.rgb, b.rgb), cvd = minCvdDist(a.rgb, b.rgb);
    const lvl = normal < 0.1 || cvd < 0.045 ? 'falha' : normal < 0.15 || cvd < 0.07 ? 'aviso' : 'ok';
    const tri = tritanDist(a.rgb, b.rgb);
    add(lvl === 'ok' && tri < 0.045 ? 'aviso' : lvl, `${a.n.slice(2)} x ${b.n.slice(2)}`, `distância ${fmt(normal * 100)} (protan/deutan, pior caso ${fmt(cvd * 100)}${tri < 0.045 ? `; tritanopia ${fmt(tri * 100)}, rara: use rótulo direto` : ''})`);
  }
  const crit = need('--critical');
  if (crit) for (const c of cats) {
    const d = minCvdDist(c.rgb, crit);
    if (dE(c.rgb, crit) < 0.08) add('aviso', `${c.n.slice(2)} x critical`, `série parecida com a cor de alerta (${fmt(dE(c.rgb, crit) * 100)}); daltonismo ${fmt(d * 100)}`);
  }
  const seq = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => `--seq-${i}`).filter((n) => n in map).map((n) => ({ n, rgb: need(n) })).filter((x) => x.rgb);
  if (seq.length >= 2) {
    const ks = seq.map((s) => contrast(s.rgb, card));
    const rising = ks.every((k, i) => i === 0 || k > ks[i - 1] * 1.12);
    add(rising ? 'ok' : 'falha', 'Escala ordenada', `contraste ${ks.map(fmt).join(' → ')}${rising ? '' : ' (cada degrau precisa ficar visivelmente mais forte que o anterior)'}`);
    if (ks[0] < 1.5) add('aviso', 'Escala ordenada', `o degrau mais fraco quase some no cartão (${fmt(ks[0])}:1; mire em 1,8 ou mais)`);
    const hues = seq.map((s) => toLch(rgbToOklab(s.rgb))).filter(([, C]) => C > 0.03).map(([, , h]) => h);
    const spread = hues.length ? Math.max(...hues.map((h) => Math.max(...hues.map((g) => Math.min(Math.abs(h - g), 360 - Math.abs(h - g)))))) : 0;
    add(spread > 45 ? 'aviso' : 'ok', 'Escala de uma cor', spread > 45 ? `os degraus mudam de cor (${Math.round(spread)}°): dado ordenado é uma cor só, do fraco ao forte` : 'uma cor só');
  }
  return rows;
}

function report(themes) {
  let fails = 0;
  for (const [name, rows] of themes) {
    console.log(`\n${name}`);
    for (const r of rows) {
      if (r.level === 'falha') fails++;
      const tag = r.level === 'ok' ? '  ok   ' : r.level === 'aviso' ? '  aviso' : '  FALHA';
      console.log(`${tag}  ${r.what.padEnd(26)} ${r.detail}`);
    }
  }
  console.log(fails ? `\n${fails} falha(s). Ajuste as cores e rode de novo.` : '\nSem falhas. Confira os avisos e veja a paleta nos prints dos dois temas.');
  return fails;
}

// ---------- geração ----------
function solveL(C, h, base, target, dir) {
  // dir = -1: escurece (tema claro); +1: clareia (tema escuro). Procura a claridade mais próxima da base que atinge o contraste.
  const cardRgb = base;
  let best = null;
  for (let i = 0; i <= 200; i++) {
    const L = dir < 0 ? 0.98 - i * 0.0045 : 0.08 + i * 0.0045;
    const rgb = fromLch(L, C, h);
    if (contrast(rgb, cardRgb) >= target) { best = rgb; break; }
  }
  return best ?? fromLch(dir < 0 ? 0.1 : 0.98, C, h);
}

function generate(opts) {
  const src = parseColor(opts.destaque ?? '');
  if (!src) { console.error('Informe --destaque=#hex (a cor da marca ou a escolhida pelo assunto).'); process.exit(1); }
  const [, C0, H0] = toLch(rgbToOklab(src.rgb));
  const tint = { marca: [H0, 0.012], frio: [250, 0.01], quente: [65, 0.01], puro: [0, 0] }[opts.neutro ?? 'marca'] ?? [H0, 0.012];
  const darkTint = opts.escuro === 'azulado' ? [255, 0.018] : [tint[0], Math.min(tint[1], 0.008)];
  const n = (L, [h, c]) => hex(fromLch(L, c, h));
  const C = Math.max(0.09, Math.min(C0, 0.2));

  const theme = (dark) => {
    const t = dark ? darkTint : tint;
    const base = dark
      ? { background: n(0.145, t), card: n(0.19, t), 'card-2': n(0.21, t), muted: n(0.23, t), accent: n(0.245, t), border: n(0.28, t), foreground: n(0.955, t), 'muted-foreground': n(0.74, t), 'chart-muted': n(0.42, t), 'chart-grid': n(0.24, t), 'chart-axis': n(0.68, t), 'map-sea': n(0.16, t), 'map-land': n(0.25, t), 'map-line': n(0.31, t) }
      : { background: n(0.972, t), card: '#ffffff', 'card-2': n(0.965, t), muted: n(0.952, t), accent: n(0.94, t), border: n(0.91, t), foreground: n(0.2, t), 'muted-foreground': n(0.5, t), 'chart-muted': n(0.8, t), 'chart-grid': n(0.94, t), 'chart-axis': n(0.55, t), 'map-sea': n(0.965, t), 'map-land': n(0.9, t), 'map-line': n(0.85, t) };
    const card = parseColor(base.card).rgb;
    const dir = dark ? 1 : -1;
    const primary = solveL(C, H0, card, dark ? 5.5 : 4.6, dir);
    const pf = contrast([1, 1, 1], primary) >= contrast(fromLch(0.18, 0.02, H0), primary) ? '#ffffff' : n(0.18, [H0, 0.03]);
    const seq = (dark ? [1.9, 3.2, 5.6, 10] : [1.9, 3.2, 5.6, 10.5]).map((k) => hex(solveL(C, H0, card, k, dir)));
    // Séries: a 1 é o destaque; as outras saem do círculo de cores, longe do vermelho de alerta e longe entre si (inclusive para daltônicos).
    const catK = dark ? 5 : 3.6; // no escuro, série mais clara (a mais escura que passa fica apagada)
    const cats = [solveL(C, H0, card, catK, dir)];
    const critH = 25;
    const hueDist = (a, b) => Math.min(Math.abs(a - b), 360 - Math.abs(a - b));
    while (cats.length < 3) {
      let best = null;
      for (let h = 0; h < 360; h += 5) {
        if (hueDist(h, critH) < 22) continue;
        const rgb = solveL(0.14, h, card, dark ? 5 : 3.2, dir);
        const score = Math.min(...cats.map((c) => minCvdDist(c, rgb) * 0.6 + dE(c, rgb) * 0.4));
        if (!best || score > best.score) best = { rgb, score };
      }
      cats.push(best.rgb);
    }
    const status = (h, k, c = 0.16) => hex(solveL(c, h, card, k, dir));
    return {
      ...base,
      primary: hex(primary), 'primary-foreground': pf,
      critical: status(25, dark ? 5.2 : 5.6), 'critical-foreground': dark ? n(0.2, [25, 0.04]) : '#ffffff',
      positive: status(150, dark ? 5.2 : 5.8), warning: status(70, dark ? 7 : 5.6, 0.15),
      'seq-1': seq[0], 'seq-2': seq[1], 'seq-3': seq[2], 'seq-4': seq[3],
      'cat-1': hex(cats[0]), 'cat-2': hex(cats[1]), 'cat-3': hex(cats[2]),
      focus: base['muted-foreground'],
    };
  };
  const light = theme(false), dark = theme(true);
  const block = (t, indent) => Object.entries(t).map(([k, v]) => `${indent}--${k}: ${v};`).join('\n');
  const css = `/* Paleta gerada de ${opts.destaque} (neutro: ${opts.neutro ?? 'marca'}). Ponto de partida: ajuste e rode "paleta.mjs check". */
:root {
  color-scheme: light;
${block(light, '  ')}
  --negative: var(--critical);
  --info: var(--primary);
  --chart-1: var(--cat-1);
  --scrim: rgb(0 0 0 / 0.35);
}

@media (prefers-color-scheme: dark) {
  :root:not(.light) {
    color-scheme: dark;
${block(dark, '    ')}
    --negative: var(--critical);
    --info: var(--primary);
    --chart-1: var(--cat-1);
    --scrim: rgb(0 0 0 / 0.7);
  }
}

:root.dark {
  color-scheme: dark;
${block(dark, '  ')}
  --negative: var(--critical);
  --info: var(--primary);
  --chart-1: var(--cat-1);
  --scrim: rgb(0 0 0 / 0.7);
}
`;
  console.log(css);
  return css;
}

// ---------- linha de comando ----------
const [cmd, ...rest] = process.argv.slice(2);
const opts = Object.fromEntries(rest.filter((a) => a.startsWith('--')).map((a) => { const [k, ...v] = a.slice(2).split('='); return [k, v.join('=') || true]; }));
const files = rest.filter((a) => !a.startsWith('--'));

if (cmd === 'check' && files[0]) {
  const { light, dark } = readTokens(fs.readFileSync(files[0], 'utf8'));
  process.exit(report([['Tema claro', checkTheme('claro', light)], ['Tema escuro', checkTheme('escuro', dark)]]) ? 1 : 0);
} else if (cmd === 'gerar') {
  const css = generate(opts);
  const { light, dark } = readTokens(css);
  console.log('/* Conferência: */');
  report([['Tema claro', checkTheme('claro', light)], ['Tema escuro', checkTheme('escuro', dark)]]);
} else {
  console.log('Uso:\n  node paleta.mjs check <arquivo.css>\n  node paleta.mjs gerar --destaque=#hex [--neutro=marca|frio|quente|puro] [--escuro=grafite|azulado]');
  process.exit(cmd ? 1 : 0);
}
