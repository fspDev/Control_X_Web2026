import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { IMAGES, HeroImage } from '../src/constants/images';

/* ------------------------------------------------------------------ */
/*  Contenido del slider                                               */
/* ------------------------------------------------------------------ */

interface Slide {
  img: HeroImage;
  label: string;
  text: string;
  /** Parte de la frase que se "selecciona" en rojo (debe estar dentro de text). */
  highlight: string;
}

const SLIDES: Slide[] = [
  { img: IMAGES.hero.ceva, label: '+20 años de trayectoria', text: 'Dos décadas convirtiendo buenas ideas en espacios memorables.', highlight: 'espacios memorables.' },
  { img: IMAGES.hero.johnnie, label: 'Impacto visual', text: 'Espacios que se ven desde lejos y se recuerdan de cerca.', highlight: 'se recuerdan' },
  { img: IMAGES.hero.dispocel, label: 'Diseño propio', text: 'Cada stand nace en nuestro estudio y se construye en nuestro taller.', highlight: 'nuestro taller.' },
  { img: IMAGES.hero.bertotto, label: 'De principio a fin', text: 'Acompañamos cada proyecto, del primer boceto a la instalación final.', highlight: 'instalación final.' },
  { img: IMAGES.hero.cluster, label: 'Soluciones integrales', text: 'Stands, exhibidores, material POP y escenografías bajo un mismo techo.', highlight: 'un mismo techo.' },
  { img: IMAGES.hero.vetanco, label: 'Experiencias de marca', text: 'Transformamos metros cuadrados en experiencias que venden.', highlight: 'venden.' },
  { img: IMAGES.hero.clusterOil, label: 'Cobertura nacional', text: 'Llegamos a cada feria, congreso y evento del país.', highlight: 'cada feria,' },
  { img: IMAGES.hero.gerbaudo, label: 'Tecnología de vanguardia', text: 'Fabricación de precisión, con cada detalle bajo control.', highlight: 'bajo control.' },
  { img: IMAGES.hero.dayco, label: 'Al servicio de las marcas', text: 'Ayudamos a las marcas a destacarse en ferias, congresos y eventos.', highlight: 'destacarse' },
];

const SLIDE_MS = 5500;
const EASE_CUT: [number, number, number, number] = [0.77, 0, 0.175, 1];
const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
const EASE_SOFT: [number, number, number, number] = [0.6, 0, 0.2, 1];

/* ------------------------------------------------------------------ */
/*  Transiciones entre fotos (se van turnando)                         */
/*  panels → la foto se arma con paneles que giran en 3D, como los     */
/*           paneles de un stand que se van montando                   */
/*  depth  → la foto anterior se aleja y la nueva llega desde adelante */
/*  cut    → dos mitades en diagonal se deslizan y encastran (Ctrl+X)  */
/* ------------------------------------------------------------------ */

type Variant = 'panels' | 'depth' | 'cut';
const VARIANTS: Variant[] = ['panels', 'depth', 'cut'];
const TRANSITION_S: Record<Variant, number> = { panels: 1.15, depth: 1, cut: 1.05 };

const PANELS = 6;
const PANEL_STAGGER = 0.07;
const PANEL_S = TRANSITION_S.panels - PANEL_STAGGER * (PANELS - 1);

const CUT_HALVES = [
  { clip: 'polygon(0% 0%, 58.2% 0%, 42.2% 100%, 0% 100%)', from: '-100%' },
  { clip: 'polygon(58% 0%, 100% 0%, 100% 100%, 42% 100%)', from: '100%' },
];

/** Qué hace la foto que se va, según la transición. */
const OUTGOING: Record<Variant, { scale: number; dim: number }> = {
  panels: { scale: 1, dim: 0.5 },
  depth: { scale: 0.93, dim: 0.55 },
  cut: { scale: 1.05, dim: 0.4 },
};

const SlideImg: React.FC<{ img: HeroImage; decorative?: boolean }> = ({ img, decorative }) => (
  <img
    src={img.src}
    alt={decorative ? '' : img.alt}
    aria-hidden={decorative || undefined}
    draggable={false}
    decoding="async"
    className="absolute inset-0 h-full w-full max-w-none select-none object-cover"
    style={{ objectPosition: img.position ?? '50% 50%' }}
  />
);

/** La foto que entra, armada según la variante. */
const Incoming: React.FC<{ variant: Variant; img: HeroImage; onDone: () => void }> = ({ variant, img, onDone }) => {
  const reduce = false; // la web anima siempre (ver App.tsx)

  useEffect(() => {
    const id = window.setTimeout(onDone, (reduce ? 0.6 : TRANSITION_S[variant]) * 1000 + 80);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (reduce) {
    return (
      <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
        <SlideImg img={img} decorative />
      </motion.div>
    );
  }

  if (variant === 'depth') {
    return (
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.28, opacity: 0, filter: 'blur(14px)' }}
        animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: TRANSITION_S.depth, ease: EASE_SOFT }}
      >
        <SlideImg img={img} decorative />
      </motion.div>
    );
  }

  if (variant === 'cut') {
    return (
      <>
        {CUT_HALVES.map((h) => (
          <motion.div
            key={h.from}
            className="absolute inset-0"
            style={{ clipPath: h.clip }}
            initial={{ y: h.from }}
            animate={{ y: '0%' }}
            transition={{ duration: TRANSITION_S.cut, ease: EASE_SOFT }}
          >
            <SlideImg img={img} decorative />
          </motion.div>
        ))}
      </>
    );
  }

  // panels: cada franja vertical gira sobre su borde izquierdo, de izquierda a derecha
  return (
    <div className="absolute inset-0" style={{ perspective: 1600 }}>
      {Array.from({ length: PANELS }, (_, i) => {
        const left = (i * 100) / PANELS;
        const right = 100 - ((i + 1) * 100) / PANELS - (i === PANELS - 1 ? 0 : 0.15);
        return (
          <motion.div
            key={i}
            className="absolute inset-0"
            style={{ clipPath: `inset(0% ${Math.max(0, right)}% 0% ${left}%)`, transformOrigin: `${left}% 50%` }}
            initial={{ rotateY: -86, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            transition={{ duration: PANEL_S, ease: EASE_OUT, delay: i * PANEL_STAGGER }}
          >
            <SlideImg img={img} decorative />
          </motion.div>
        );
      })}
    </div>
  );
};

type LayerMode = 'incoming' | 'settled' | 'outgoing';

const SlideLayer: React.FC<{
  slide: Slide;
  index: number;
  mode: LayerMode;
  variant: Variant;
  onDone: () => void;
}> = ({ slide, index, mode, variant, onDone }) => {
  // Ken Burns: cada foto se aleja lentamente, alternando la dirección del paneo.
  const dir = index % 2 === 0 ? 1 : -1;
  const out = mode === 'outgoing';
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.1, x: `${dir * 1.5}%`, y: `${dir * -0.75}%` }}
        animate={{ scale: 1.01, x: '0%', y: '0%' }}
        transition={{ duration: (SLIDE_MS + 2000) / 1000, ease: 'linear' }}
      >
        {/* La foto completa ya está montada (oculta) mientras entra: al terminar no hay parpadeo */}
        <motion.div
          className="absolute inset-0"
          style={{ opacity: mode === 'incoming' ? 0 : 1 }}
          animate={{ scale: out ? OUTGOING[variant].scale : 1 }}
          transition={{ duration: out ? TRANSITION_S[variant] : 0, ease: EASE_SOFT }}
        >
          <SlideImg img={slide.img} decorative={out} />
        </motion.div>
        {mode === 'incoming' && <Incoming variant={variant} img={slide.img} onDone={onDone} />}
      </motion.div>
      {out && (
        <motion.div
          className="absolute inset-0 bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: OUTGOING[variant].dim }}
          transition={{ duration: TRANSITION_S[variant] * 0.8, ease: EASE_SOFT }}
        />
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Frases: "corte"                                                    */
/*  Una línea roja vertical recorre la frase y la revela entera, como  */
/*  un cúter (Ctrl+X). Al salir, la misma línea la corta hacia la      */
/*  derecha. El texto se mueve en bloque: no hay palabras sueltas.     */
/* ------------------------------------------------------------------ */

const REVEAL_S = 0.95;
const CUT_S = 0.5;
const EASE_EXIT: [number, number, number, number] = [0.7, 0, 0.84, 0];

// El recorte se extiende 30% arriba y abajo para no cortar acentos ni letras como la "g"
const wipeVariants: Variants = {
  hidden: { clipPath: 'inset(-30% 100% -30% 0%)' },
  show: { clipPath: 'inset(-30% 0% -30% 0%)', transition: { duration: REVEAL_S, ease: EASE_CUT } },
  exit: { clipPath: 'inset(-30% 0% -30% 100%)', transition: { duration: CUT_S, ease: EASE_EXIT } },
};

const bladeVariants: Variants = {
  hidden: { left: '0%', opacity: 0 },
  show: {
    left: ['0%', '100%'],
    opacity: [0, 1, 1, 0],
    transition: { left: { duration: REVEAL_S, ease: EASE_CUT }, opacity: { duration: REVEAL_S, times: [0, 0.08, 0.85, 1] } },
  },
  exit: {
    left: ['0%', '100%'],
    opacity: [0, 1, 1, 0],
    transition: { left: { duration: CUT_S, ease: EASE_EXIT }, opacity: { duration: CUT_S, times: [0, 0.1, 0.8, 1] } },
  },
};

// Un leve desplazamiento del bloque acompaña al corte
const driftVariants: Variants = {
  hidden: { x: -14 },
  show: { x: 0, transition: { duration: REVEAL_S + 0.3, ease: EASE_OUT } },
  exit: { x: 10, transition: { duration: CUT_S, ease: EASE_EXIT } },
};

const Phrase: React.FC<{ text: string; highlight: string }> = ({ text, highlight }) => {
  const at = text.indexOf(highlight);
  if (at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <span className="text-brand-orange">{highlight}</span>
      {text.slice(at + highlight.length)}
    </>
  );
};

const Caption: React.FC<{ slide: Slide }> = ({ slide }) => (
  <motion.div initial="hidden" animate="show" exit="exit" aria-live="polite" className="relative w-fit max-w-full">
    <motion.div variants={wipeVariants}>
      <motion.div variants={driftVariants}>
        <div className="mb-5 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.32em] md:text-sm">
          <svg width="12" height="12" viewBox="0 0 20 20" className="flex-shrink-0" aria-hidden>
            <path d="M20 10L0 20V0L20 10Z" fill="#FF0000" />
          </svg>
          <span>{slide.label}</span>
        </div>
        <h2 className="max-w-3xl text-[clamp(1.6rem,3.2vw,3rem)] font-extrabold leading-[1.15] tracking-tight text-white">
          <Phrase text={slide.text} highlight={slide.highlight} />
        </h2>
      </motion.div>
    </motion.div>
    {/* La "hoja" del corte */}
    <motion.span
      variants={bladeVariants}
      aria-hidden
      className="pointer-events-none absolute -bottom-[8%] -top-[8%] w-[2px] -translate-x-1/2 bg-brand-orange shadow-[0_0_12px_rgba(255,0,0,0.8)]"
    />
  </motion.div>
);

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */

const Hero: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(true); // la primera foto también entra animada
  // Copias siempre actualizadas, para que el temporizador no use valores viejos
  const currentRef = useRef(0);
  const transitioningRef = useRef(true);
  const [transitionCount, setTransitionCount] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [paused, setPaused] = useState(false);

  const variant = VARIANTS[transitionCount % VARIANTS.length];

  const goTo = useCallback(
    (i: number) => {
      if (i === currentRef.current || transitioningRef.current) return;
      setPrev(currentRef.current);
      currentRef.current = i;
      transitioningRef.current = true;
      setCurrent(i);
      setTransitioning(true);
      setTransitionCount((c) => c + 1);
      setCycle((c) => c + 1);
    },
    [],
  );

  const handleDone = useCallback(() => {
    transitioningRef.current = false;
    setTransitioning(false);
    setPrev(null);
  }, []);

  // Avance automático
  useEffect(() => {
    if (paused) return;
    const t = window.setTimeout(() => goTo((current + 1) % SLIDES.length), SLIDE_MS);
    return () => window.clearTimeout(t);
  }, [current, cycle, paused, goTo]);

  // Pausar cuando la pestaña no está visible
  useEffect(() => {
    const onVis = () => {
      const hidden = document.visibilityState === 'hidden';
      setPaused(hidden);
      if (!hidden) setCycle((c) => c + 1);
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  // Precargar la siguiente foto
  useEffect(() => {
    const next = SLIDES[(current + 1) % SLIDES.length];
    const img = new Image();
    img.src = next.img.src;
  }, [current]);

  const layers = (prev !== null ? [prev, current] : [current]).map((i) => (
    <SlideLayer
      key={i}
      slide={SLIDES[i]}
      index={i}
      mode={i === current ? (transitioning ? 'incoming' : 'settled') : 'outgoing'}
      variant={variant}
      onDone={handleDone}
    />
  ));

  return (
    <section id="hero" className="relative h-[100svh] min-h-[620px] w-full overflow-hidden bg-brand-dark text-white">
      <div className="absolute inset-0">{layers}</div>

      {/* Capas para legibilidad del texto */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-black/5" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-black/60 to-transparent" />

      <div className="container relative z-10 mx-auto flex h-full flex-col px-6 pb-8 pt-28 md:pb-10 md:pt-32">
        <h1 className="sr-only">Control X — Creemos en el potencial de una idea</h1>

        {/* Lugar que ocupa el logo grande; el logo real lo dibuja ScrollLogo y se transforma al hacer scroll */}
        <div id="hero-logo-anchor" aria-hidden className="aspect-[953/255] w-[min(84vw,620px)]" />

        <div className="mt-auto">
          <div className="flex min-h-[11rem] flex-col justify-end md:min-h-[12rem]">
            <AnimatePresence mode="wait">
              <Caption key={current} slide={SLIDES[current]} />
            </AnimatePresence>
          </div>

          <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-end md:gap-12">
            <div className="flex w-full max-w-lg gap-1.5" role="tablist" aria-label="Fotos de proyectos">
              {SLIDES.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === current}
                  aria-label={`Ver foto ${i + 1}: ${s.label}`}
                  onClick={() => goTo(i)}
                  className="group flex h-6 flex-1 items-center outline-none"
                >
                  <span className="relative block h-[2px] w-full overflow-hidden bg-white/20 transition-colors group-hover:bg-white/40 group-focus-visible:bg-white/60">
                    {i === current ? (
                      <motion.span
                        key={`fill-${cycle}`}
                        className="absolute inset-0 origin-left bg-brand-orange"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: paused ? 0 : 1 }}
                        transition={{ duration: SLIDE_MS / 1000, ease: 'linear' }}
                      />
                    ) : (
                      <span className={`absolute inset-0 bg-white/70 ${i < current ? 'opacity-100' : 'opacity-0'}`} />
                    )}
                  </span>
                </button>
              ))}
            </div>
            <p className="hidden max-w-sm text-sm font-light leading-relaxed text-white/70 md:ml-auto md:block">
              Somos una empresa con más de 20 años de experiencia en soluciones integrales para la industria publicitaria.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
