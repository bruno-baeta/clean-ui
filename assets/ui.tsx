'use client';
/**
 * Componentes base (React + Tailwind v4 + lucide-react), já seguindo as regras da skill.
 * Copie para o projeto e ajuste: troque <a> por <Link> do framework se quiser navegação client-side.
 * No Next, os componentes sem estado podem ir para um arquivo sem 'use client'.
 * Depende de assets/tokens.css (cores bg-card, bg-muted, text-primary...).
 */
import { useEffect, useId, useRef, useState, useSyncExternalStore, type ComponentProps, type ReactNode, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronRight, Info, Monitor, Moon, Sun } from 'lucide-react';

/**
 * Hora atual que anda sozinha (contagens regressivas, "há 2 min"), sem setState em efeito e sem diferença de hidratação:
 * null no servidor e na hidratação; no navegador, o instante arredondado para `stepMs` (muda sozinho a cada passo).
 */
export function useNow(stepMs = 60000) {
  return useSyncExternalStore(
    (cb) => { const t = setInterval(cb, stepMs); return () => clearInterval(t); },
    () => Math.floor(Date.now() / stepMs) * stepMs,
    () => null,
  );
}

export const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');

// ---------------------------------------------------------------------------
// Superfícies
// ---------------------------------------------------------------------------

/** Cartão: fundo um degrau acima, borda neutra, cantos grandes. overflow-hidden faz o hover das linhas seguir os cantos. */
export function Card({ className, ...p }: ComponentProps<'div'>) {
  return <div className={cn('min-w-0 overflow-hidden rounded-2xl bg-card ring-1 ring-border/70', className)} {...p} />;
}

/** Seção: título SEMPRE fora do cartão, ação (pílula) à direita, "i" opcional ao lado do título. */
export function Section({ title, info, action, children, className }: { title: string; info?: ReactNode; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn('mt-5 flex flex-col', className)} aria-label={title}>
      <div className="mb-2.5 flex min-h-9 items-center justify-between gap-2 px-0.5">
        <h2 className="flex items-center gap-1 text-base font-semibold">{title}{info && <InfoTip label={`Sobre ${title}`}>{info}</InfoTip>}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

/** Página que ocupa a altura toda: o último filho com flex-1 estica até o fim da tela. */
export function FillPage({ children }: { children: ReactNode }) {
  return <div className="flex min-h-[calc(100dvh-4rem)] flex-1 flex-col">{children}</div>;
}

/** Grid simétrico: colunas iguais, cartões da mesma altura. Use filhos com className="h-full". */
export function EqualGrid({ cols = 'lg:grid-cols-2', className, ...p }: ComponentProps<'div'> & { cols?: string }) {
  return <div className={cn('grid items-stretch gap-3', cols, className)} {...p} />;
}

// ---------------------------------------------------------------------------
// Ícones, chips, botões
// ---------------------------------------------------------------------------

type Tone = 'primary' | 'negative' | 'muted' | 'info';
const TONE: Record<Tone, string> = {
  primary: 'bg-primary/14 text-primary',
  negative: 'bg-negative/12 text-negative',
  muted: 'bg-muted text-muted-foreground',
  info: 'bg-info/12 text-info',
};

/** Todo ícone de conteúdo mora num container. Mesmo tamanho em toda a linha. */
export function IconBox({ children, tone = 'primary', size = 'md', className }: { children: ReactNode; tone?: Tone; size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const s = size === 'sm' ? 'size-7 rounded-lg [&>svg]:size-3.5' : size === 'lg' ? 'size-11 rounded-2xl [&>svg]:size-5' : 'size-9 rounded-xl [&>svg]:size-[18px]';
  return <span className={cn('grid shrink-0 place-items-center', s, TONE[tone], className)} aria-hidden="true">{children}</span>;
}

/** Chip de status: pequeno, com fundo, nunca com borda colorida. */
export function Chip({ tone = 'muted', className, ...p }: ComponentProps<'span'> & { tone?: Tone }) {
  return <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap [&>svg]:size-3.5', TONE[tone], className)} {...p} />;
}

/** Pílula: toda ação pequena ou link ("Todas", "Voltar") é uma pílula com fundo, nunca texto solto. */
export const PILL = 'inline-flex min-h-9 items-center justify-center gap-1 rounded-full bg-muted px-3.5 text-xs font-medium text-foreground hover:bg-accent cursor-pointer [&>svg]:size-3.5 [&>svg]:shrink-0';
export function Pill({ className, ...p }: ComponentProps<'a'>) {
  return <a className={cn(PILL, className)} {...p} />;
}

const BTN = {
  primary: 'bg-primary text-primary-foreground hover:opacity-90',
  soft: 'bg-muted hover:bg-accent',
  danger: 'bg-critical text-critical-foreground hover:opacity-90',
};
export function Button({ variant = 'primary', className, ...p }: ComponentProps<'button'> & { variant?: keyof typeof BTN }) {
  return <button className={cn('inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold disabled:opacity-50 [&>svg]:size-4', BTN[variant], className)} {...p} />;
}

/** Barra de ações fixa no rodapé (mobile); no web volta ao fluxo normal. */
export function BottomActions({ children }: { children: ReactNode }) {
  return (
    <div className="pb-safe fixed inset-x-0 bottom-0 z-40 bg-background/95 px-4 pt-3 backdrop-blur sm:static sm:mt-5 sm:bg-transparent sm:p-0">
      <div className="grid auto-cols-fr grid-flow-col gap-2 pb-3 sm:flex sm:pb-0">{children}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Linhas de lista e indicadores
// ---------------------------------------------------------------------------

/**
 * Linha padrão: [ícone] [rótulo pequeno / valor] [coluna direita: chip em cima, valor embaixo] [chevron].
 * Hover só muda o fundo. Nada de "…": o texto quebra linha.
 */
export function ListRow({ icon, label, value, chip, right, href, onClick }: { icon: ReactNode; label: ReactNode; value: ReactNode; chip?: ReactNode; right?: ReactNode; href?: string; onClick?: () => void }) {
  const body = (
    <>
      <IconBox>{icon}</IconBox>
      <span className="min-w-0 flex-1">
        <span className="block text-xs text-muted-foreground">{label}</span>
        <span className="block text-base font-semibold break-words">{value}</span>
      </span>
      {(chip || right) && (
        <span className="flex shrink-0 flex-col items-end gap-1 text-right">
          {chip}
          {right && <span className="text-sm font-semibold tabular">{right}</span>}
        </span>
      )}
      {(href || onClick) && <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />}
    </>
  );
  const cls = 'flex min-h-16 w-full items-center gap-3 px-4 py-2.5 text-left sm:px-5';
  if (href) return <li><a href={href} className={cn(cls, 'hover:bg-accent/40')}>{body}</a></li>;
  if (onClick) return <li><button type="button" onClick={onClick} className={cn(cls, 'hover:bg-accent/40')}>{body}</button></li>;
  return <li><div className={cls}>{body}</div></li>;
}

/** Lista dentro de um cartão, separada por divisórias (nunca cartões dentro do cartão). */
export function ListCard({ children, className }: { children: ReactNode; className?: string }) {
  return <Card className={className}><ul className="divide-y divide-border/70">{children}</ul></Card>;
}

/** Indicador: ícone em container, rótulo pequeno, valor. Lado a lado, todos com o mesmo tamanho de fonte. */
export function StatCard({ icon, label, value, tone = 'primary', className }: { icon: ReactNode; label: string; value: ReactNode; tone?: Tone; className?: string }) {
  return (
    <Card className={cn('flex h-full items-center gap-3 p-4', className)}>
      <IconBox tone={tone}>{icon}</IconBox>
      <span className="min-w-0">
        <span className="block text-xs text-muted-foreground">{label}</span>
        <span className="block text-base font-semibold tabular">{value}</span>
      </span>
    </Card>
  );
}

/** Data em blocos: dia grande, dia da semana e mês pequenos, com maiúscula. */
export function DateBlock({ date, className }: { date: Date; className?: string }) {
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).replace('.', '');
  const wd = cap(date.toLocaleDateString('pt-BR', { weekday: 'short' }));
  const mo = cap(date.toLocaleDateString('pt-BR', { month: 'short' }));
  return (
    <span className={cn('grid w-12 shrink-0 place-items-center rounded-xl bg-muted py-1.5 leading-none', className)}>
      <span className="text-[10px] text-muted-foreground">{wd}</span>
      <span className="my-0.5 text-lg font-semibold tabular">{date.getDate()}</span>
      <span className="text-[10px] text-muted-foreground">{mo}</span>
    </span>
  );
}

/** Estado vazio que preenche o espaço restante (tela nunca fica com metade vazia). */
export function FillEmpty({ icon, title, sub }: { icon: ReactNode; title: string; sub?: string }) {
  return (
    <Card className="flex flex-1 flex-col items-center justify-center gap-1.5 px-6 py-8 text-center">
      <IconBox size="lg">{icon}</IconBox>
      <div className="text-sm font-medium">{title}</div>
      {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Explicação sob demanda
// ---------------------------------------------------------------------------

/** Ícone "i": toda explicação mora aqui, não em texto fixo na tela. Abre no toque, fecha com Esc ou toque fora. */
export function InfoTip({ children, label = 'Mais informações' }: { children: ReactNode; label?: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const btn = useRef<HTMLButtonElement>(null);
  const tip = useRef<HTMLSpanElement>(null);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);

  // Balão fora da árvore (portal) e com posição fixa: nunca é cortado por overflow-hidden
  // e sempre fica dentro da janela (8 px de margem); abre para cima quando falta espaço embaixo.
  useLayoutEffect(() => {
    if (!open) { setPos(null); return; }
    const place = () => {
      const b = btn.current?.getBoundingClientRect();
      const t = tip.current;
      if (!b || !t) return;
      const M = 8;
      const vw = document.documentElement.clientWidth;
      const vh = window.innerHeight;
      const w = t.offsetWidth;
      const h = t.offsetHeight;
      const left = Math.min(Math.max(M, b.left), vw - w - M);
      const below = b.bottom + 4;
      const top = below + h + M <= vh ? below : Math.max(M, b.top - h - 4);
      setPos({ left, top });
    };
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => { window.removeEventListener('resize', place); window.removeEventListener('scroll', place, true); };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const close = (e: Event) => {
      if (e instanceof KeyboardEvent) { if (e.key === 'Escape') setOpen(false); return; }
      const n = e.target as Node;
      if (!btn.current?.contains(n) && !tip.current?.contains(n)) setOpen(false);
    };
    document.addEventListener('keydown', close);
    document.addEventListener('pointerdown', close);
    return () => { document.removeEventListener('keydown', close); document.removeEventListener('pointerdown', close); };
  }, [open]);

  return (
    <span className="relative inline-flex">
      <button ref={btn} type="button" aria-label={label} aria-expanded={open} aria-describedby={open ? id : undefined} onClick={() => setOpen((o) => !o)}
        className="grid size-8 scroll-mb-24 place-items-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground lg:scroll-mb-0">
        <Info className="size-4" aria-hidden="true" />
      </button>
      {open && createPortal(
        <span
          ref={tip}
          role="tooltip"
          id={id}
          style={pos ? { left: pos.left, top: pos.top } : { left: 0, top: 0, visibility: 'hidden' }}
          className="fixed z-[100] w-[min(18rem,calc(100vw-1rem))] rounded-xl bg-card p-3 text-left text-xs leading-relaxed font-normal normal-case tracking-normal text-foreground shadow-xl ring-1 ring-border animate-in"
        >
          {children}
        </span>,
        document.body,
      )}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Carregando: resposta imediata a todo toque que troca de tela
// ---------------------------------------------------------------------------

let loading = false;
const listeners = new Set<() => void>();
/** Chame antes de qualquer navegação programática (router.push etc.). */
export const setLoading = (v: boolean) => { if (loading !== v) { loading = v; listeners.forEach((l) => l()); } };

/**
 * Coloque uma vez no layout. Liga a tela de carregando no clique de qualquer link interno
 * e desliga quando `routeKey` (ex.: pathname + search) muda. Nunca fica preso: 20 s de limite.
 */
export function NavLoading({ routeKey }: { routeKey: string }) {
  const active = useSyncExternalStore((l) => { listeners.add(l); return () => { listeners.delete(l); }; }, () => loading, () => false);
  useEffect(() => setLoading(false), [routeKey]);
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest?.('a[href]') as HTMLAnchorElement | null;
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
      const to = new URL(a.href, location.href);
      if (to.origin !== location.origin || (to.pathname === location.pathname && to.search === location.search)) return;
      setLoading(true);
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);
  useEffect(() => { if (!active) return; const t = setTimeout(() => setLoading(false), 20000); return () => clearTimeout(t); }, [active]);
  return active ? <Spinner overlay /> : null;
}

/** Fundo do tema com anel na cor de destaque. Use também como tela de carregando de cada rota (loading.tsx). */
export function Spinner({ overlay }: { overlay?: boolean }) {
  return (
    <div role="status" aria-label="Carregando" className={overlay ? 'fixed inset-0 z-[60] grid place-items-center bg-background/85 backdrop-blur-sm animate-in' : 'grid flex-1 place-items-center py-24'}>
      <svg viewBox="0 0 56 56" className="size-14 animate-spin" aria-hidden="true">
        <circle cx="28" cy="28" r="24" fill="none" stroke="var(--primary)" strokeOpacity={0.15} strokeWidth={4} />
        <circle cx="28" cy="28" r="24" fill="none" stroke="var(--primary)" strokeWidth={4} strokeLinecap="round" strokeDasharray="38 151" />
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tema: sempre claro e escuro, seguindo o sistema, com troca manual
// ---------------------------------------------------------------------------

type ThemeChoice = 'sistema' | 'claro' | 'escuro';
const THEME_KEY = 'tema';
const readChoice = (): ThemeChoice => {
  try { const v = localStorage.getItem(THEME_KEY); return v === 'claro' || v === 'escuro' ? v : 'sistema'; } catch { return 'sistema'; }
};
const applyTheme = (choice: ThemeChoice) => {
  const dark = choice === 'escuro' || (choice === 'sistema' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', dark);
  document.documentElement.classList.toggle('light', !dark);
};

/**
 * Troca de tema em três pílulas com ícone (Sistema, Claro, Escuro). Coloque no cabeçalho.
 * Use junto com o <script> do <head> descrito em tokens.css para não piscar o tema errado.
 */
/**
 * compact: um botão só que alterna Sistema, Claro e Escuro (cabeçalho do celular).
 * className vai num invólucro: para mostrar só um por tamanho, use
 *   <ThemeToggle compact className="lg:hidden" />  e  <ThemeToggle className="hidden lg:block" />
 */
export function ThemeToggle({ className, compact }: { className?: string; compact?: boolean }) {
  const [choice, setChoice] = useState<ThemeChoice>('sistema');
  useEffect(() => setChoice(readChoice()), []);
  useEffect(() => {
    applyTheme(choice);
    if (choice !== 'sistema') return;
    const mq = matchMedia('(prefers-color-scheme: dark)');
    const on = () => applyTheme('sistema');
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [choice]);
  const pick = (c: ThemeChoice) => {
    setChoice(c);
    try { c === 'sistema' ? localStorage.removeItem(THEME_KEY) : localStorage.setItem(THEME_KEY, c); } catch {}
  };
  const opts: { key: ThemeChoice; label: string; icon: ReactNode }[] = [
    { key: 'sistema', label: 'Tema do sistema', icon: <Monitor /> },
    { key: 'claro', label: 'Tema claro', icon: <Sun /> },
    { key: 'escuro', label: 'Tema escuro', icon: <Moon /> },
  ];
  if (compact) {
    const i = opts.findIndex((o) => o.key === choice);
    const next = opts[(i + 1) % opts.length];
    return (
      <span className={className}>
        <button type="button" aria-label={`${opts[i].label}. Trocar para ${next.label.toLowerCase()}`} title={opts[i].label} onClick={() => pick(next.key)}
          className="grid size-10 place-items-center rounded-full bg-card text-muted-foreground ring-1 ring-border/70 hover:bg-accent [&>svg]:size-[18px]">
          {opts[i].icon}
        </button>
      </span>
    );
  }
  return (
    <span className={className}>
    <div role="group" aria-label="Tema" className="inline-grid grid-cols-3 gap-1 rounded-full bg-card p-1 ring-1 ring-border/70">
      {opts.map((o) => (
        <button key={o.key} type="button" aria-label={o.label} aria-pressed={choice === o.key} title={o.label} onClick={() => pick(o.key)}
          className={cn('grid size-8 place-items-center rounded-full [&>svg]:size-4', choice === o.key ? 'bg-primary/14 text-primary' : 'text-muted-foreground hover:bg-accent')}>
          {o.icon}
        </button>
      ))}
    </div>
    </span>
  );
}

// ---------------------------------------------------------------------------
// Cabe na tela: limita a altura de mapas, gráficos e imagens grandes pela janela
// ---------------------------------------------------------------------------

/**
 * Container que nunca passa da borda de baixo da janela.
 * Na primeira tela (começa nos 60% de cima): altura = espaço que sobra até o fim da janela, menos `gap` (inclua no gap o que vem
 * abaixo dele dentro do cartão, como legenda e padding, mais o respiro até a borda).
 * Abaixo da primeira tela: nunca mais alto que a janela (nem que `max`).
 * `aspect` (largura / altura, ex.: 2 para um mapa mundi): usa a altura natural pela largura, mas corta
 * pela janela; assim o mapa não sobra vazio no celular nem estoura no notebook.
 * `fill`: ocupa todo o espaço disponível (bom para gráficos). Sem `fill` nem `aspect`, só limita (max-height).
 * Cartões lado a lado: só UM define a altura da linha (ex.: o mapa com `aspect`). O vizinho só acompanha,
 * posicionado de forma absoluta para não empurrar a linha (gráficos responsivos medem o pai e nunca encolhem):
 *   <Card className="relative ..."><FitScreen fill className="lg:absolute lg:inset-x-4 lg:top-4 lg:bottom-2 lg:h-auto! lg:w-auto">
 * Dentro, use visuais que se ajustam às duas dimensões: <svg className="size-full"> (preserveAspectRatio meet é o padrão),
 * <ResponsiveContainer width="100%" height="100%">, <img className="size-full object-contain">.
 */
export function FitScreen({ children, className, gap = 16, min = 160, max = Infinity, aspect, fill = false }: { children: ReactNode; className?: string; gap?: number; min?: number; max?: number; aspect?: number; fill?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [h, setH] = useState<number>();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const calc = () => {
      const top = el.getBoundingClientRect().top + window.scrollY;
      const vh = window.innerHeight;
      // Só blocos que começam nos 60% de cima pertencem à primeira tela e são espremidos até a borda;
      // os que começam perto do rodapé seguem rolando com a altura normal (nunca mais altos que a janela).
      let v = top < vh * 0.6 ? vh - top - gap : vh - 2 * gap;
      if (aspect) v = Math.min(v, el.clientWidth / aspect);
      setH(Math.round(Math.max(min, Math.min(max, v))));
    };
    // Recalcula quando qualquer coisa acima muda de tamanho (fonte carregando, dados chegando, quebra de linha).
    calc();
    const raf = requestAnimationFrame(calc);
    document.fonts?.ready.then(calc);
    window.addEventListener('resize', calc);
    window.addEventListener('load', calc);
    const ro = new ResizeObserver(calc);
    ro.observe(document.body);
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) ro.observe(p);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', calc); window.removeEventListener('load', calc); ro.disconnect(); };
  }, [gap, min, max, aspect]);
  return <div ref={ref} className={cn('relative min-h-0 w-full', className)} style={fill || aspect ? { height: h } : { maxHeight: h }}>{children}</div>;
}
