import * as React from 'react';
import * as k from '../iso/iso-kit';
import { follow, useInView, useLoop } from '../iso/react/live';
import { scene } from './scene';
import { FigureCard } from './FigureCard';

/*
 * Fig. 3 — Vitrina de exhibición con plato giratorio (1 = 1 cm).
 * Un pedestal de 55 × 55 × 100 cm con campana de vidrio, tira LED y un plato que gira
 * a 2 rpm, el ritmo de los platos giratorios de vidriera: el producto se muestra en 360°.
 *
 * Piezas (46 sólidos):
 *   piso       alfombra de exhibición, 2 postes de fila con base y remate, cordón
 *   pedestal   zócalo rehundido, cuerpo con bandas, tapa, placa de bronce con 2 tornillos
 *   vitrina    marco inferior (4 perfiles), 4 parantes, campana de vidrio, marco superior, tira LED
 *   giro       base del motor, plato con escala y moleteado
 *   producto   frasco (se reconstruye en cada cuadro al girar), tapa
 *   segundo    pedestal bajo con caja de producto y atril de precio
 */

const W = 560;
const H = 480;
const PED: k.Plan = { x: 0, y: 0, w: 55, d: 55, r: 1 };
const TOP = 100;
const GLASS_TOP = 158;
const CX = 27.5;
const CY = 27.5;

const P = k.fitProjection(
  [...k.boxCorners({ x: -30, y: -20, w: 150, d: 150, r: 0 }, 0, 0), ...k.boxCorners(PED, 0, GLASS_TOP + 6)],
  W,
  H,
  { pad: 26 },
);

const S = scene(P);
const { box, cyl, seg, dots, line, outline, put, at } = S;

/* ---------- piso ---------- */
const RUG: k.Plan = { x: -30, y: -20, w: 150, d: 150, r: 3 };
put(0, [0, 0, 0], <>
  {S.solid(k.slabOf(RUG, 0, 0.8, P, 3), { tone: 'faint', crease: 'none' })}
  {line(k.planOutline(k.insetPlan(RUG, 6), 0.8, P, 3), 'faint')}
</>);
// Postes de fila con cordón
const POLES: k.Plane[] = [[112, 18], [112, 104]];
for (const [x, y] of POLES) {
  put(5, [x, y, 0], <>
    {cyl(x, y, 9, 0.8, 2.2, { tone: 'lo', steps: 32, bevel: 0.4 })}
    {cyl(x, y, 1.8, 3, 90, { tone: 'mid', steps: 16 })}
    {line(k.sideArc(x, y, 1.8, 60, P, 12), 'faint')}
    {cyl(x, y, 3.2, 93, 4, { tone: 'hi', steps: 20, bevel: 0.3 })}
  </>);
}
const rope: k.Flat[] = [];
for (let i = 0; i <= 24; i++) {
  const t = i / 24;
  rope.push(at([112, 18 + 86 * t, 88 - 14 * Math.sin(Math.PI * t)]));
}
put(4.9, [112, 61, 80], line(k.pathOf(rope), 'mid')); // antes que los postes: sus extremos quedan debajo

/* ---------- pedestal ---------- */
put(2, [CX, CY, 0], <>
  <path className="iso-halo" d={k.haloOf(PED, 0.8, 8, P)} />
  {box(k.insetPlan(PED, 3), 0.8, 7, { tone: 'lo', bevel: 0.3 })}
  {box(PED, 7.8, TOP - 11.8, {
    tone: 'mid',
    bevel: 0.6,
    inner: <>{line(k.sideSeam(PED, 20, P, 3), 'faint')}{line(k.sideSeam(PED, 84, P, 3), 'faint')}</>,
  })}
  {box(k.insetPlan(PED, -2), TOP - 4, 4, { tone: 'hi', bevel: 0.8 })}
</>);
// Placa de bronce sobre la cara frontal
put(2.5, [CX, 55, 60], <>
  {box({ x: 15, y: 55, w: 25, d: 1, r: 0.3 }, 52, 12, { tone: 'lo', steps: 2, bevel: 0.2 })}
  {seg([18, 56, 61], [34, 56, 61], 'mid', true)}
  {seg([18, 56, 58], [30, 56, 58], 'lo', true)}
  {seg([18, 56, 55], [32, 56, 55], 'lo', true)}
  {dots([[16.5, 56, 62.5], [38.5, 56, 62.5]], 0.45, 'hi')}
</>);

/* ---------- giro: base del motor y plato ---------- */
put(3, [CX, CY, TOP], <>
  {cyl(CX, CY, 9, TOP, 3, { tone: 'lo', steps: 28 })}
  {cyl(CX, CY, 17, TOP + 3, 3, { tone: 'mid', steps: 48, bevel: 0.5 })}
  {line(k.knurl(CX, CY, 17, TOP + 3, TOP + 6, 56, P, 0.3), 'faint')}
  {line(k.ring(CX, CY, 15.5, TOP + 6, P, 56), 'faint')}
</>);

/* ---------- vitrina: marco inferior y parantes traseros ---------- */
const G0 = TOP; // base del vidrio
const FRAME = k.insetPlan(PED, 1);
const back: Array<[number, number]> = [[FRAME.x, FRAME.y], [FRAME.x + FRAME.w, FRAME.y], [FRAME.x, FRAME.y + FRAME.d]];
for (const [x, y] of back) put(2.8, [x, y, G0], box({ x: x - 1.2, y: y - 1.2, w: 2.4, d: 2.4, r: 0.3 }, G0, GLASS_TOP - G0, { tone: 'lo', steps: 1 }));
// Aristas traseras del vidrio (se ven a través del vidrio)
put(2.9, [CX, CY, G0], <>
  {seg([FRAME.x, FRAME.y, GLASS_TOP], [FRAME.x + FRAME.w, FRAME.y, GLASS_TOP], 'faint')}
  {seg([FRAME.x, FRAME.y, GLASS_TOP], [FRAME.x, FRAME.y + FRAME.d, GLASS_TOP], 'faint')}
</>);

/* ---------- vitrina: vidrio frontal, parante delantero y marco superior (encima del producto) ---------- */
const gx0 = FRAME.x, gy0 = FRAME.y, gx1 = FRAME.x + FRAME.w, gy1 = FRAME.y + FRAME.d;
const glassFaces = [
  [[gx1, gy0, G0], [gx1, gy1, G0], [gx1, gy1, GLASS_TOP], [gx1, gy0, GLASS_TOP]],
  [[gx0, gy1, G0], [gx1, gy1, G0], [gx1, gy1, GLASS_TOP], [gx0, gy1, GLASS_TOP]],
] as k.Point3[][];
const GLASS = (
  <g key="glass">
    {glassFaces.map((face, i) => (
      <path key={i} d={k.pathOf(face.map(at), true)} fill="#ffffff" fillOpacity={i === 0 ? 0.035 : 0.05} stroke="none" />
    ))}
    {/* reflejo diagonal en el vidrio, de arista a arista */}
    <g dangerouslySetInnerHTML={{ __html: k.fadeLineSvg([at([gx0 + 8, gy1, G0 + 6]), at([gx0 + 28, gy1, GLASS_TOP - 6])], { fade: [12, 12], tone: 'faint' }) + k.fadeLineSvg([at([gx0 + 18, gy1, G0 + 6]), at([gx0 + 32, gy1, G0 + 46])], { fade: [8, 8], tone: 'faint' }) }} />
    {box({ x: gx1 - 1.2, y: gy1 - 1.2, w: 2.4, d: 2.4, r: 0.3 }, G0, GLASS_TOP - G0, { tone: 'mid', steps: 1 })}
    {box({ ...FRAME, r: 0.6 }, GLASS_TOP, 6, { tone: 'mid', bevel: 0.6 })}
    {line(k.planOutline(k.insetPlan(FRAME, 4), GLASS_TOP + 6, P, 2), 'faint')}
    {line(k.sideSeam(FRAME, GLASS_TOP + 2, P, 2), 'lit')}
  </g>
);

/* ---------- segundo pedestal, bajo ---------- */
const LOW: k.Plan = { x: 64, y: 52, w: 34, d: 34, r: 1 };
put(4, [81, 69, 0], <>
  <path className="iso-halo" d={k.haloOf(LOW, 0.8, 50, P)} />
  {box(LOW, 0.8, 50, { tone: 'mid', bevel: 0.5, inner: line(k.sideSeam(LOW, 10, P, 3), 'faint') })}
  {box({ x: 70, y: 58, w: 20, d: 16, r: 1 }, 50.8, 18, { tone: 'hi', bevel: 0.5, inner: line(k.sideSeam({ x: 70, y: 58, w: 20, d: 16, r: 1 }, 62, P, 3), 'faint') })}
  {box({ x: 78, y: 78, w: 12, d: 2, r: 0.3 }, 50.8, 8, { tone: 'lo', steps: 1 })}
</>);

const ART = S.render();

/* ---------- producto que gira ---------- */
const BOTTLE = { w: 15, d: 11, h: 28, r: 1.6 };
function bottleAt(angle: number) {
  const ring = k.ringOf({ x: -BOTTLE.w / 2, y: -BOTTLE.d / 2, w: BOTTLE.w, d: BOTTLE.d, r: BOTTLE.r }, 3).map(([x, y]): k.Plane => [
    CX + x * Math.cos(angle) - y * Math.sin(angle),
    CY + x * Math.sin(angle) + y * Math.cos(angle),
  ]);
  return k.extrude(ring, TOP + 6, BOTTLE.h, P, { bevel: 0.5 });
}
const CAP = k.cylinder(CX, CY, 3.6, TOP + 6 + BOTTLE.h, 7, P, 24, 0.4);
const capKnurl = k.knurl(CX, CY, 3.6, TOP + 6 + BOTTLE.h, TOP + 13 + BOTTLE.h, 22, P, 0.3);
const ticksAt = (angle: number) => k.radialTicks(CX, CY, 15.5, 36, 9, TOP + 6, [1, 2.2], P, angle);

/* ---------- vida ---------- */
const RPM = 2;
const SPIN = (RPM * 2 * Math.PI) / 60; // rad/s

const ShowcaseFigure: React.FC = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const body = React.useRef<SVGGElement>(null);
  const ticksMinor = React.useRef<SVGPathElement>(null);
  const ticksMajor = React.useRef<SVGPathElement>(null);
  const inView = useInView(ref);
  const angle = React.useRef(0.35);
  const speed = React.useRef(SPIN);
  const target = React.useRef(SPIN);
  const [readout, setReadout] = React.useState('Giro 20° · 2 rpm');
  const [rest] = React.useState(() => bottleAt(angle.current));
  const [restTicks] = React.useState(() => ticksAt(angle.current));

  const tick = (dt: number, calm: boolean) => {
    speed.current = follow(speed.current, calm ? 0 : target.current, dt, 0.6, calm);
    angle.current = (angle.current + speed.current * dt) % (Math.PI * 2);
    const b = bottleAt(angle.current);
    const el = body.current;
    if (el) {
      const paths = el.querySelectorAll('path');
      paths[0]?.setAttribute('d', b.fill);
      b.shades.forEach((d, i) => paths[1 + i]?.setAttribute('d', d || ''));
      paths[5]?.setAttribute('d', b.top);
      paths[6]?.setAttribute('d', b.crease || '');
      paths[7]?.setAttribute('d', b.bevel || '');
      paths[8]?.setAttribute('d', b.outline);
    }
    const t = ticksAt(angle.current);
    ticksMinor.current?.setAttribute('d', t.minor);
    ticksMajor.current?.setAttribute('d', t.major);
    const deg = Math.round((angle.current * 180) / Math.PI);
    const rpm = (speed.current * 60) / (2 * Math.PI);
    const text = rpm < 0.05 ? `Detenido en ${deg}°` : `Giro ${deg}° · ${rpm.toFixed(1).replace('.', ',')} rpm`;
    setReadout((r) => (r === text ? r : text));
    return !calm || speed.current !== 0;
  };
  useLoop(tick, inView);

  const toggle = () => {
    target.current = target.current ? 0 : SPIN;
  };

  return (
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      aria-label="Pausar o reanudar el plato giratorio"
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      }}
      className="cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
    >
      <FigureCard
        fig="Fig. 3"
        title="Vitrina con plato giratorio"
        hint="Clic: pausar / girar"
        readout={readout}
        label="Vitrina de exhibición sobre pedestal, con campana de vidrio, tira de luz LED y un plato que gira a dos vueltas por minuto mostrando un frasco de perfume."
        width={W}
        height={H}
        keys={[{ mark: 'lit', label: 'Producto' }, { mark: 'raised', label: 'Pedestal y vitrina' }, { mark: 'edge', label: 'Tira LED' }]}
      >
        {ART}
        <g className="iso-line" data-tone="lo">
          <path ref={ticksMinor} className="iso-line" data-tone="lo" d={restTicks.minor} />
          <path ref={ticksMajor} className="iso-line" data-tone="mid" d={restTicks.major} />
        </g>
        <g ref={body} className="iso-solid" data-lit="">
          <path className="iso-fill" d={rest.fill} />
          {rest.shades.map((d, i) => (
            <path key={i} className="iso-shade" data-shade={i} d={d || ''} />
          ))}
          <path className="iso-top" d={rest.top} />
          <path className="iso-line iso-crease" data-tone="faint" d={rest.crease || ''} />
          <path className="iso-line iso-bevel" data-tone="faint" d={rest.bevel || ''} />
          <path className="iso-line iso-edge" data-tone="hi" d={rest.outline} />
        </g>
        <g className="iso-solid">
          <path className="iso-fill" d={CAP.fill} />
          {CAP.shades.map((d, i) => (d ? <path key={i} className="iso-shade" data-shade={i} d={d} /> : null))}
          <path className="iso-top" d={CAP.top} />
          <path className="iso-line" data-tone="faint" d={capKnurl} />
          <path className="iso-line iso-edge" data-tone="mid" d={CAP.outline} />
        </g>
        {GLASS}
      </FigureCard>
    </div>
  );
};

export default ShowcaseFigure;
