import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useScroll, useSpring, MotionValue } from 'framer-motion';
import { IMAGES } from '../src/constants/images';

/*
 * Logo que se transforma con el scroll (inspirado en 3libras.com.ar).
 *
 * En el inicio el logo se ve grande, con el slogan. Al bajar:
 *   1. el ▶ rojo recorre el slogan y lo va "cortando" (Ctrl+X),
 *   2. el ▶ sube y se funde dentro de la X,
 *   3. la X gira 180° mientras todo el logo viaja y se achica hasta el menú.
 * Todo está atado al scroll (con un resorte suave), así que al subir se rearma.
 *
 * El PNG del logo mide 953×255. Se recorta en piezas con "ventanas" del mismo PNG.
 */

const LOGO_W = 953;
const LOGO_H = 255;
const TOP_H = 168; // alto de la línea "control X" sin el slogan
const NAV_H = 64; // alto del menú cuando está compacto (h-16)

interface Piece { x: number; y: number; w: number; h: number }
const PIECES: Record<'word' | 'x' | 'tri' | 'tag', Piece> = {
  word: { x: 0, y: 0, w: 778, h: 172 },
  x: { x: 786, y: 0, w: 168, h: 168 }, // centrada sobre la X para que gire sobre su eje
  tri: { x: 0, y: 186, w: 44, h: 69 },
  tag: { x: 44, y: 186, w: 909, h: 69 },
};

// Recorridos (en px del logo original)
const TRI_RUN = 905; // cuánto avanza el ▶ sobre el slogan
const TRI_TO_X = { x: 848, y: -136.5 }; // del centro del ▶ al centro de la X

/** Cuántos px de scroll dura la transformación. Lo usa también el menú. */
export const logoScrollRange = () => Math.min(window.innerHeight * 0.55, 480);
/** Punto de la transformación en el que el menú pasa a tener fondo. */
export const NAV_SOLID_AT = 0.8;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

interface Geo { hx: number; hy: number; hs: number; nx: number; ny: number; ns: number; range: number }

const Sprite: React.FC<{
  piece: Piece;
  light: MotionValue<number>;
  style?: React.ComponentProps<typeof motion.div>['style'];
}> = ({ piece, light, style }) => (
  <motion.div
    className="absolute overflow-hidden"
    style={{ left: piece.x, top: piece.y, width: piece.w, height: piece.h, ...style }}
  >
    <img
      src={IMAGES.logo.dark}
      alt=""
      draggable={false}
      className="absolute max-w-none select-none"
      style={{ left: -piece.x, top: -piece.y, width: LOGO_W, height: LOGO_H }}
    />
    <motion.img
      src={IMAGES.logo.light}
      alt=""
      draggable={false}
      className="absolute max-w-none select-none"
      style={{ left: -piece.x, top: -piece.y, width: LOGO_W, height: LOGO_H, opacity: light }}
    />
  </motion.div>
);

const ScrollLogo: React.FC = () => {
  const geo = useRef<Geo | null>(null);
  const [ready, setReady] = useState(false);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  const isDarkRef = useRef(isDark);

  const { scrollY } = useScroll();
  const raw = useMotionValue(0);
  const progress = useSpring(raw, { stiffness: 170, damping: 28, mass: 0.45 });

  // Valores animados
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  const filter = useMotionValue('none');
  const light = useMotionValue(0);
  const triX = useMotionValue(0);
  const triY = useMotionValue(0);
  const triScale = useMotionValue(1);
  const triRotate = useMotionValue(0);
  const triOpacity = useMotionValue(1);
  const tagClip = useMotionValue('inset(0% 0% 0% 0%)');
  const xRotate = useMotionValue(0);
  const xScale = useMotionValue(1);

  const apply = useCallback((p: number) => {
    const g = geo.current;
    if (!g) return;

    // 1. El ▶ recorre el slogan y lo corta
    const a = easeInOut(seg(p, 0, 0.36));
    const run = a * TRI_RUN;
    const cut = clamp01((run - 7) / PIECES.tag.w) * 100;
    tagClip.set(`inset(0% 0% 0% ${cut}%)`);

    // 2. El ▶ sube y se funde en la X
    const b = easeInOut(seg(p, 0.36, 0.7));
    triX.set(lerp(run, TRI_TO_X.x, b));
    triY.set(lerp(0, TRI_TO_X.y, b));
    triScale.set(lerp(1, 0.25, b));
    triRotate.set(lerp(0, -90, b));
    triOpacity.set(1 - seg(p, 0.6, 0.72));

    // 3. La X gira y "late" al recibir el ▶
    const c = seg(p, 0.45, 1);
    xRotate.set(easeInOut(c) * 180);
    xScale.set(1 + Math.sin(Math.PI * c) * 0.14);

    // Todo el logo viaja del inicio al menú. Arranca pegado al contenido del inicio
    // (sube a la par del scroll) y se achica rápido, para no taparle las frases.
    const m = easeOut(p);
    const trackY = Math.max(g.hy - window.scrollY, g.ny);
    x.set(lerp(g.hx, g.nx, m));
    y.set(lerp(trackY, g.ny, m));
    scale.set(lerp(g.hs, g.ns, m));
    filter.set(`drop-shadow(0 6px 28px rgba(0,0,0,${(0.45 * (1 - easeOut(p))).toFixed(3)}))`);

    // En modo claro, al llegar al menú blanco pasa a la versión negra
    light.set(isDarkRef.current ? 0 : seg(p, NAV_SOLID_AT - 0.1, NAV_SOLID_AT + 0.08));
  }, [filter, light, scale, tagClip, triOpacity, triRotate, triScale, triX, triY, x, xRotate, xScale, y]);

  const measure = useCallback(() => {
    const h = document.getElementById('hero-logo-anchor');
    const n = document.getElementById('nav-logo-anchor');
    if (!h || !n) return;
    const hr = h.getBoundingClientRect();
    const nr = n.getBoundingClientRect();
    geo.current = {
      hx: hr.left,
      hy: hr.top + window.scrollY,
      hs: hr.width / LOGO_W,
      nx: nr.left,
      ny: (NAV_H - nr.height) / 2,
      ns: nr.height / TOP_H,
      range: logoScrollRange(),
    };
    raw.set(clamp01(window.scrollY / geo.current.range));
    apply(progress.get());
    setReady(true);
  }, [apply, progress, raw]);

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    const h = document.getElementById('hero-logo-anchor');
    const n = document.getElementById('nav-logo-anchor');
    if (h) ro.observe(h);
    if (n) ro.observe(n);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

  useEffect(() => scrollY.on('change', (v) => {
    if (!geo.current) return;
    raw.set(clamp01(v / geo.current.range));
    apply(progress.get()); // el seguimiento vertical usa el scroll real, sin resorte
  }), [apply, progress, raw, scrollY]);

  useEffect(() => progress.on('change', apply), [apply, progress]);

  // Seguir el cambio de tema claro/oscuro
  useEffect(() => {
    const obs = new MutationObserver(() => {
      const d = document.documentElement.classList.contains('dark');
      isDarkRef.current = d;
      setIsDark(d);
      apply(progress.get());
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, [apply, progress]);

  return (
    <motion.div
      aria-hidden
      data-theme={isDark ? 'dark' : 'light'}
      className="pointer-events-none fixed left-0 top-0 z-[45] origin-top-left will-change-transform"
      style={{ width: LOGO_W, height: LOGO_H, x, y, scale, filter, opacity: ready ? 1 : 0 }}
    >
      <Sprite piece={PIECES.word} light={light} />
      <Sprite piece={PIECES.x} light={light} style={{ rotate: xRotate, scale: xScale }} />
      <Sprite piece={PIECES.tag} light={light} style={{ clipPath: tagClip }} />
      <Sprite
        piece={PIECES.tri}
        light={light}
        style={{ x: triX, y: triY, scale: triScale, rotate: triRotate, opacity: triOpacity }}
      />
    </motion.div>
  );
};

export default ScrollLogo;
