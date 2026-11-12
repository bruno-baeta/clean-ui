/**
 * Só para telas com mapa (precisa de d3-geo, topojson-client e world-atlas): largura da coluna do mapa e mapa-múndi que preenche.
 * O visual dos cartões (título, indicador, chips, tabela, legenda, medidor) está em assets/dashboard.tsx.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
/** useFitRows mora no kit (assets/dashboard.tsx), sem dependência de mapa; reexportado aqui por compatibilidade. */
export { useFitRows, useFitHeight } from './dashboard';
import { geoEquirectangular, geoGraticule10, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import type { GeometryCollection, Topology } from 'topojson-specification';
import land110 from 'world-atlas/land-110m.json';
import { cn } from './ui';

// ---------------------------------------------------------------------------
// Coluna do mapa com a largura que a proporção dele pede
// ---------------------------------------------------------------------------

/**
 * Para uma linha "mapa | coluna ao lado" sem faixas vazias nas laterais do mapa.
 * Devolve [ref, gridTemplateColumns | null]; aplique no style da linha (só no web).
 * aspect: largura/altura do mapa (mundo equirretangular ~2,65; Brasil ~1). header: altura do cabeçalho + respiros do cartão.
 * Prefira, quando der, alinhar tudo numa grade comum (col-span); use isto só quando o mapa sobrar com vazios.
 */
export function useMapColumns({ aspect = 2.65, header = 60, pad = 40, minSide = 400, maxSide = 760 } = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState<string | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mq = window.matchMedia('(min-width: 64rem)');
    const calc = () => {
      if (!mq.matches) return setCols(null);
      const mapW = Math.round((el.clientHeight - header) * aspect + pad);
      const side = Math.min(maxSide, Math.max(minSide, el.clientWidth - mapW));
      setCols(`minmax(0, 1fr) ${side}px`);
    };
    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(el);
    mq.addEventListener('change', calc);
    return () => { ro.disconnect(); mq.removeEventListener('change', calc); };
  }, [aspect, header, pad, minSide, maxSide]);
  return [ref, cols] as const;
}

// ---------------------------------------------------------------------------
// Mapa que preenche o painel (equirretangular, faixa de latitude habitada)
// ---------------------------------------------------------------------------

const topo = land110 as unknown as Topology<{ land: GeometryCollection }>;
const LAND = feature(topo, topo.objects.land);
const GRAT = geoGraticule10();

export interface MapPoint { id: string; lon: number; lat: number; r: number; color: string; pulse?: boolean; title: string }

export function FillMap({ points, selectedId, onSelect, className, grid = true, labels = [], pulseClass = 'map-pulse' }: {
  points: MapPoint[]; selectedId?: string | null; onSelect?: (id: string) => void; className?: string;
  /** Grade de latitude e longitude (desligue no visual sóbrio). */ grid?: boolean;
  /** Rótulos ao lado de alguns pontos (ex.: os mais fortes). */ labels?: { id: string; text: string }[];
  pulseClass?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const geo = useMemo(() => {
    if (!size.w || !size.h) return null;
    const projection = geoEquirectangular().fitExtent([[6, 6], [size.w - 6, size.h - 6]], { type: 'MultiPoint', coordinates: [[-180, -58], [180, 78]] });
    const path = geoPath(projection);
    return { projection, land: path(LAND) ?? '', grat: path(GRAT) ?? '' };
  }, [size]);

  const dots = useMemo(() => {
    if (!geo) return [];
    // Pontos acompanham o tamanho do mapa (no celular ficam menores).
    const k = Math.min(1, Math.max(0.45, size.w / 1100));
    return points.map((p) => {
      const xy = geo.projection([p.lon, p.lat]);
      return xy ? { ...p, r: Math.max(1.5, p.r * k), x: xy[0], y: xy[1] } : null;
    }).filter((d): d is NonNullable<typeof d> => d !== null);
  }, [points, geo]);
  const sel = dots.find((d) => d.id === selectedId);

  return (
    <div ref={ref} className={cn('size-full', className)} style={{ background: 'var(--map-sea)' }}>
      {geo && (
        <svg width={size.w} height={size.h} className="block" role="img" aria-label="Mapa dos tremores">
          {grid && <path d={geo.grat} fill="none" stroke="var(--map-line)" strokeOpacity={0.45} strokeWidth={0.6} />}
          <path d={geo.land} fill="var(--map-land)" stroke="var(--map-line)" strokeWidth={0.6} />
          {dots.map((d) => (
            <g key={d.id} className={onSelect ? 'cursor-pointer' : undefined} onClick={onSelect ? () => onSelect(d.id) : undefined}>
              {d.pulse && <circle cx={d.x} cy={d.y} r={d.r} fill="none" stroke={d.color} strokeWidth={1.5} className={pulseClass} />}
              <circle cx={d.x} cy={d.y} r={d.r} fill={d.color} fillOpacity={selectedId && selectedId !== d.id ? 0.3 : 0.8} stroke="var(--map-sea)" strokeWidth={1}>
                <title>{d.title}</title>
              </circle>
            </g>
          ))}
          {labels.map((l) => {
            const d = dots.find((x) => x.id === l.id);
            if (!d) return null;
            const left = d.x > size.w - 170;
            return (
              <text key={l.id} x={left ? d.x - d.r - 5 : d.x + d.r + 5} y={d.y + 4} textAnchor={left ? 'end' : 'start'} pointerEvents="none"
                fontSize={11} fontWeight={600} fill="var(--foreground)" stroke="var(--map-sea)" strokeWidth={3} paintOrder="stroke" strokeLinejoin="round">
                {l.text}
              </text>
            );
          })}
          {sel && (
            <g pointerEvents="none">
              <circle cx={sel.x} cy={sel.y} r={sel.r + 9} fill="none" stroke="var(--foreground)" strokeOpacity={0.5} strokeWidth={1.25} />
              <circle cx={sel.x} cy={sel.y} r={sel.r + 1.5} fill={sel.color} stroke="var(--foreground)" strokeWidth={1.5} />
            </g>
          )}
        </svg>
      )}
    </div>
  );
}
