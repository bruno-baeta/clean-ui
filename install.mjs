#!/usr/bin/env node
/**
 * Instala a skill clean-ui nos agentes de código mais usados.
 *
 *   node install.mjs                      instala para o usuário em todos os agentes encontrados
 *   node install.mjs --project <pasta>    instala dentro de um projeto (vai junto no git do projeto)
 *
 * Opções:
 *   --only=claude,codex,...   só estes agentes (claude, agents, codex, copilot, cursor, gemini, windsurf)
 *   --copy                    copia em vez de criar link (o link acompanha o `git pull` da skill)
 *   --dry-run                 mostra o que faria, sem mexer em nada
 *
 * Todos leem o mesmo SKILL.md (padrão Agent Skills). Onde o agente não carrega skills sozinho,
 * o modo projeto escreve um arquivo de regra curto que aponta para o SKILL.md.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const NAME = 'clean-ui';
const SRC = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const flag = (f) => args.includes(`--${f}`);
const opt = (f) => { const a = args.find((x) => x.startsWith(`--${f}=`)); if (a) return a.split('=')[1]; const i = args.indexOf(`--${f}`); return i >= 0 ? args[i + 1] : undefined; };
const only = opt('only')?.split(',').map((s) => s.trim().toLowerCase());
const want = (k) => !only || only.includes(k);
const dry = flag('dry-run');
const copy = flag('copy');
const project = opt('project');
const home = os.homedir();
const SKIP = new Set(['.git', 'node_modules', 'install.mjs']);

const log = (verb, where) => console.log(`${dry ? '[simulação] ' : ''}${verb.padEnd(10)} ${where}`);

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const e of fs.readdirSync(from, { withFileTypes: true })) {
    if (SKIP.has(e.name)) continue;
    const a = path.join(from, e.name), b = path.join(to, e.name);
    e.isDirectory() ? copyDir(a, b) : fs.copyFileSync(a, b);
  }
}

/** Coloca a skill em <dir>/clean-ui: link (junction no Windows, sem precisar de administrador) ou cópia. */
function place(dir, { forceCopy = false } = {}) {
  const dest = path.join(dir, NAME);
  if (path.resolve(dest) === path.resolve(SRC)) { log('já está', dest); return; }
  if (dry) { log(forceCopy || copy ? 'copiar' : 'link', dest); return; }
  fs.mkdirSync(dir, { recursive: true });
  if (fs.existsSync(dest)) {
    const st = fs.lstatSync(dest);
    if (st.isSymbolicLink()) fs.unlinkSync(dest);
    else fs.rmSync(dest, { recursive: true, force: true });
  }
  if (!forceCopy && !copy) {
    try { fs.symlinkSync(SRC, dest, process.platform === 'win32' ? 'junction' : 'dir'); log('link', dest); return; } catch { /* cai para cópia */ }
  }
  copyDir(SRC, dest);
  log('copiado', dest);
}

function write(file, text) {
  if (dry) { log('escrever', file); return; }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
  log('escrito', file);
}

/** Acrescenta (ou troca) um bloco marcado num arquivo de instruções que pode já ter conteúdo do projeto. */
function upsertBlock(file, block) {
  const start = `<!-- ${NAME}:inicio -->`, end = `<!-- ${NAME}:fim -->`;
  const body = `${start}\n${block.trim()}\n${end}\n`;
  const cur = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
  const re = new RegExp(`${start}[\\s\\S]*?${end}\\n?`);
  const next = re.test(cur) ? cur.replace(re, body) : `${cur}${cur && !cur.endsWith('\n\n') ? (cur.endsWith('\n') ? '\n' : '\n\n') : ''}${body}`;
  write(file, next);
}

const description = fs.readFileSync(path.join(SRC, 'SKILL.md'), 'utf8').match(/^description:\s*(.+)$/m)?.[1]?.trim() ?? 'Regras de interface clean-ui.';
const UI_GLOBS = ['tsx', 'jsx', 'ts', 'js', 'css', 'scss', 'html', 'vue', 'svelte', 'astro', 'mdx'].map((e) => `**/*.${e}`).join(',');
const pointer = (rel) => `# Clean UI

Para qualquer trabalho de interface (telas, componentes, CSS/Tailwind, gráficos, e-mails HTML, mobile e web), **antes de escrever código leia e siga \`${rel}/SKILL.md\`** e os arquivos de \`${rel}/references/\` que ele indicar. As regras são requisito, não sugestão.

Antes de mostrar o resultado, rode:

- \`node ${rel}/scripts/lint-ui.mjs src\`
- \`node ${rel}/scripts/check-ui.mjs http://localhost:3000/rota --out=prints\` e abra os prints.
`;

if (!project) {
  // Usuário: cada agente na sua pasta de skills. ~/.agents/skills é a pasta comum (Codex, Copilot, Cursor e Gemini também leem).
  const targets = [
    ['agents', path.join(home, '.agents', 'skills'), null],
    ['claude', path.join(home, '.claude', 'skills'), path.join(home, '.claude')],
    ['codex', path.join(home, '.codex', 'skills'), path.join(home, '.codex')],
    ['copilot', path.join(home, '.copilot', 'skills'), path.join(home, '.copilot')],
    ['cursor', path.join(home, '.cursor', 'skills'), path.join(home, '.cursor')],
    ['gemini', path.join(home, '.gemini', 'skills'), path.join(home, '.gemini')],
  ];
  let n = 0;
  for (const [key, dir, marker] of targets) {
    if (!want(key)) continue;
    // Só instala em agente que existe na máquina (pasta de configuração presente), a não ser que peça com --only.
    if (marker && !only && !fs.existsSync(marker)) { console.log(`${'pulado'.padEnd(10)} ${key} (não encontrado em ${marker})`); continue; }
    place(dir); n++;
  }
  if (want('windsurf') && only?.includes('windsurf')) console.log('Windsurf não tem pasta de skills do usuário: use --project para escrever .windsurf/rules.');
  console.log(`\n${n} destino(s). Reinicie o agente para ele encontrar a skill.`);
} else {
  const root = path.resolve(project);
  if (!fs.existsSync(root)) { console.error(`Pasta não existe: ${root}`); process.exit(1); }
  // Uma cópia só, na pasta comum do padrão Agent Skills; os outros agentes recebem link ou regra apontando para ela.
  const rel = `.agents/skills/${NAME}`;
  place(path.join(root, '.agents', 'skills'), { forceCopy: true });
  // Claude Code só lê .claude/skills. Copilot lê .claude/skills e .agents/skills: para não aparecer duas vezes,
  // a segunda cópia só vai quando o projeto já usa Claude Code (tem .claude) ou quando pedida com --only=claude.
  if (only?.includes('claude') || (want('claude') && fs.existsSync(path.join(root, '.claude')))) place(path.join(root, '.claude', 'skills'), { forceCopy: true });
  if (want('codex') || want('agents')) upsertBlock(path.join(root, 'AGENTS.md'), pointer(rel));
  if (want('copilot')) write(path.join(root, '.github', 'instructions', `${NAME}.instructions.md`), `---\napplyTo: "${UI_GLOBS}"\ndescription: ${JSON.stringify(description)}\n---\n\n${pointer(rel)}`);
  if (want('cursor')) write(path.join(root, '.cursor', 'rules', `${NAME}.mdc`), `---\ndescription: ${JSON.stringify(description)}\nglobs: ${UI_GLOBS}\nalwaysApply: false\n---\n\n${pointer(rel)}`);
  if (want('gemini')) upsertBlock(path.join(root, 'GEMINI.md'), pointer(rel));
  if (want('windsurf')) write(path.join(root, '.windsurf', 'rules', `${NAME}.md`), `---\ntrigger: glob\nglobs: ${UI_GLOBS}\ndescription: ${JSON.stringify(description)}\n---\n\n${pointer(rel)}`);
  console.log(`\nPronto. Faça commit de ${rel} e dos arquivos de regra para o time todo usar.`);
}
