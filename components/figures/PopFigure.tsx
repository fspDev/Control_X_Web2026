import * as React from 'react';
import * as k from '../iso/iso-kit';
import { spring, useInView, useLoop, type Spring } from '../iso/react/live';
import { scene } from './scene';
import { FigureCard } from './FigureCard';

/*
 * Fig. 2 — Exhibidor de cartón de piso (FSDU) en un pasillo de supermercado (1 = 1 cm).
 * El wobbler cuelga de su lengüeta de PET y oscila: un resorte torsional amortiguado
 * (frecuencia ~2,2 Hz, amortiguación baja), como el de verdad cuando pasa alguien.
 *
 * Piezas (45 sólidos):
 *   base       piso con baldosas, adhesivo de piso, zócalo con 4 regatones
 *   cuerpo     fondo, 2 laterales con gráfica, 4 bandejas, 4 frentes de bandeja, 4 cenefas, 4 precios
 *   producto   12 cajas en 4 alturas
 *   cabezal    cartel superior (pieza encendida) con 2 trabas
 *   wobbler    lengüeta y tarjeta redonda (se mueve)
 */

const W = 560;
const H = 470;
const BODY = { x: 0, y: 0, w: 64, d: 42 };
const TOP = 150;
const SHELVES = [14, 48, 82, 116];

const P = k.fitProjection(
  [...k.boxCorners({ x: -40, y: -30, w: 150, d: 140, r: 0 }, 0, 0), ...k.boxCorners({ x: -4, y: 0, w: 72, d: 70, r: 0 }, 0, 198)],
  W,
  H,
  { pad: 26 },
);

const S = scene(P);
const { box, cyl, seg, dots, line, outline, put } = S;

/* ---------- base ---------- */
const FLOOR: k.Plan = { x: -40, y: -30, w: 150, d: 140, r: 0 };
const tiles: string[] = [];
for (let v = 0; v <= 150; v += 30) tiles.push(k.lineOnTop([FLOOR.x + v, FLOOR.y], [FLOOR.x + v, FLOOR.y + FLOOR.d], 0, P));
for (let v = 0; v <= 140; v += 35) tiles.push(k.lineOnTop([FLOOR.x, FLOOR.y + v], [FLOOR.x + FLOOR.w, FLOOR.y + v], 0, P));
put(0, [0, 0, 0], <>
  {S.solid(k.slabOf(FLOOR, -1, 1, P, 1), { tone: 'faint', crease: 'none' })}
  {line(tiles.join(''), 'faint')}
  {line(k.ring(32, 82, 16, 0, P, 40), 'lo')}
  {line(k.ring(32, 82, 12, 0, P, 40), 'faint')}
  {line(k.onTop([[27, 76], [27, 88], [38, 82]], 0, P, true), 'mid')}
</>);

const PLINTH: k.Plan = { x: 0, y: 0, w: BODY.w, d: BODY.d, r: 1 };
put(1, [32, 21, 0], <>
  <path className="iso-halo" d={k.haloOf(PLINTH, 0, 14, P)} />
  {k.corners(PLINTH, 5)
    .sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P))
    .map(([x, y]) => <g key={`${x}-${y}`}>{cyl(x, y, 2.6, 0, 2, { tone: 'lo', steps: 16 })}</g>)}
  {box({ ...PLINTH }, 2, 12, { tone: 'lo', bevel: 0.5, inner: line(k.sideSeam(PLINTH, 8, P, 3), 'faint') })}
</>);

/* ---------- cuerpo ---------- */
put(2, [32, 1, 14], box({ x: 2, y: 0, w: 60, d: 2, r: 0 }, 14, TOP - 14, { tone: 'mid', steps: 1 }));
put(2.1, [1, 21, 14], box({ x: 0, y: 0, w: 2, d: BODY.d, r: 0 }, 14, TOP - 14, { tone: 'mid', steps: 1 }));

SHELVES.forEach((z, i) => {
  const L = 3 + i * 0.1;
  put(L, [32, 21, z], box({ x: 2, y: 2, w: 60, d: 39, r: 0.4 }, z, 1.5, { tone: 'mid', steps: 1, bevel: 0.3 }));
  [8, 26, 44].forEach((x, j) => {
    const tall = [24, 20, 26, 22][(i + j) % 4];
    const plan: k.Plan = { x, y: 8, w: 14, d: 22, r: 0.8 };
    put(L + 0.05, [x + 7, 19, z], box(plan, z + 1.5, tall, {
      tone: 'hi',
      bevel: 0.5,
      inner: line(k.sideSeam(plan, z + 1.5 + tall * 0.55, P, 2), 'faint'),
    }));
  });
  // frente de bandeja con cenefa y precio
  put(4 + i * 0.01, [32, 41, z], <>
    {box({ x: 2, y: 39, w: 60, d: 3, r: 0 }, z - 2, 9, { tone: 'mid', steps: 1, bevel: 0.3 })}
    {seg([2, 42, z + 3.5], [62, 42, z + 3.5], 'faint')}
    {box({ x: 48, y: 42, w: 10, d: 0.8, r: 0 }, z - 1, 6, { tone: 'lo', steps: 1 })}
  </>);
});
// Lateral derecho con su gráfica (la cara que ve el comprador del pasillo)
put(4.5, [63, 21, 14], <>
  {box({ x: 62, y: 0, w: 2, d: BODY.d, r: 0 }, 14, TOP - 14, { tone: 'mid', steps: 1 })}
  {outline([[64, 6, 30], [64, 36, 30], [64, 36, 130], [64, 6, 130]], 'lo')}
  {seg([64, 6, 30], [64, 36, 130], 'faint')}
  {seg([64, 36, 30], [64, 6, 130], 'faint')}
</>);

/* ---------- cabezal ---------- */
const HEADER: k.Plan = { x: -4, y: 0, w: 72, d: 3, r: 0.6 };
put(5, [32, 2, TOP], <>
  {box(HEADER, TOP, 46, { tone: 'hi', lit: true, bevel: 0.6, inner: line(k.sideSeam(HEADER, TOP + 12, P, 3), 'red') })}
  <text
    className="iso-face-text"
    data-tone="hi"
    transform={k.sideMatrix([32, 3], TOP + 32, P, 'left')}
    fontSize={9}
    textAnchor="middle"
    fontWeight={800}
    style={{ fontFamily: 'Manrope, sans-serif' }}
  >
    OFERTA
  </text>
</>);
for (const x of [8, 52]) put(5.1, [x, 2, TOP], box({ x: x - 3, y: 0, w: 6, d: 6, r: 0.5 }, TOP - 6, 8, { tone: 'lo', bevel: 0.3 }));

/* ---------- wobbler (se mueve) ---------- */
const ROOT: k.Point3 = [30, 42, 86]; // sale del frente de la tercera bandeja
const ARM = 16;
const CARD_R = 10;
put(4.1, [30, 42, 86], box({ x: 27, y: 41.5, w: 6, d: 1.2, r: 0.2 }, 84, 6, { tone: 'lo', steps: 1 }));

/** theta > 0: la lengüeta se dobla hacia abajo. La tarjeta es un disco en la punta, perpendicular a la lengüeta. */
function wobbler(theta: number) {
  const c = Math.cos(theta);
  const s = Math.sin(theta);
  const tip: k.Point3 = [ROOT[0], ROOT[1] + ARM * c, ROOT[2] - ARM * s];
  const up: k.Point3 = [0, s, c];
  const discAt = (radius: number) => {
    const pts: k.Flat[] = [];
    for (let i = 0; i < 40; i++) {
      const phi = (i / 40) * Math.PI * 2;
      const a = radius * Math.cos(phi);
      const b = radius * Math.sin(phi);
      pts.push(k.iso([tip[0] + a, tip[1] + b * up[1], tip[2] + b * up[2]], P));
    }
    return k.pathOf(pts, true);
  };
  return { arm: k.pathOf([k.iso(ROOT, P), k.iso(tip, P)]), card: discAt(CARD_R), inner: discAt(CARD_R * 0.62), tip: k.iso(tip, P) };
}
const REST = wobbler(0);

const ART = S.render();

/* ---------- vida ---------- */
const STIFF = (2 * Math.PI * 2.2) ** 2; // 2,2 Hz
const DAMP = 1.1;

const PopFigure: React.FC = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const arm = React.useRef<SVGPathElement>(null);
  const card = React.useRef<SVGPathElement>(null);
  const cardFill = React.useRef<SVGPathElement>(null);
  const inner = React.useRef<SVGPathElement>(null);
  const hub = React.useRef<SVGCircleElement>(null);
  const inView = useInView(ref);
  const state = React.useRef<Spring>({ at: 0, rate: 0 });
  const clock = React.useRef(0);
  const peak = React.useRef(0);
  const [readout, setReadout] = React.useState('Wobbler en reposo');

  const flick = (strength: number) => {
    state.current.rate += strength;
  };

  const tick = (dt: number, calm: boolean) => {
    if (calm) {
      state.current = { at: 0, rate: 0 };
    } else {
      clock.current += dt;
      if (clock.current > 3.4) {
        clock.current = 0;
        flick(4.2); // un cliente pasa y mueve el aire
      }
      spring(state.current, 0, dt, STIFF, DAMP);
    }
    const th = state.current.at;
    const g = wobbler(th);
    arm.current?.setAttribute('d', g.arm);
    card.current?.setAttribute('d', g.card);
    cardFill.current?.setAttribute('d', g.card);
    inner.current?.setAttribute('d', g.inner);
    hub.current?.setAttribute('cx', g.tip[0].toFixed(1));
    hub.current?.setAttribute('cy', g.tip[1].toFixed(1));
    const deg = Math.abs((th * 180) / Math.PI);
    peak.current = Math.max(deg, peak.current * Math.exp(-dt * 1.5));
    const text = peak.current < 0.5 ? 'Wobbler en reposo' : `Oscila ±${peak.current.toFixed(0)}° · 2,2 Hz`;
    setReadout((r) => (r === text ? r : text));
    return !calm;
  };
  useLoop(tick, inView);

  return (
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      aria-label="Empujar el wobbler"
      onClick={() => flick(9)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          flick(9);
        }
      }}
      className="cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
    >
      <FigureCard
        fig="Fig. 2"
        title="Exhibidor de punto de venta"
        hint="Clic: empujar el wobbler"
        readout={readout}
        label="Exhibidor de cartón de piso con cuatro bandejas de productos, cabezal de oferta y un wobbler que oscila sobre su lengüeta."
        width={W}
        height={H}
        keys={[{ mark: 'lit', label: 'Cabezal' }, { mark: 'raised', label: 'Cartón y producto' }, { mark: 'red', label: 'Color de marca' }]}
      >
        {ART}
        <g className="iso-solid" data-lit="">
          <path ref={arm} className="iso-line" data-tone="mid" d={REST.arm} />
          <path ref={cardFill} className="iso-fill" d={REST.card} />
          <path ref={inner} className="iso-line" data-tone="red" d={REST.inner} />
          <path ref={card} className="iso-line iso-edge" data-tone="hi" d={REST.card} />
          <circle ref={hub} className="iso-wire-end" cx={REST.tip[0]} cy={REST.tip[1]} r={1.1} />
        </g>
      </FigureCard>
    </div>
  );
};

export default PopFigure;
