import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { PROJECTS } from '../src/constants/images';
import SectionTitle from './SectionTitle';

/*
 * Carrusel de proyectos: una cinta de fotos centrada en la activa.
 * - Cada foto conserva su proporción (verticales y horizontales conviven sin recortes).
 * - La activa está a color y a tamaño completo; las vecinas, más chicas, en grises y atenuadas.
 * - Es infinito: la lista se repite tres veces y, al salir de la copia del medio, se recoloca sin animación.
 * - Avanza solo cada 5 s (se pausa con el mouse encima, con foco o fuera de pantalla).
 */

const N = PROJECTS.length;
const LOOP = [...PROJECTS, ...PROJECTS, ...PROJECTS];
const AUTOPLAY_MS = 5000;
const EASE: [number, number, number, number] = [0.65, 0, 0.35, 1];
const SLIDE_S = 1.05;

// Tono común para unificar fotos de distintas cámaras y luces: menos saturación, algo más de contraste y un toque cálido
const TONE = 'saturate(0.8) contrast(1.07) sepia(0.07)';
const ON = `grayscale(0) brightness(0.96) ${TONE}`;
const OFF = `grayscale(1) brightness(0.62) ${TONE}`;

const Portfolio: React.FC = () => {
  const viewport = useRef<HTMLDivElement>(null);
  const section = useRef<HTMLElement>(null);
  const inView = useInView(section, { margin: '-20% 0px -20% 0px' });
  const [width, setWidth] = useState(1200);
  const [pos, setPos] = useState(N); // posición en LOOP (empieza en la copia del medio)
  const [instant, setInstant] = useState(false);
  const [hover, setHover] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const drag = useRef<{ x: number; t: number } | null>(null);
  const swiped = useRef(false);

  // Medidas: alto de la cinta según el ancho disponible
  useLayoutEffect(() => {
    const el = viewport.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const phone = width < 640;
  const height = Math.round(Math.min(560, Math.max(240, width * (phone ? 0.72 : 0.42))));
  const gap = phone ? 12 : 24;
  const maxW = width * (phone ? 0.86 : 0.7);
  const widths = LOOP.map((p) => Math.min(maxW, (height * p.w) / p.h));
  const lefts: number[] = [];
  widths.reduce((acc, w, i) => {
    lefts[i] = acc;
    return acc + w + gap;
  }, 0);
  const x = width / 2 - (lefts[pos] + widths[pos] / 2);

  const active = ((pos % N) + N) % N;

  const go = useCallback((delta: number) => {
    setInstant(false);
    setPos((p) => p + delta);
  }, []);

  // Al terminar el deslizamiento, si salimos de la copia del medio, recolocamos sin animación
  const settle = () => {
    if (pos < N || pos >= 2 * N) {
      setInstant(true);
      setPos(active + N);
    }
  };
  useEffect(() => {
    if (!instant) return;
    const id = requestAnimationFrame(() => setInstant(false));
    return () => cancelAnimationFrame(id);
  }, [instant]);

  // Avance automático
  useEffect(() => {
    if (!inView || hover || lightbox !== null) return;
    const id = window.setTimeout(() => go(1), AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [pos, inView, hover, lightbox, go]);

  // Teclado en la pantalla completa
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowRight') setLightbox((i) => (i === null ? i : (i + 1) % N));
      if (e.key === 'ArrowLeft') setLightbox((i) => (i === null ? i : (i - 1 + N) % N));
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightbox]);

  // Deslizar con el dedo o arrastrar con el mouse
  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { x: e.clientX, t: performance.now() };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const start = drag.current;
    drag.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    swiped.current = Math.abs(dx) > 45;
    if (swiped.current) go(dx < 0 ? 1 : -1);
  };

  return (
    <section ref={section} id="portfolio" className="py-24 bg-white dark:bg-brand-dark transition-colors duration-300 overflow-hidden">
      <div className="container mx-auto px-6">
        {/* El margen inferior lo pone este contenedor, así el botón queda alineado con la base del título */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 md:mb-16 [&>div]:mb-0">
          <SectionTitle subtitle="Nuestro Trabajo" title="Nuestros proyectos" />
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-block px-6 py-3 border-2 border-brand-dark dark:border-white text-brand-dark dark:text-white font-bold uppercase hover:bg-brand-dark hover:text-white dark:hover:bg-white dark:hover:text-brand-dark transition-all duration-300"
          >
            Ver más proyectos
          </a>
        </div>
      </div>

      {/* Cinta de fotos, a todo el ancho */}
      <div
        ref={viewport}
        role="region"
        aria-roledescription="carrusel"
        aria-label="Proyectos realizados"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') go(1);
          if (e.key === 'ArrowLeft') go(-1);
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        className="relative w-full select-none outline-none touch-pan-y"
        style={{ height }}
      >
        <motion.div
          className="absolute left-0 top-0 flex h-full"
          style={{ gap }}
          animate={{ x }}
          transition={instant ? { duration: 0 } : { duration: SLIDE_S, ease: EASE }}
          onAnimationComplete={settle}
        >
          {LOOP.map((p, i) => {
            const isActive = i === pos;
            const near = Math.abs(i - pos) === 1;
            return (
              <motion.button
                type="button"
                key={i}
                aria-label={isActive ? `Ver el proyecto ${(i % N) + 1} en pantalla completa` : `Ir al proyecto ${(i % N) + 1}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => {
                  if (swiped.current) {
                    swiped.current = false;
                    return;
                  }
                  if (isActive) setLightbox(i % N);
                  else go(i - pos);
                }}
                className="group relative h-full flex-shrink-0 overflow-hidden bg-zinc-900 outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                style={{ width: widths[i], transformOrigin: 'center center' }}
                animate={{
                  scale: isActive ? 1 : 0.86,
                  opacity: isActive ? 1 : near ? 0.55 : 0.25,
                  filter: isActive ? ON : OFF,
                }}
                transition={instant ? { duration: 0 } : { duration: SLIDE_S, ease: EASE }}
              >
                <motion.img
                  src={p.src}
                  alt={`Proyecto de Control X ${(i % N) + 1} de ${N}`}
                  draggable={false}
                  loading={Math.abs(i - pos) <= 3 ? 'eager' : 'lazy'}
                  decoding="async"
                  className="h-full w-full object-cover"
                  // la foto activa se acerca despacio mientras se muestra
                  animate={{ scale: isActive ? 1 : 1.08 }}
                  transition={isActive ? { duration: AUTOPLAY_MS / 1000 + 1.5, ease: 'easeOut' } : { duration: SLIDE_S, ease: EASE }}
                />
                {/* Viñeta suave: oscurece apenas los bordes, igual en todas las fotos */}
                <span aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.35)_100%)]" />
                {isActive && (
                  <span className="pointer-events-none absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                    <Maximize2 size={16} />
                  </span>
                )}
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      {/* Pie: número de foto, progreso y controles (sin nombres de marcas) */}
      <div className="container mx-auto px-6">
        <div className="mt-8 flex items-center justify-between gap-6">
          <p className="font-mono text-sm tabular-nums text-gray-500" aria-live="polite">
            <span className="text-2xl font-bold text-brand-dark dark:text-white">{String(active + 1).padStart(2, '0')}</span>
            <span className="ml-2 text-gray-400 dark:text-gray-600">/ {String(N).padStart(2, '0')}</span>
          </p>
          <div className="flex flex-shrink-0 items-center gap-5">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Proyecto anterior"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-brand-dark/20 text-brand-dark transition-colors hover:border-brand-orange hover:bg-brand-orange hover:text-white dark:border-white/20 dark:text-white"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Proyecto siguiente"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-brand-dark/20 text-brand-dark transition-colors hover:border-brand-orange hover:bg-brand-orange hover:text-white dark:border-white/20 dark:text-white"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>
        {/* Barra de progreso: un tramo por proyecto, el activo se llena mientras se muestra */}
        <div className="mt-6 flex gap-1.5">
          {PROJECTS.map((p, i) => (
            <button
              key={p.src}
              type="button"
              aria-label={`Ir al proyecto ${i + 1}`}
              onClick={() => go(i - active)}
              className="group flex h-5 flex-1 items-center"
            >
              <span className="relative block h-[2px] w-full overflow-hidden bg-brand-dark/10 dark:bg-white/15">
                {i === active ? (
                  <motion.span
                    key={`fill-${pos}-${hover}-${inView}`}
                    className="absolute inset-0 origin-left bg-brand-orange"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: hover || !inView ? 0 : 1 }}
                    transition={{ duration: AUTOPLAY_MS / 1000, ease: 'linear' }}
                  />
                ) : (
                  <span className="absolute inset-0 bg-brand-dark/30 opacity-0 transition-opacity group-hover:opacity-100 dark:bg-white/40" />
                )}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Pantalla completa */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-xl md:p-12"
            role="dialog"
            aria-modal="true"
            aria-label={`Proyecto ${lightbox + 1} de ${N}`}
          >
            <button type="button" className="absolute right-6 top-6 text-white/60 transition-colors hover:text-white" onClick={() => setLightbox(null)} aria-label="Cerrar">
              <X size={36} />
            </button>
            <AnimatePresence mode="wait">
              <motion.figure
                key={lightbox}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="flex max-h-full flex-col items-center"
                onClick={(e) => e.stopPropagation()}
              >
                <img src={PROJECTS[lightbox].src} alt={`Proyecto de Control X ${lightbox + 1} de ${N}`} className="max-h-[80vh] w-auto max-w-full object-contain" style={{ filter: ON }} />
                <figcaption className="mt-5 flex w-full justify-end text-white">
                  <span className="font-mono text-sm text-white/50">
                    {String(lightbox + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((i) => (i === null ? i : (i - 1 + N) % N));
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/5 p-3 text-white backdrop-blur-md transition-colors hover:bg-white/10"
              aria-label="Anterior"
            >
              <ChevronLeft size={32} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((i) => (i === null ? i : (i + 1) % N));
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/5 p-3 text-white backdrop-blur-md transition-colors hover:bg-white/10"
              aria-label="Siguiente"
            >
              <ChevronRight size={32} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Portfolio;
