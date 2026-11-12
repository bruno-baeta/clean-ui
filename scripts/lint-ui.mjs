#!/usr/bin/env node
/**
 * Varredura estática das regras da skill clean-ui.
 * Uso: node lint-ui.mjs [pasta ou arquivos...]   (padrão: ./src)
 * Sai com código 1 se encontrar algo. Cada achado: arquivo:linha  regra  trecho.
 * Falsos positivos acontecem (ex.: " · " num comentário): leia antes de mudar.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';

const EXT = new Set(['.tsx', '.jsx', '.ts', '.js', '.vue', '.svelte', '.html', '.css', '.astro']);
const SKIP = new Set(['node_modules', '.next', 'dist', 'build', '.git', 'coverage', '.vercel', 'out']);

const RULES = [
  ['hover que move', /hover:(-?translate|scale|-?rotate|shadow-(md|lg|xl|2xl))/],
  ['hover que muda borda/anel', /hover:(border|ring|outline)-/],
  ['group-hover que move', /group-hover:(-?translate|scale)/],
  ['transform em :hover (CSS)', /:hover[^{]*\{[^}]*(transform|translate|scale|box-shadow|border-color)/],
  ['texto cortado com reticências', /\b(truncate|text-ellipsis|line-clamp-\d)\b|text-overflow:\s*ellipsis/],
  ['borda/anel colorido em cartão', /\b(border|ring)-(primary|orange|amber|green|emerald|lime|purple|violet|fuchsia|blue|sky|teal|yellow)(-\d{2,3})?(\/\d+)?\b/],
  ['conteúdo estreito centralizado', /max-w-(2xl|3xl|4xl|5xl|6xl|7xl|screen-(md|lg|xl))\b[^"'`]*\bmx-auto|mx-auto[^"'`]*\bmax-w-(2xl|3xl|4xl|5xl|6xl|7xl)\b/],
  ['fonte "de IA"', /\b(Inter|Roboto|Geist(?!_Mono)|Poppins|Montserrat|Space[_ ]Grotesk|Open[_ ]Sans|Lato)\b/],
  ['verde na interface', /\b(text|bg|fill|stroke)-(green|emerald|lime)-\d{2,3}\b/],
  ['roxo/marrom na interface', /\b(text|bg)-(purple|violet|fuchsia|amber-[89]00|stone-[6-9]00)\b/],
  ['scroll interno em texto', /\b(overflow-y-(auto|scroll))\b[^"'`]*\bmax-h-/],
  ['cor fixa que quebra um dos temas (use token)', /\b(bg|text|fill|stroke|border|ring|from|to|via)-(black|white)(\/\d+)?\b/],
  ['visual dimensionado só pela largura (limite a altura pela tela)', /\bw-full\s+h-auto\b|\bh-auto\s+w-full\b/],
];

// Texto visível em JSX/HTML começando com minúscula: >texto<
const LOWER_TEXT = /(?<![=\-])>\s*([a-záéíóúâêôãõç][^<>{}\n]{2,})</;
// "Rótulo: valor" em texto visível
const LABEL_VALUE = /(?<![=\-])>\s*[A-ZÁÉÍÓÚ][a-záéíóúâêôãõç ]{2,20}:\s+[^<>\s]/;

function walk(p, out) {
  const st = statSync(p);
  if (st.isDirectory()) {
    for (const f of readdirSync(p)) if (!SKIP.has(f)) walk(join(p, f), out);
  } else if (EXT.has(extname(p))) out.push(p);
  return out;
}

const targets = process.argv.slice(2);
const files = (targets.length ? targets : ['src']).flatMap((t) => { try { return walk(t, []); } catch { return []; } });
let n = 0;
for (const f of files) {
  const lines = readFileSync(f, 'utf8').split(/\r?\n/);
  lines.forEach((line, i) => {
    const code = line.trim();
    if (code.startsWith('//') || code.startsWith('*') || code.startsWith('/*')) return;
    const hits = RULES.filter(([, re]) => re.test(line)).map(([name]) => name);
    if (/\.(tsx|jsx|html|vue|svelte|astro)$/.test(f)) {
      if (/—/.test(line)) hits.push('travessão no texto');
      if (/ · |&middot;/.test(line)) hits.push('separador " · "');
      if (LOWER_TEXT.test(line)) hits.push('texto começando com minúscula');
      if (LABEL_VALUE.test(line)) hits.push('"Rótulo: valor"');
      if (/(?:fill|stroke|color|background|stopColor)\s*[=:]\s*\{?\s*["'`]#[0-9a-fA-F]{3,8}\b/.test(line)) hits.push('cor hex fixa em componente/gráfico (use var(--token))');
    }
    for (const h of hits) {
      n++;
      console.log(`${f}:${i + 1}  [${h}]  ${code.slice(0, 140)}`);
    }
  });
}
console.log(n ? `\n${n} achado(s) em ${files.length} arquivo(s).` : `Nada encontrado em ${files.length} arquivo(s).`);
process.exit(n ? 1 : 0);
