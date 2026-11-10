import * as React from 'react';
import * as k from '../iso/iso-kit';
import { follow, useInView, useLoop } from '../iso/react/live';
import { scene } from './scene';
import { FigureCard } from './FigureCard';

/*
 * Fig. 4 — Set de TV con parrilla de luces motorizada (1 = 1 cm).
 * La parrilla cuelga de dos motores de cadena montados en una viga de techo sobre dos torres.
 * Baja a 1,70 m para cargar y enfocar los tachos, y sube a 3,00 m para la grabación.
 *
 * Piezas (64 sólidos):
 *   piso       piso del estudio
 *   fondo      3 bastidores con gráfica (aro y franja)
 *   tarima     4 módulos de 2 × 1 m, escalera de 3 escalones
 *   torres     2 × (4 parantes, placa base con bulones, manguito superior)
 *   techo      viga reticulada fija (4 cordones, 2 placas), 2 motores con gancho
 *   parrilla   viga reticulada que se mueve (4 cordones, 2 placas), 5 tachos con horquilla (piezas encendidas)
 *   set        2 sillones (asiento, respaldo, 2 apoyabrazos), mesa ratona (tapa y pie)
 *   cámara     trípode, cabezal, cuerpo, lente, visor y manija
 */

const W = 640;
const H = 520;
const LOW = 170;
const SHOW = 300;
const TRUSS = 30; // sección de las vigas reticuladas
const TY = 15; // las vigas y torres van en y 15..45
const HEADER_Z = 380;
const MOTORS = [70, 330];
const CANS = [40, 120, 200, 280, 360];

const P = k.fitProjection(
  [...k.boxCorners({ x: -100, y: -10, w: 600, d: 430, r: 0 }, 0, 0), ...k.boxCorners({ x: -70, y: 0, w: 540, d: 45, r: 0 }, 0, HEADER_Z + TRUSS)],
  W,
  H,
  { pad: 24 },
);

const S = scene(P);
const { box, cyl, seg, dots, line, outline, put, at } = S;

/** Viga reticulada horizontal a lo largo de x: 4 cordones, celosía en las caras visibles y placas en los extremos. */
function trussX(x0: number, x1: number, z0: number, tone: 'mid' | 'hi' = 'mid', lit = false) {
  const y0 = TY;
  const y1 = TY + TRUSS;
  const c = 3;
  const chord = (y: number, z: number) => box({ x: x0 + c, y, w: x1 - x0 - 2 * c, d: c, r: 0.6 }, z, c, { tone, lit, steps: 2, bevel: 0.2 });
  const lacing = (face: 'top' | 'front') => {
    const pts: k.Point3[] = [];
    let up = false;
    for (let x = x0 + c; x <= x1 - c + 0.1; x += 20) {
      pts.push(face === 'top' ? [x, up ? y1 - c / 2 : y0 + c / 2, z0 + TRUSS - c / 2] : [x, y1 - c / 2, up ? z0 + TRUSS - c / 2 : z0 + c / 2]);
      up = !up;
    }
    return line(k.pathOf(pts.map(at)), 'lo');
  };
  return (
    <>
      {box({ x: x0, y: y0, w: c, d: TRUSS, r: 0.4 }, z0, TRUSS, { tone: 'lo', steps: 1 })}
      {chord(y0, z0)}
      {/* la celosía va antes que los cordones: sus extremos quedan debajo de ellos */}
      {lacing('top')}
      {lacing('front')}
      {chord(y0, z0 + TRUSS - c)}
      {chord(y1 - c, z0)}
      {chord(y1 - c, z0 + TRUSS - c)}
      {box({ x: x1 - c, y: y0, w: c, d: TRUSS, r: 0.4 }, z0, TRUSS, { tone: 'lo', steps: 1 })}
    </>
  );
}

/** Torre reticulada vertical: placa base, 4 parantes con celosía en las caras visibles y manguito arriba. */
function tower(x0: number) {
  const x1 = x0 + TRUSS;
  const y0 = TY;
  const y1 = TY + TRUSS;
  const c = 3;
  const top = HEADER_Z - 20;
  const post = (x: number, y: number) => box({ x, y, w: c, d: c, r: 0.6 }, 4, top - 4, { tone: 'mid', steps: 2, bevel: 0.2 });
  const zig = (a: k.Plane, b: k.Plane) => {
    const pts: k.Point3[] = [];
    let left = true;
    for (let z = 8; z <= top - 6; z += 22) {
      const [x, y] = left ? a : b;
      pts.push([x, y, z]);
      left = !left;
    }
    return line(k.pathOf(pts.map(at)), 'lo');
  };
  const BASE: k.Plan = { x: x0 - 15, y: y0 - 15, w: TRUSS + 30, d: TRUSS + 30, r: 2 };
  return (
    <>
      <path className="iso-halo" d={k.haloOf(BASE, 0, 4, P)} />
      {box(BASE, 0, 4, { tone: 'lo', bevel: 0.5 })}
      {dots(k.corners(BASE, 6).map(([x, y]) => [x, y, 4] as k.Point3), 0.6, 'mid')}
      {post(x0, y0)}
      {/* la celosía va antes que los parantes de adelante: sus extremos quedan debajo */}
      {zig([x1 - c / 2, y0 + c / 2], [x1 - c / 2, y1 - c / 2])}
      {zig([x0 + c / 2, y1 - c / 2], [x1 - c / 2, y1 - c / 2])}
      {post(x1 - c, y0)}
      {post(x0, y1 - c)}
      {post(x1 - c, y1 - c)}
      {box({ x: x0 - 2, y: y0 - 2, w: TRUSS + 4, d: TRUSS + 4, r: 1 }, top, HEADER_Z - top, { tone: 'mid', bevel: 0.5 })}
    </>
  );
}

/* ---------- piso y fondo ---------- */
put(0, [0, 0, 0], S.solid(k.slabOf({ x: -100, y: -10, w: 600, d: 430, r: 0 }, -1, 1, P, 1), { tone: 'faint', crease: 'none' }));
[0, 1, 2].forEach((i) => {
  const x = (i * 400) / 3;
  const w = 400 / 3;
  put(1, [x + w / 2, 4, 0], <>
    {box({ x, y: 0, w, d: 8, r: 0 }, 0, 320, { tone: 'mid', steps: 1, inner: line(k.sideSeam({ x, y: 0, w, d: 8, r: 0 }, 230, P, 1), 'faint') })}
  </>);
});
put(1.1, [200, 8, 200], <>
  {line(k.sideRing([200, 8, 160], 78, 'y', P, 64), 'mid')}
  {line(k.sideRing([200, 8, 160], 58, 'y', P, 64), 'lo')}
</>);

/* ---------- torre izquierda (detrás de la parrilla) ---------- */
put(1.5, [-55, 30, 0], tower(-70));

/* ---------- tarima y escalera ---------- */
for (const [x, y] of [[0, 60], [200, 60], [0, 160], [200, 160]] as k.Plane[]) {
  const plan: k.Plan = { x, y, w: 200, d: 100, r: 0.5 };
  put(2, [x + 100, y + 50, 0], box(plan, 0, 60, { tone: 'lo', steps: 1, bevel: 0.6, inner: line(k.sideSeam(plan, 52, P, 1), 'faint') }));
}
[[260, 20, 45], [280, 20, 30], [300, 20, 15]].forEach(([y, d, h], i) => {
  put(2.5 + i * 0.01, [340, y + d / 2, 0], box({ x: 300, y, w: 80, d, r: 0.4 }, 0, h, { tone: 'mid', steps: 1, bevel: 0.4 }));
});

/* ---------- set: sillones y mesa ratona ---------- */
function armchair(x: number) {
  const z = 60;
  return (
    <>
      <path className="iso-halo" d={k.haloOf({ x, y: 140, w: 52, d: 52, r: 4 }, z, 30, P)} />
      {box({ x, y: 140, w: 52, d: 12, r: 3 }, z, 70, { tone: 'mid', bevel: 0.8 })}
      {box({ x, y: 152, w: 8, d: 40, r: 2 }, z, 42, { tone: 'mid', bevel: 0.6 })}
      {box({ x: x + 8, y: 152, w: 36, d: 40, r: 3 }, z, 28, { tone: 'hi', bevel: 0.8 })}
      {box({ x: x + 44, y: 152, w: 8, d: 40, r: 2 }, z, 42, { tone: 'mid', bevel: 0.6 })}
    </>
  );
}
put(3, [126, 166, 60], armchair(100));
put(3, [276, 166, 60], armchair(250));
put(3, [200, 185, 60], <>
  {cyl(200, 185, 5, 60, 34, { tone: 'mid', steps: 20 })}
  {cyl(200, 185, 20, 94, 3, { tone: 'hi', steps: 40, bevel: 0.6 })}
</>);

/* ---------- techo: viga fija y motores ---------- */
put(3.6, [200, 30, HEADER_Z], trussX(-70, 470, HEADER_Z));
MOTORS.forEach((x) =>
  put(3.7, [x, 30, HEADER_Z - 30], <>
    {box({ x: x - 9, y: 21, w: 18, d: 18, r: 2 }, HEADER_Z - 28, 28, { tone: 'mid', bevel: 0.6, inner: line(k.sideSeam({ x: x - 9, y: 21, w: 18, d: 18, r: 2 }, HEADER_Z - 12, P, 3), 'faint') })}
    {cyl(x, 30, 3, HEADER_Z - 34, 6, { tone: 'lo', steps: 16 })}
  </>),
);

/* ---------- parrilla móvil (se arma en z = 0 y se traslada) ---------- */
const RIG = scene(P);
RIG.put(0, [200, 30, 0], trussX(-20, 420, 0, 'hi', false));
MOTORS.forEach((x) => RIG.put(1, [x, 30, TRUSS], RIG.box({ x: x - 4, y: 26, w: 8, d: 8, r: 1 }, TRUSS, 5, { tone: 'lo', steps: 2 })));
CANS.forEach((x) =>
  RIG.put(-1, [x, 30, -30], <>
    {RIG.box({ x: x - 1, y: 22, w: 2, d: 16, r: 0.3 }, -14, 14, { tone: 'mid', steps: 1 })}
    {RIG.cyl(x, 30, 7, -30, 16, { tone: 'hi', lit: true, steps: 28, bevel: 0.4 })}
    {RIG.line(k.sideArc(x, 30, 7, -24, P, 18), 'faint')}
  </>),
);
const RIG_ART = RIG.render();

/* ---------- torre derecha (delante de la parrilla) y cámara ---------- */
put(5, [455, 30, 0], tower(440));

const CAM: k.Point3 = [220, 390, 118];
const FEET: k.Plane[] = [[186, 414], [254, 414], [220, 350]];
const legs = FEET.map(([x, y]) => k.segment([x, y, 0], [CAM[0], CAM[1], CAM[2]], P));
put(6, [220, 390, 0], <>
  {line(legs.join(''), 'mid')}
  {dots(FEET.map(([x, y]) => [x, y, 0] as k.Point3), 1.3, 'mid')}
  {box({ x: 208, y: 378, w: 24, d: 24, r: 2 }, 118, 8, { tone: 'mid', bevel: 0.4 })}
  {box({ x: 211, y: 352, w: 18, d: 40, r: 2 }, 126, 22, { tone: 'mid', bevel: 0.6, inner: line(k.sideSeam({ x: 211, y: 352, w: 18, d: 40, r: 2 }, 137, P, 3), 'faint') })}
  {box({ x: 214, y: 340, w: 12, d: 12, r: 1.5 }, 130, 14, { tone: 'lo', bevel: 0.4 })}
  {box({ x: 222, y: 384, w: 6, d: 10, r: 1 }, 148, 7, { tone: 'lo', bevel: 0.3 })}
  {box({ x: 218, y: 402, w: 4, d: 30, r: 1 }, 121, 3, { tone: 'lo', steps: 2 })}
</>);

const BACK = S.render(-Infinity, 3.8);
const FRONT = S.render(3.8);

/* ---------- vida ---------- */
const SPEED = 60; // cm/s en pantalla (los motores reales van a ~6,7 cm/s; acá se acelera para verlo)

const StageFigure: React.FC = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const rig = React.useRef<SVGGElement>(null);
  const chains = React.useRef<SVGPathElement>(null);
  const inView = useInView(ref);
  const height = React.useRef(SHOW);
  const target = React.useRef(SHOW);
  const hold = React.useRef(0);
  const manualUntil = React.useRef(0);
  const [readout, setReadout] = React.useState('Parrilla a 3,00 m');

  const chainPath = (h: number) => MOTORS.map((x) => k.segment([x, 30, HEADER_Z - 34], [x, 30, h + TRUSS + 5], P)).join('');

  const tick = (dt: number, calm: boolean) => {
    if (calm) target.current = SHOW;
    const manual = performance.now() < manualUntil.current;
    const diff = target.current - height.current;
    if (calm) height.current = target.current;
    else if (Math.abs(diff) > 0.5) height.current += Math.sign(diff) * Math.min(Math.abs(diff), SPEED * dt * Math.min(1, 0.25 + Math.abs(diff) / 40));
    else {
      height.current = target.current;
      hold.current += dt;
      if (!manual && hold.current > (target.current === SHOW ? 3.4 : 2.2)) {
        hold.current = 0;
        target.current = target.current === SHOW ? LOW : SHOW;
      }
    }
    const h = height.current;
    rig.current?.setAttribute('transform', k.translateAlong(P, [0, 0, h]));
    chains.current?.setAttribute('d', chainPath(h));
    const moving = Math.abs(target.current - h) > 0.5;
    const metres = (h / 100).toFixed(2).replace('.', ',');
    const text = moving ? `Parrilla a ${metres} m · ${target.current > h ? 'subiendo' : 'bajando'}` : `Parrilla a ${metres} m · ${h === LOW ? 'carga' : 'show'}`;
    setReadout((r) => (r === text ? r : text));
    return !calm;
  };
  useLoop(tick, inView);

  const toggle = () => {
    manualUntil.current = performance.now() + 8000;
    hold.current = 0;
    target.current = target.current === SHOW ? LOW : SHOW;
  };

  return (
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      aria-label="Subir o bajar la parrilla de luces"
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
          e.preventDefault();
          toggle();
        }
      }}
      className="cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
    >
      <FigureCard
        fig="Fig. 4"
        title="Set de TV"
        hint="Clic: subir / bajar parrilla"
        readout={readout}
        label="Set de televisión sobre tarima modular, con telón de fondo, dos sillones, mesa ratona, cámara en trípode y una parrilla de luces que cuelga de dos motores de cadena y sube y baja entre 1,70 y 3 metros."
        width={W}
        height={H}
        keys={[{ mark: 'lit', label: 'Tachos de luz' }, { mark: 'raised', label: 'Escenografía y estructura' }, { mark: 'dotted', label: 'Cadenas' }]}
      >
        {BACK}
        <path ref={chains} className="iso-line" data-tone="mid" data-dotted="" d={chainPath(SHOW)} />
        <g ref={rig} transform={k.translateAlong(P, [0, 0, SHOW])}>
          {RIG_ART}
        </g>
        {FRONT}
      </FigureCard>
    </div>
  );
};

export default StageFigure;
