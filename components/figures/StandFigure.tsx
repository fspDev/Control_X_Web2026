import * as React from 'react';
import * as k from '../iso/iso-kit';
import { follow, useInView, useLoop } from '../iso/react/live';
import { scene } from './scene';
import { FigureCard } from './FigureCard';

/*
 * Fig. 1 — Stand de esquina de 3 × 3 m (unidades: 1 = 1 cm).
 * Se arma por etapas, en el orden real de montaje en una feria:
 *   1 tarima · 2 estructura de perfiles · 3 paneles · 4 gráfica e iluminación · 5 equipamiento.
 *
 * Piezas (59 sólidos):
 *   base       piso del pabellón (grilla de baldosas), tarima, alfombra, 2 perfiles de borde con tornillos
 *   estructura 7 parantes de aluminio, 2 travesaños superiores
 *   paneles    6 paneles de cerramiento
 *   gráfica    cartel de luz con franja roja y 2 grapas, pantalla con marco, 3 brazos + 3 proyectores
 *   equipos    3 estantes, 6 ménsulas, 9 productos, mostrador (cuerpo + tapa), banqueta (3), exhibidor de folletos (8)
 */

const W = 640;
const H = 470;
const SIZE = 300;
const TALL = 250;
const STAGES = ['Tarima', 'Estructura', 'Paneles', 'Gráfica e iluminación', 'Equipamiento'];

const P = k.fitProjection(
  [...k.boxCorners({ x: -30, y: -30, w: 360, d: 360, r: 0 }, -2, 0), ...k.boxCorners({ x: 0, y: 0, w: SIZE, d: SIZE, r: 0 }, 0, 292)],
  W,
  H,
  { pad: 22 },
);

const S = scene(P);
const { box, cyl, seg, dots, line, outline, put } = S;

/* ---------- base ---------- */
const FLOOR: k.Plan = { x: -30, y: -30, w: 360, d: 360, r: 0 };
const floorGrid: string[] = [];
for (let v = 0; v <= 360; v += 60) {
  floorGrid.push(k.lineOnTop([FLOOR.x + v, FLOOR.y], [FLOOR.x + v, FLOOR.y + FLOOR.d], 0, P));
  floorGrid.push(k.lineOnTop([FLOOR.x, FLOOR.y + v], [FLOOR.x + FLOOR.w, FLOOR.y + v], 0, P));
}
put(0, [0, 0, 0], <>{S.solid(k.slabOf(FLOOR, -2, 2, P, 1), { tone: 'faint', crease: 'none' })}{line(floorGrid.join(''), 'faint')}</>);

const DECK: k.Plan = { x: 0, y: 0, w: SIZE, d: SIZE, r: 2 };
put(1, [150, 150, 0], <>
  <path className="iso-halo" d={k.haloOf(DECK, 0, 6, P)} />
  {box(DECK, 0, 6, { tone: 'lo', bevel: 1.2 })}
  {line(k.planOutline(k.insetPlan(DECK, 5), 6, P, 3), 'faint')}
</>, { stage: 1 });
put(1.1, [150, 300, 0], <>
  {box({ x: 0, y: 296, w: 300, d: 4, r: 0.5 }, 0, 7, { tone: 'mid', bevel: 0.4 })}
  {dots([[6, 298, 7], [150, 298, 7], [294, 298, 7]], 0.55)}
</>, { stage: 1 });
put(1.1, [300, 150, 0], <>
  {box({ x: 296, y: 0, w: 4, d: 296, r: 0.5 }, 0, 7, { tone: 'mid', bevel: 0.4 })}
  {dots([[298, 6, 7], [298, 150, 7]], 0.55)}
</>, { stage: 1 });

/* ---------- estructura ---------- */
const POSTS: k.Plane[] = [[0, 0], [100, 0], [200, 0], [294, 0], [0, 100], [0, 200], [0, 294]];
for (const [x, y] of POSTS) {
  put(2, [x + 3, y + 3, 6], <>
    {box({ x, y, w: 6, d: 6, r: 1 }, 6, TALL - 12, { tone: 'mid', bevel: 0.3 })}
  </>, { stage: 2 });
}
put(4, [150, 3, 244], <>
  {box({ x: 0, y: 0, w: SIZE, d: 6, r: 0.5 }, TALL - 6, 6, { tone: 'mid', bevel: 0.4 })}
  {dots([[50, 6, TALL - 3], [150, 6, TALL - 3], [250, 6, TALL - 3]], 0.45, 'lo')}
</>, { stage: 2 });
put(4, [3, 150, 244], <>
  {box({ x: 0, y: 6, w: 6, d: SIZE - 6, r: 0.5 }, TALL - 6, 6, { tone: 'mid', bevel: 0.4 })}
  {dots([[6, 50, TALL - 3], [6, 150, TALL - 3], [6, 250, TALL - 3]], 0.45, 'lo')}
</>, { stage: 2 });

/* ---------- paneles ---------- */
const PANEL_H = TALL - 6 - 6;
for (const x0 of [6, 106, 206]) {
  const w = x0 === 206 ? 88 : 94;
  put(2, [x0 + w / 2, 3, 6], box({ x: x0, y: 1, w, d: 4, r: 0 }, 6, PANEL_H, { tone: 'mid', steps: 1 }), { stage: 3 });
}
for (const y0 of [6, 106, 206]) {
  const d = y0 === 206 ? 88 : 94;
  put(2, [3, y0 + d / 2, 6], box({ x: 1, y: y0, w: 4, d, r: 0 }, 6, PANEL_H, { tone: 'mid', steps: 1 }), { stage: 3 });
}

/* ---------- gráfica e iluminación ---------- */
// Cartel de luz sobre el travesaño (la pieza encendida de la figura)
const SIGN: k.Plan = { x: 74, y: 0, w: 152, d: 12, r: 1 };
put(5, [150, 6, TALL], <>
  {box(SIGN, TALL, 38, { tone: 'hi', lit: true, bevel: 0.8, inner: line(k.sideSeam(SIGN, TALL + 9, P, 3), 'red') })}
  <text
    className="iso-face-text"
    data-tone="hi"
    transform={k.sideMatrix([150, 12], TALL + 28, P, 'left')}
    fontSize={11}
    textAnchor="middle"
    fontWeight={800}
    style={{ fontFamily: 'Manrope, sans-serif' }}
  >
    control X
  </text>
</>, { stage: 4 });
for (const x of [96, 196]) {
  put(4.5, [x + 4, 6, TALL], box({ x, y: 2, w: 8, d: 12, r: 0.6 }, TALL - 2, 4, { tone: 'lo', bevel: 0.3 }), { stage: 4 });
}
// Pantalla colgada del panel del fondo
put(3, [150, 8, 120], <>
  {box({ x: 112, y: 5, w: 76, d: 3, r: 0.6 }, 118, 44, { tone: 'mid', bevel: 0.3 })}
  {outline([[116, 8, 122], [184, 8, 122], [184, 8, 158], [116, 8, 158]], 'lo')}
  {dots([[150, 8, 120]], 0.5, 'hi')}
</>, { stage: 4 });
// Brazos con proyectores sobre el travesaño
for (const x of [60, 150, 240]) {
  put(5.5, [x, 26, TALL], <>
    {box({ x: x - 1.5, y: 6, w: 3, d: 42, r: 0.4 }, TALL - 4, 3, { tone: 'mid', bevel: 0.2 })}
    {cyl(x, 46, 5, TALL - 20, 16, { tone: 'mid', steps: 20 })}
    {line(k.sideArc(x, 46, 5, TALL - 16, P, 16), 'faint')}
    {line(k.ring(x, 46, 2, TALL - 4, P, 14), 'lo')}
  </>, { stage: 4 });
}

// Gráfica impresa con la X de la marca sobre el panel lateral del frente
put(3, [5, 250, 120], <>
  {outline([[5, 214, 40], [5, 286, 40], [5, 286, 200], [5, 214, 200]], 'mid')}
  {seg([5, 214, 40], [5, 286, 200], 'lo')}
  {seg([5, 286, 40], [5, 214, 200], 'lo')}
</>, { stage: 4 });

/* ---------- equipamiento ---------- */
// Banner roll-up en la esquina delantera
put(6, [60, 268, 6], <>
  {box({ x: 30, y: 262, w: 60, d: 10, r: 2 }, 6, 6, { tone: 'lo', bevel: 0.4 })}
  {dots([[36, 272, 9], [84, 272, 9]], 0.45)}
  {box({ x: 34, y: 266, w: 52, d: 1.6, r: 0.2 }, 12, 176, { tone: 'hi', steps: 1, bevel: 0.2 })}
  {outline([[38, 267.6, 120], [82, 267.6, 120], [82, 267.6, 180], [38, 267.6, 180]], 'lo')}
  {seg([38, 267.6, 120], [82, 267.6, 180], 'faint')}
  {seg([82, 267.6, 120], [38, 267.6, 180], 'faint')}
</>, { stage: 5 });
// Estantes con ménsulas y productos sobre la pared lateral
for (const z of [96, 136, 176]) {
  for (const y of [122, 184]) {
    put(3, [12, y + 1, z - 12], box({ x: 5, y, w: 20, d: 2, r: 0.3 }, z - 14, 14, { tone: 'lo', steps: 1, bevel: 0 }), { stage: 5 });
  }
  put(3.1, [16, 155, z], box({ x: 5, y: 118, w: 26, d: 72, r: 1 }, z, 2.5, { tone: 'mid', bevel: 0.4 }), { stage: 5 });
  [0, 1, 2].forEach((i) => {
    const y = 126 + i * 22;
    const tall = [16, 12, 18][(i + z) % 3];
    put(3.2, [16, y + 7, z + 3], box({ x: 10, y, w: 14, d: 14, r: 1 }, z + 2.5, tall, { tone: 'hi', bevel: 0.4 }), { stage: 5 });
  });
}
// Mostrador de recepción
const COUNTER: k.Plan = { x: 186, y: 206, w: 88, d: 46, r: 2 };
const counterSeam = <>{line(k.sideSeam(COUNTER, 22, P, 3), 'faint')}{line(k.sideSeam(COUNTER, 82, P, 3), 'faint')}</>;
put(6, [230, 229, 6], <>
  <path className="iso-halo" d={k.haloOf(COUNTER, 6, 94, P)} />
  {box(COUNTER, 6, 94, { tone: 'mid', bevel: 0.5, inner: counterSeam })}
  {box({ x: 182, y: 202, w: 96, d: 54, r: 2 }, 100, 4, { tone: 'hi', bevel: 0.8 })}
  {line(k.planOutline({ x: 192, y: 210, w: 38, d: 26, r: 1 }, 104, P, 2), 'faint')}
</>, { stage: 5 });
// Banqueta
put(6, [150, 252, 6], <>
  {cyl(150, 252, 16, 6, 2, { tone: 'lo', steps: 32 })}
  {cyl(150, 252, 2.4, 8, 58, { tone: 'mid', steps: 16 })}
  {cyl(150, 252, 15, 66, 6, { tone: 'hi', steps: 32, bevel: 0.6 })}
</>, { stage: 5 });
// Exhibidor de folletos
put(6, [252, 92, 6], <>
  {box({ x: 238, y: 78, w: 28, d: 28, r: 2 }, 6, 2, { tone: 'lo', bevel: 0.3 })}
  {cyl(252, 82, 1.6, 8, 128, { tone: 'mid', steps: 14 })}
  {[64, 92, 120].map((z) => (
    <g key={z}>
      {box({ x: 240, y: 82, w: 24, d: 6, r: 0.6 }, z, 3, { tone: 'mid', bevel: 0.2 })}
      {box({ x: 243, y: 83.5, w: 18, d: 2, r: 0.2 }, z + 3, 16, { tone: 'hi', steps: 1, bevel: 0.2 })}
    </g>
  ))}
</>, { stage: 5 });

const ART = S.render();

/* ---------- vida: montaje por etapas ---------- */
const DROP = 70;

const sayFor = (n: number) => (n === 0 ? 'Etapa 0/5' : n === 5 ? 'Stand 3 × 3 m · listo' : `Etapa ${n}/5 · ${STAGES[n - 1]}`);

const StandFigure: React.FC = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const built = React.useRef(0); // etapas colocadas (0..5)
  const shown = React.useRef<number[]>(STAGES.map(() => 0));
  const clock = React.useRef(0);
  const manualUntil = React.useRef(0);
  const [readout, setReadout] = React.useState(sayFor(0));

  const step = React.useCallback(() => {
    built.current = built.current >= 5 ? 0 : built.current + 1;
    setReadout(sayFor(built.current));
  }, []);

  const tick = (dt: number, calm: boolean) => {
    const root = ref.current;
    if (!root) return true;
    if (calm && built.current !== 5) {
      built.current = 5;
      setReadout(sayFor(5));
    }
    clock.current += dt;
    const manual = performance.now() < manualUntil.current;
    if (!calm && !manual) {
      const wait = built.current === 5 ? 3.6 : built.current === 0 ? 0.8 : 1.15;
      if (clock.current > wait) {
        clock.current = 0;
        step();
      }
    }
    STAGES.forEach((_, i) => {
      const target = i < built.current ? 1 : 0;
      shown.current[i] = follow(shown.current[i], target, dt, target ? 0.22 : 0.12, calm);
      const v = shown.current[i];
      const lift = (1 - v) * DROP;
      root.querySelectorAll<SVGGElement>(`[data-stage="${i + 1}"]`).forEach((g) => {
        g.setAttribute('transform', lift > 0.05 ? k.translateAlong(P, [0, 0, lift]) : '');
        g.style.opacity = String(Math.min(1, v * 1.4));
      });
    });
    return !calm || shown.current.some((v) => v !== 1);
  };
  useLoop(tick, inView);

  const advance = () => {
    manualUntil.current = performance.now() + 6000;
    clock.current = 0;
    step();
  };

  return (
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      aria-label="Avanzar a la siguiente etapa de montaje"
      onClick={advance}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
          e.preventDefault();
          advance();
        }
      }}
      className="cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
    >
      <FigureCard
        fig="Fig. 1"
        title="Stand de esquina"
        hint="Clic: siguiente etapa"
        readout={readout}
        label="Stand de esquina de 3 por 3 metros que se arma por etapas: tarima, estructura de aluminio, paneles, cartel de luz y proyectores, y mobiliario."
        width={W}
        height={H}
        keys={[{ mark: 'lit', label: 'Cartel de luz' }, { mark: 'raised', label: 'Estructura y paneles' }, { mark: 'red', label: 'Color de marca' }]}
      >
        {ART}
      </FigureCard>
    </div>
  );
};

export default StandFigure;
