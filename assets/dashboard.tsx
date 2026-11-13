/**
 * Kit de dashboard com o acabamento das referências do usuário (references/exemplos-dashboards; medidas em
 * references/anatomia-dashboard.md). Cada peça diz de qual foto vem. Tailwind v4 + lucide-react + tokens.css.
 *
 * Regras que o kit já cumpre: cartão de 20 px sem contorno e padding de 24 px; título do cartão em cinza, peso médio;
 * número grande em peso médio; chip de variação de canto pequeno (6 px), verde ou vermelho suave e sempre com seta;
 * linhas tracejadas como separador; ícone em círculo tingido no canto direito; nada de cartão colorido de destaque.
 *
 * O comportamento (animação, páginas pela altura, filtro ligado, balão) é o valor do kit. O visual (raio, padding, tamanhos,
 * tracejado, círculo) é o de partida: ajuste para a direção visual do projeto, igual em todas as peças.
 */
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from 'react';
import { ArrowDownRight, ArrowUpRight, ChevronLeft, ChevronRight, Minus } from 'lucide-react';
import { InfoTip, cn } from './ui';

// ---------------------------------------------------------------------------
// Cartão (Skymetrics, Spectra): título cinza em cima à esquerda, ação ou ícone à direita
// ---------------------------------------------------------------------------

export function DashCard({ title, sub, info, action, icon, aside, children, className, bodyClassName }: {
  /** Título curto, sentence case. */ title: string;
  /** Uma frase de DADO logo abaixo do título (ex.: "Leituras subiram 7% na semana"). Nunca explicação. */ sub?: ReactNode;
  info?: ReactNode;
  /** Abas, seletor de período, botão "Ver todos". */ action?: ReactNode;
  /** Ícone em círculo tingido no canto direito (quando não há ação). */ icon?: ReactNode;
  /** Números das séries à direita, na altura do título + frase (Skymetrics "Sales & Returns"). Use SeriesStat. */ aside?: ReactNode;
  children: ReactNode; className?: string; bodyClassName?: string;
}) {
  return (
    <section aria-label={title} className={cn('flex min-h-0 min-w-0 flex-col rounded-[20px] bg-card p-4', className)}>
      <div className="flex shrink-0 flex-wrap items-start justify-between gap-x-8 gap-y-4">
        <div className="min-w-0 flex-1">
          <header className="flex flex-wrap items-center gap-x-2 gap-y-2">
            <h2 className="text-[15px] font-medium text-muted-foreground">{title}</h2>
            {info && <span className="-ml-1 [&_button]:size-7"><InfoTip label={`Sobre ${title}`}>{info}</InfoTip></span>}
            {action ? <div className="ml-auto">{action}</div> : icon ? <IconCircle className="ml-auto">{icon}</IconCircle> : null}
          </header>
          {sub && <p className="mt-2 text-sm text-foreground">{sub}</p>}
        </div>
        {aside && <div className="flex flex-wrap gap-x-8 gap-y-3">{aside}</div>}
      </div>
      {/* lg:flex-1: no celular o corpo respeita a altura que você der (ex.: h-64 para gráfico); flex-1 sem lg: zera gráfico absoluto. */}
      <div className={cn('mt-3 min-h-0 lg:flex-1', bodyClassName)}>{children}</div>
    </section>
  );
}

/** Ícone em círculo tingido (NiceDash). tone muda a cor do fundo. */
export function IconCircle({ children, tone = 'primary', className }: { children: ReactNode; tone?: Tone; className?: string }) {
  return <span className={cn('grid size-9 shrink-0 place-items-center rounded-full [&>svg]:size-[18px]', TONE[tone], className)} aria-hidden="true">{children}</span>;
}

// ---------------------------------------------------------------------------
// Indicador (Skymetrics + NiceDash + Acquire)
//   Rótulo cinza ............................ (ícone)
//   Número grande
//   [↗ 12%]  Vs semana anterior
// ---------------------------------------------------------------------------

export function Kpi({ label, value, icon, iconTone, delta, caption, info, className }: {
  label: string; value: ReactNode; icon?: ReactNode; /** Tom do círculo do ícone (crítico só para estado ruim de verdade). */ iconTone?: Tone;
  /** Variação em fração (0,12 = +12%). invert: subir é ruim (ex.: erros). */ delta?: { value: number; invert?: boolean } | null;
  /** Texto apagado ao lado do chip ("Vs semana anterior") ou sozinho quando não há variação. */ caption?: ReactNode;
  info?: ReactNode; className?: string;
}) {
  return (
    <section aria-label={label} className={cn('flex min-w-0 flex-col rounded-[20px] bg-card p-4', className)}>
      <div className="flex items-center gap-2">
        <span className="min-w-0 text-[15px] font-medium text-muted-foreground">{label}</span>
        {info && <span className="-my-2 -ml-1 [&_button]:size-7"><InfoTip label={`Sobre ${label}`}>{info}</InfoTip></span>}
        {icon && <IconCircle tone={iconTone} className="-my-1.5 ml-auto">{icon}</IconCircle>}
      </div>
      <div className="mt-1 text-4xl leading-[1.1] font-semibold tracking-tight tabular">{value}</div>
      <div className="mt-2 flex min-h-6 flex-wrap items-center gap-x-2 gap-y-1">
        {delta && <DeltaChip value={delta.value} invert={delta.invert} />}
        {caption && <span className="text-[13px] text-muted-foreground">{caption}</span>}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Chips
// ---------------------------------------------------------------------------

export type Tone = 'neutral' | 'primary' | 'positive' | 'warning' | 'critical';
const TONE: Record<Tone, string> = {
  neutral: 'bg-muted text-muted-foreground',
  primary: 'bg-primary/12 text-primary',
  positive: 'bg-positive/12 text-positive',
  warning: 'bg-warning/14 text-warning',
  critical: 'bg-critical/12 text-critical',
};

const pctFmt = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });
const pctFmt1 = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 });
export const fmtPct = (frac: number) => `${Math.abs(frac) < 0.1 ? pctFmt1.format(Math.abs(frac) * 100) : pctFmt.format(Math.abs(frac) * 100)}%`;

/** Variação (Skymetrics "+38%"): canto de 6 px, verde suave para melhor, vermelho suave para pior, seta sempre. */
export function DeltaChip({ value, invert, className }: { value: number; invert?: boolean; className?: string }) {
  const flat = Math.abs(value) < 0.005;
  const good = invert ? value < 0 : value > 0;
  const tone: Tone = flat ? 'neutral' : good ? 'positive' : 'critical';
  return (
    <span className={cn('inline-flex h-6 items-center gap-0.5 rounded-md px-1.5 text-xs font-semibold whitespace-nowrap tabular [&>svg]:size-3.5', TONE[tone], className)}>
      {flat ? <Minus /> : value > 0 ? <ArrowUpRight /> : <ArrowDownRight />}
      {fmtPct(value)}
    </span>
  );
}

/** Status de uma linha (Moveon "Delivered", "In Transit"): canto de 6 px, fundo suave, sem borda. */
export function StatusChip({ tone = 'neutral', icon, children, className }: { tone?: Tone; icon?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex h-6 items-center gap-1 rounded-md px-2 text-xs font-medium whitespace-nowrap [&>svg]:size-3.5', TONE[tone], className)}>
      {icon}{children}
    </span>
  );
}

/** Seta pequena num círculo ao lado de um número de tabela (Skymetrics "129 ↓"). */
export function TrendDot({ up, invert }: { up: boolean; invert?: boolean }) {
  const good = invert ? !up : up;
  return (
    <span className={cn('inline-grid size-5 place-items-center rounded-full [&>svg]:size-3', good ? TONE.positive : TONE.critical)} aria-label={up ? 'Subiu' : 'Caiu'}>
      {up ? <ArrowUpRight /> : <ArrowDownRight />}
    </span>
  );
}

/** Contagem ao lado de um título (Moveon "Orders 264"). */
export function CountBadge({ children }: { children: ReactNode }) {
  return <span className="inline-flex h-5 items-center rounded-md px-1.5 text-xs font-medium text-muted-foreground tabular ring-1 ring-border">{children}</span>;
}

// ---------------------------------------------------------------------------
// Abas com contagem (Moveon "Pending 70 | Responded 85 | Assigned 53")
// ---------------------------------------------------------------------------

export function Tabs<T extends string>({ label, value, options, onChange, className }: {
  label: string; value: T; options: { key: T; label: string; count?: number }[]; onChange: (v: T) => void; className?: string;
}) {
  return (
    <div role="tablist" aria-label={label} className={cn('inline-flex gap-0.5 rounded-xl bg-muted p-1', className)}>
      {options.map((o) => {
        const on = o.key === value;
        return (
          <button
            key={o.key}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => onChange(o.key)}
            className={cn('inline-flex h-8 items-center justify-center gap-1.5 rounded-lg px-3 text-[13px] whitespace-nowrap', on ? 'bg-card font-medium text-foreground shadow-sm' : 'text-muted-foreground hover:bg-accent')}
          >
            {o.label}
            {o.count !== undefined && <span className="text-muted-foreground tabular">{o.count.toLocaleString('pt-BR')}</span>}
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Números no topo de um gráfico (Skymetrics "● Total sales / 4,782 [+7%]")
// ---------------------------------------------------------------------------

export function SeriesStat({ color, label, value, delta, onClick, selected }: {
  color?: string; label: string; value: ReactNode; delta?: { value: number; invert?: boolean } | null;
  /** Filtro ligado: tocar na série filtra a tela. */ onClick?: () => void; selected?: boolean;
}) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag type={onClick ? 'button' : undefined} onClick={onClick} aria-pressed={onClick ? !!selected : undefined}
      className={cn('min-w-0 text-left', onClick && '-m-2 rounded-xl p-2 hover:bg-accent', selected && 'bg-primary/10')}>
      <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
        {color && <span className="size-2 rounded-full" style={{ background: color }} />}
        {label}
      </div>
      <div className="mt-1 flex items-center gap-2">
        <span className="text-[26px] leading-none font-medium tracking-tight tabular">{value}</span>
        {delta && <DeltaChip value={delta.value} invert={delta.invert} />}
      </div>
    </Tag>
  );
}

/** Colunas de rótulo cinza + valor (Skymetrics "Marketing Spend / €11,596"). */
export function StatColumns({ items, className }: { items: { label: string; value: ReactNode }[]; className?: string }) {
  return (
    <div className={cn('grid gap-x-6 gap-y-3', className)} style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
      {items.map((it) => (
        <div key={it.label} className="min-w-0">
          <div className="text-[13px] text-muted-foreground">{it.label}</div>
          <div className="mt-0.5 text-sm font-medium tabular">{it.value}</div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Separadores e linhas de rodapé
// ---------------------------------------------------------------------------

export const Dashed = ({ className }: { className?: string }) => <div className={cn('border-t border-dashed border-border', className)} aria-hidden="true" />;

/** Rodapé "Total de sessões ······· 4.182" (Skymetrics; leader=true pontilha como no Delivery). */
export function KeyValue({ label, value, leader, className }: { label: ReactNode; value: ReactNode; leader?: boolean; className?: string }) {
  return (
    <div className={cn('flex items-baseline gap-2 text-sm', className)}>
      <span className="text-muted-foreground">{label}</span>
      <span className={cn('min-w-4 flex-1', leader && 'border-b border-dotted border-border')} />
      <span className="font-medium tabular">{value}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Partes de um todo (Skymetrics "Traffic Sources")
// ---------------------------------------------------------------------------

/** Barra empilhada grossa (8 px), pílulas separadas por 4 px. */
export function StackedBar({ parts, className }: { parts: { label: string; value: number; color: string }[]; className?: string }) {
  const total = parts.reduce((s, p) => s + p.value, 0) || 1;
  return (
    <div className={cn('flex h-2 gap-1', className)} aria-hidden="true">
      {parts.filter((p) => p.value > 0).map((p) => (
        <span key={p.label} className="h-full min-w-2 rounded-full" style={{ flexGrow: p.value / total, flexBasis: 0, background: p.color }} />
      ))}
    </div>
  );
}

/** Legenda em colunas: bolinha + nome cinza + valor escuro alinhado. Clicável se onPick vier. */
export function LegendGrid({ items, cols = 2, onPick, selected, className }: {
  items: { label: string; value: ReactNode; color: string }[]; cols?: 1 | 2 | 3; onPick?: (label: string) => void; selected?: string | null; className?: string;
}) {
  return (
    <div className={cn('grid gap-x-8', cols === 1 ? 'grid-cols-1' : cols === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-3', className)}>
      {items.map((it) => {
        const inner = (
          <>
            <span className="size-2 shrink-0 rounded-full" style={{ background: it.color }} />
            <span className="min-w-0 flex-1 text-sm text-muted-foreground break-words">{it.label}</span>
            <span className="text-sm font-medium tabular">{it.value}</span>
          </>
        );
        return onPick ? (
          <button key={it.label} type="button" onClick={() => onPick(it.label)} className={cn('-mx-2 flex min-h-9 items-center gap-2 rounded-lg px-2 text-left hover:bg-accent', selected === it.label && 'bg-primary/10')}>{inner}</button>
        ) : (
          <div key={it.label} className="flex min-h-9 items-center gap-2">{inner}</div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Medidor (Skymetrics "Sessions", Delivery "AI Score")
// ---------------------------------------------------------------------------

/**
 * Meia-lua de traço grosso (12) com pontas redondas, resto em cinza, número no centro.
 * Tamanho limitado (max-w-56 e número de 28 px) para não virar desenho gigante no 21:9.
 */
export function Gauge({ value, center, caption, color = 'var(--primary)', className }: { value: number; center: ReactNode; caption?: ReactNode; color?: string; className?: string }) {
  const C = Math.PI * 80;
  const frac = Math.min(1, Math.max(0, value));
  return (
    <div className={cn('relative mx-auto aspect-[2/1.08] w-full max-w-56', className)}>
      <svg viewBox="0 0 200 108" className="absolute inset-0 size-full" aria-hidden="true">
        <path d="M20,100 A80,80 0 0 1 180,100" fill="none" stroke="var(--muted)" strokeWidth={12} strokeLinecap="round" />
        {frac > 0 && <path d="M20,100 A80,80 0 0 1 180,100" fill="none" stroke={color} strokeWidth={12} strokeLinecap="round" strokeDasharray={`${frac * C} ${C}`} />}
      </svg>
      <div className="absolute inset-x-0 bottom-0 text-center">
        <div className="text-[28px] leading-none font-medium tracking-tight tabular">{center}</div>
        {caption && <div className="mt-1 text-[13px] text-muted-foreground">{caption}</div>}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tabela (Skymetrics "Sales by Region", Moveon "Orders", Spectra "Invoices")
// ---------------------------------------------------------------------------

/**
 * Use as classes abaixo numa grade com as mesmas colunas no cabeçalho e nas linhas.
 *   <div className={cn(TH, 'grid-cols-[...]')}>...</div>
 *   <button className={cn(TR, 'grid-cols-[...]')}>...</button>
 * Primeira coluna escura e média; números à direita e tabulares; status com StatusChip; variação com TrendDot.
 * Linha nunca mais larga que ~900 px: em tela larga, divida em duas colunas de tabela ou dê mais colunas de dado.
 */
export const TH = 'grid items-center gap-4 pb-2 text-[13px] text-muted-foreground';
export const TR = 'grid min-h-12 w-full items-center gap-4 border-t border-dashed border-border py-2 text-left text-sm hover:bg-accent/50 active:bg-accent';

// ---------------------------------------------------------------------------
// Gráficos (Recharts): balão do hover e rótulo em pílula
// ---------------------------------------------------------------------------

/** Balão do hover (Skymetrics "14 March 2:39 PM / 4,782 sales"). Use com <Tooltip isAnimationActive={false} content={...} />. */
export function TooltipCard({ title, value, sub }: { title: ReactNode; value: ReactNode; sub?: ReactNode }) {
  return (
    <div className="rounded-xl bg-card px-3 py-2 text-[13px] shadow-lg ring-1 ring-border">
      <div className="text-muted-foreground">{title}</div>
      <div className="font-medium tabular">{value}</div>
      {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}

/**
 * Etiqueta escura em pílula sobre a barra/ponto destacado (Spectra). Não anima: aparece direto na posição final.
 * Desenhe com ReferenceDot depois da <Bar> (não com LabelList, que espera a animação das barras ou anda junto):
 *   {marked && <ReferenceDot x={marked.n} y={marked.v} ifOverflow="visible"
 *     shape={(p: { cx?: number; cy?: number }) => <PillMark cx={p.cx ?? 0} cy={p.cy ?? 0} text={fmt(marked.v)} />} />}
 * Com uma barra selecionada, a etiqueta vai para ela (marked = selecionada ?? item atual).
 */
export function PillMark({ cx = 0, cy = 0, text }: { cx?: number; cy?: number; text: string }) {
  const w = text.length * 6.6 + 16;
  return (
    <g pointerEvents="none">
      <rect x={cx - w / 2} y={cy - 30} width={w} height={22} rx={11} fill="var(--foreground)" />
      <text x={cx} y={cy - 15} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--background)">{text}</text>
    </g>
  );
}

/** Props prontas: grade tracejada, eixos sem linha, texto do eixo no tom certo. */
export const chart = {
  grid: { vertical: false, strokeDasharray: '4 4', stroke: 'var(--chart-grid)' },
  axis: { tickLine: false, axisLine: false, tick: { fill: 'var(--chart-axis)', fontSize: 12 }, tickMargin: 8 },
  /** Barras em pílula finas: cinza com uma destacada em var(--primary). Entrada: sobem do zero (use com useChartMotion). */
  bar: { radius: 999, maxBarSize: 18 },
  /** Animação de entrada: barras sobem, linhas e áreas andam da esquerda para a direita. Espalhe junto com useChartMotion(). */
  enter: { animationDuration: 800, animationEasing: 'ease-out', animationBegin: 0 },
} as const;

// ---------------------------------------------------------------------------
// Quantas linhas cabem (lista que preenche o cartão sem rolagem interna)
// ---------------------------------------------------------------------------

/**
 * Devolve [ref, linhas]. Use o ref no contêiner que tem a altura disponível (flex-1 min-h-0).
 * É um callback ref: mede também quando a lista só aparece depois do carregamento.
 * Abaixo de lg devolve `fallback` (no celular a lista cresce e a página rola).
 */
export function useFitRows(rowHeight: number, fallback: number) {
  const [rows, setRows] = useState(fallback);
  const cleanup = useRef<(() => void) | null>(null);
  const ref = useCallback((el: HTMLElement | null) => {
    cleanup.current?.();
    cleanup.current = null;
    if (!el) return;
    const mq = window.matchMedia('(min-width: 1024px)');
    const calc = () => setRows(mq.matches ? Math.max(1, Math.floor(el.clientHeight / rowHeight)) : fallback);
    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(el);
    mq.addEventListener('change', calc);
    cleanup.current = () => { ro.disconnect(); mq.removeEventListener('change', calc); };
  }, [rowHeight, fallback]);
  useEffect(() => () => cleanup.current?.(), []);
  return [ref, rows] as const;
}

// ---------------------------------------------------------------------------
// Altura do gráfico pela janela (MegaLab, aprovado)
// ---------------------------------------------------------------------------

/**
 * Devolve [ref, altura | null]. Ponha o ref no invólucro do cartão do gráfico e a altura em style={{ height }}.
 * Web (>= lg): ocupa o que sobra até a borda de baixo da janela (entre `min` e `max`); se sobra menos que `min`,
 * o gráfico vai para baixo da dobra e fica com no máximo a altura da janela. Celular: null (use h-64 no corpo).
 * Mede de novo quando qualquer coisa acima cresce (ex.: o cartão de decisão ganhou a lista de jogos).
 * No ultrawide, dê a mesma altura ao vizinho (a lista) e calcule as linhas por coluna dessa altura.
 */
export function useFitHeight({ min = 280, max = 480, gap = 16 } = {}) {
  const [h, setH] = useState<number | null>(null);
  const ro = useRef<ResizeObserver | null>(null);
  const ref = useCallback((el: HTMLElement | null) => {
    ro.current?.disconnect();
    if (!el) return;
    const calc = () => {
      if (window.innerWidth < 1024) { setH(null); return; }
      const vh = window.innerHeight;
      const rest = vh - (el.getBoundingClientRect().top + window.scrollY) - gap;
      setH(rest >= min ? Math.min(max, rest) : Math.min(max, vh - 2 * gap));
    };
    calc();
    ro.current = new ResizeObserver(calc);
    ro.current.observe(document.body);
  }, [min, max, gap]);
  useEffect(() => () => ro.current?.disconnect(), []);
  return [ref, h] as const;
}

// ---------------------------------------------------------------------------
// Animação de entrada dos gráficos (pedido do usuário: "barras subindo, ou andando")
// ---------------------------------------------------------------------------

/**
 * true quando o gráfico deve animar: sempre na entrada, menos para quem pediu "reduzir movimento" no sistema
 * (o check-ui também tira os prints assim, para não pegar a barra no meio do caminho).
 *   const motion = useChartMotion();
 *   <Bar {...chart.bar} {...chart.enter} isAnimationActive={motion} />
 *   <Area ... {...chart.enter} isAnimationActive={motion} />     // a linha anda da esquerda para a direita
 *   <Tooltip isAnimationActive={false} />                        // o balão do hover NUNCA anima
 * Barras e réguas feitas à mão: classe .grow-x (largura) ou .grow-y (altura) do tokens.css.
 */
export function useChartMotion() {
  // Começa em true (servidor e hidratação): o gráfico precisa nascer animando. Se começasse em false e virasse true
  // depois, o Recharts já teria desenhado as barras no lugar e não animaria mais.
  return useSyncExternalStore(subscribeReduced, () => !window.matchMedia(REDUCED).matches, () => true);
}
const REDUCED = '(prefers-reduced-motion: reduce)';
function subscribeReduced(cb: () => void) {
  const m = window.matchMedia(REDUCED);
  m.addEventListener('change', cb);
  return () => m.removeEventListener('change', cb);
}

// ---------------------------------------------------------------------------
// Lista longa num cartão vertical próprio (painel industrial, pedido do usuário)
// ---------------------------------------------------------------------------

/**
 * A única lista da tela, numa coluna da grade (3 ou 4 de 12), ao lado dos gráficos, de cima a baixo:
 *   <DashCard title="Máquinas" className="order-last lg:order-none lg:col-span-4 lg:row-span-2">
 *     <ListaAlta rows={rows} chave={(r) => r.id} head={<div className="grid grid-cols-[...] ...">...</div>} row={(r) => <div className="grid h-full grid-cols-[...] ...">...</div>} />
 * Uma coluna de linhas só: nunca blocos de linhas lado a lado no mesmo cartão (parecem se juntar na horizontal).
 * O conteúdo fica absoluto para não empurrar a altura das faixas; mostra as linhas que cabem e pagina o resto.
 * No celular: 10 por página. Colunas de dado pela largura do cartão (@md:, @2xl: nas classes da grade da linha).
 * minRows: altura mínima em linhas, para quando a faixa não tem altura fixa e é a lista que dá a altura aos vizinhos.
 */
export function ListaAlta<T>({ rows, head, row, chave, rowH = 48, minRows = 0 }: {
  rows: T[]; head: ReactNode; row: (r: T) => ReactNode; chave: (r: T) => string; rowH?: number; minRows?: number;
}) {
  const [ref, cabem] = useFitRows(rowH, 10);
  const [pag, setPag] = useState(0);
  const pags = Math.max(1, Math.ceil(rows.length / cabem));
  const p = Math.min(pag, pags - 1);
  const vis = rows.slice(p * cabem, (p + 1) * cabem);
  const BTN = 'grid size-9 place-items-center rounded-full bg-muted text-foreground hover:bg-accent disabled:opacity-40 [&>svg]:size-4';
  return (
    <div className="@container relative lg:h-full lg:min-h-(--lista-min)" style={{ '--lista-min': `${minRows * rowH + 84}px` } as CSSProperties}>
      <div className="flex flex-col lg:absolute lg:inset-0">
        {head}
        <div ref={ref} className="min-h-0 lg:flex-1 lg:overflow-hidden">
          {vis.map((r) => <div key={chave(r)} style={{ height: rowH }}>{row(r)}</div>)}
        </div>
        {pags > 1 && (
          <div className="flex shrink-0 items-center justify-end gap-3 border-t border-dashed border-border pt-3 text-[13px] text-muted-foreground">
            <span>{p * cabem + 1} a {Math.min(rows.length, (p + 1) * cabem)} de {rows.length}</span>
            <button type="button" aria-label="Página anterior" disabled={p === 0} onClick={() => setPag(p - 1)} className={BTN}><ChevronLeft /></button>
            <button type="button" aria-label="Próxima página" disabled={p >= pags - 1} onClick={() => setPag(p + 1)} className={BTN}><ChevronRight /></button>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Cascata e funil (colunas feitas à mão que ocupam a altura do cartão)
// ---------------------------------------------------------------------------

/**
 * Cada coluna vai de `de` a `ate` (0 a 1 da altura; deixe ~15% livres em cima para o rótulo), com o valor em cima e o nome embaixo.
 * Cascata ("da meta ao realizado"): totais com de = 0 em cinza; passos flutuantes entre o acumulado anterior e o novo,
 *   uma cor para "somou" e outra para "tirou" (legenda no cabeçalho), texto com sinal ("+79 mil", "−145 mil").
 * Funil ("para onde vai o total"): colunas que encolhem; `fantasma` = altura da etapa anterior (o trecho perdido fica apagado);
 *   só a última na cor de destaque; o nome das perdas vai em KeyValue embaixo do gráfico.
 */
export function Colunas({ items }: { items: { nome: string; de: number; ate: number; cor: string; texto: string; fantasma?: number }[] }) {
  return (
    <div className="grid h-52 gap-2 lg:h-full lg:min-h-0" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
      {items.map((it) => (
        <div key={it.nome} className="flex min-h-0 min-w-0 flex-col items-center">
          <div className="relative w-full min-h-0 flex-1">
            {it.fantasma !== undefined && it.fantasma > it.ate && (
              <div className="absolute left-1/2 w-full max-w-12 -translate-x-1/2 rounded-lg bg-muted" style={{ bottom: `${it.ate * 100}%`, height: `${(it.fantasma - it.ate) * 100}%` }} />
            )}
            <div className="grow-y absolute left-1/2 min-h-1.5 w-full max-w-12 -translate-x-1/2 rounded-lg" style={{ bottom: `${it.de * 100}%`, height: `${Math.max(0, it.ate - it.de) * 100}%`, background: it.cor }} />
            <div className="absolute inset-x-0 pb-1.5 text-center text-[11px] font-medium whitespace-nowrap tabular" style={{ bottom: `${Math.max(it.ate, it.fantasma ?? 0) * 100}%` }}>{it.texto}</div>
          </div>
          <div className="mt-2 text-center text-xs leading-tight text-muted-foreground">{it.nome}</div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Gráficos de bater o olho (painel industrial): o que somou e o que tirou; de cada 100
// ---------------------------------------------------------------------------

/**
 * Barras que saem do meio: para a direita o que somou, para a esquerda o que tirou. Uma linha por fator, valor com sinal ao lado.
 * De bater o olho: a barra mais comprida é o que mais pesou, e o lado diz se ajudou ou atrapalhou.
 */
export function Divergentes({ items, fmt }: { items: { nome: string; v: number; /** Feito contra planejado, embaixo do nome. */ apoio?: string }[]; fmt: (v: number) => string }) {
  const max = Math.max(1, ...items.map((i) => Math.abs(i.v)));
  return (
    <div className="flex h-full w-full max-w-4xl flex-col justify-center">
      {items.map((it) => {
        const w = (Math.abs(it.v) / max) * 50;
        return (
          <div key={it.nome} className="grid h-12 shrink-0 grid-cols-[7.25rem_minmax(0,1fr)_4.75rem] items-center gap-3 text-sm lg:h-auto lg:max-h-24 lg:min-h-11 lg:flex-1">
            <span className="min-w-0 leading-tight"><span className="block">{it.nome}</span>{it.apoio && <span className="block text-xs text-muted-foreground">{it.apoio}</span>}</span>
            <span className="relative h-3 fit:h-1/2">
              <span className="absolute inset-y-[-6px] left-1/2 w-px bg-border" />
              <span className="grow-x absolute inset-y-0 min-w-1 rounded-full fit:rounded-lg" style={{ left: it.v >= 0 ? '50%' : `${50 - w}%`, width: `${w}%`, background: it.v >= 0 ? 'var(--primary)' : 'var(--cat-2)', transformOrigin: it.v >= 0 ? 'left center' : 'right center' }} />
            </span>
            <span className="text-right font-medium tabular">{fmt(it.v)}</span>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Quadro de 100 quadradinhos: cada um vale 1% do total. "De cada 100 horas, 40 produzindo."
 * As partes vêm ordenadas da maior para a menor (no quadro e na legenda) e são arredondadas para somar 100.
 * O formato segue o cartão: estreito = 10 x 10 com a legenda ao lado; largo = 20 x 5 de ponta a ponta com a legenda embaixo.
 */
export function Quadro100({ parts }: { parts: { label: string; value: number; color: string }[] }) {
  const ord = [...parts].sort((a, b) => b.value - a.value);
  const tot = ord.reduce((a, b) => a + b.value, 0) || 1;
  const exato = ord.map((p) => (p.value / tot) * 100);
  const n = exato.map(Math.floor);
  const falta = 100 - n.reduce((a, b) => a + b, 0);
  exato.map((e, k) => [e - Math.floor(e), k] as const).sort((a, b) => b[0] - a[0]).slice(0, falta).forEach(([, k]) => { n[k] += 1; });
  const cells = ord.flatMap((p, k) => Array.from({ length: n[k] }, () => p.color));
  return (
    <div className="@container h-full min-h-0">
      <div className="flex h-full min-h-0 items-center justify-center gap-5 @2xl:flex-col @2xl:items-stretch @2xl:gap-4">
        {/* grid-flow-col: os quadradinhos enchem coluna por coluna, e cada atividade vira uma faixa da esquerda para a direita. */}
        <div className="animate-in grid aspect-square h-36 shrink-0 auto-cols-fr grid-flow-col grid-rows-10 gap-[3px] fit:h-full fit:max-h-72 @2xl:aspect-[4/1] @2xl:h-auto! @2xl:max-h-none! @2xl:w-full @2xl:grid-rows-5 @2xl:gap-1" role="img" aria-label="Quadro de 100 quadradinhos com a parte de cada atividade">
          {cells.map((cor, k) => <span key={k} className="rounded-[3px] @2xl:rounded-md" style={{ background: cor }} />)}
        </div>
        <div className="min-w-0 flex-1 @2xl:flex @2xl:flex-none @2xl:flex-wrap @2xl:justify-between @2xl:gap-x-6">
          {ord.map((p, k) => (
            <div key={p.label} className="flex min-h-8 items-center gap-2 text-sm">
              <span className="size-2 shrink-0 rounded-full" style={{ background: p.color }} />
              <span className="min-w-0 flex-1 text-muted-foreground @2xl:flex-none">{p.label}</span>
              <span className="font-medium tabular">{n[k]}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
