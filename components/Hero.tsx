import React, { useCallback, useEffect, useState } from 'react';
import { animate, motion, AnimatePresence, useMotionValue, useReducedMotion, useTransform, Variants } from 'framer-motion';
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

const SLIDE_MS = 6500;
const EASE_CUT: [number, number, number, number] = [0.77, 0, 0.175, 1];
const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ------------------------------------------------------------------ */
/*  Transiciones entre fotos (suaves, se van turnando)                 */
/*  dissolve → la foto nueva aparece desenfocada y se va enfocando     */
/*  sweep    → un barrido diagonal con borde difuminado                */
/*  iris     → se abre desde el centro como un foco de luz             */
/* ------------------------------------------------------------------ */

type Variant = 'dissolve' | 'sweep' | 'iris';
const VARIANTS: Variant[] = ['dissolve', 'sweep', 'iris'];

const EASE_SOFT: [number, number, number, number] = [0.45, 0, 0.2, 1];
const TRANSITION_S: Record<Variant, number> = { dissolve: 1.8, sweep: 2, iris: 2 };

const SWEEP_MASK = 'linear-gradient(100deg, #000 40%, transparent 60%)';
const IRIS_MASK = 'radial-gradient(closest-side, #000 55%, transparent 100%)';

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

/** La foto que entra, revelada según la variante. Todo se mueve con un único valor t de 0 a 1. */
const Incoming: React.FC<{ variant: Variant; img: HeroImage; onDone: () => void }> = ({ variant, img, onDone }) => {
  const reduce = useReducedMotion();
  const t = useMotionValue(0);

  const opacity = useTransform(t, (v) => (variant === 'dissolve' || reduce ? v : Math.min(1, v * 4)));
  const filter = useTransform(t, (v) => (variant === 'dissolve' && !reduce ? `blur(${(1 - v) * 16}px)` : 'none'));
  const scale = useTransform(t, (v) => (variant === 'dissolve' && !reduce ? 1.06 - 0.06 * v : 1));
  // sweep: la máscara (2,5 veces más ancha que la foto) se desliza de derecha a izquierda
  const sweepPos = useTransform(t, (v) => `${100 - v * 100}% 0%`);
  // iris: un círculo difuminado que crece desde el centro
  const irisSize = useTransform(t, (v) => `${v * 300}% ${v * 300}%`);

  useEffect(() => {
    const controls = animate(t, 1, {
      duration: reduce ? 0.8 : TRANSITION_S[variant],
      ease: EASE_SOFT,
      onComplete: onDone,
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mask =
    reduce || variant === 'dissolve'
      ? {}
      : variant === 'sweep'
        ? {
            WebkitMaskImage: SWEEP_MASK, maskImage: SWEEP_MASK,
            WebkitMaskSize: '250% 100%', maskSize: '250% 100%',
            WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
            WebkitMaskPosition: sweepPos, maskPosition: sweepPos,
          }
        : {
            WebkitMaskImage: IRIS_MASK, maskImage: IRIS_MASK,
            WebkitMaskSize: irisSize, maskSize: irisSize,
            WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
            WebkitMaskPosition: '50% 50%', maskPosition: '50% 50%',
          };

  return (
    <motion.div className="absolute inset-0" style={{ opacity, filter, scale, ...mask }}>
      <SlideImg img={img} decorative />
    </motion.div>
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
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.1, x: `${dir * 1.5}%`, y: `${dir * -0.75}%` }}
        animate={{ scale: 1.01, x: '0%', y: '0%' }}
        transition={{ duration: (SLIDE_MS + 3000) / 1000, ease: 'linear' }}
      >
        {/* La foto completa ya está montada (oculta) mientras entra: al terminar no hay parpadeo */}
        <div className="absolute inset-0" style={{ opacity: mode === 'incoming' ? 0 : 1 }}>
          <SlideImg img={slide.img} decorative={mode === 'outgoing'} />
        </div>
        {mode === 'incoming' && <Incoming variant={variant} img={slide.img} onDone={onDone} />}
      </motion.div>
      {mode === 'outgoing' && (
        <motion.div
          className="absolute inset-0 bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: TRANSITION_S[variant], ease: EASE_SOFT }}
        />
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Frases                                                             */
/* ------------------------------------------------------------------ */

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+×/<>';

/** Texto que se "decodifica": caracteres aleatorios que se resuelven de izquierda a derecha. */
const Decode: React.FC<{ text: string; delay?: number; duration?: number }> = ({ text, delay = 250, duration = 700 }) => {
  const [out, setOut] = useState('');
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) {
      setOut(text);
      return;
    }
    let raf = 0;
    const start = performance.now() + delay;
    const tick = (now: number) => {
      const t = Math.max(0, (now - start) / duration);
      const resolved = Math.floor(t * text.length);
      let s = '';
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (ch === ' ') s += ' ';
        else if (i < resolved) s += ch;
        else if (t > 0 && i < resolved + 5) s += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        else s += ' ';
      }
      setOut(s);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setOut(text);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, delay, duration, reduce]);

  return (
    <span className="relative inline-block whitespace-nowrap">
      <span className="invisible">{text}</span>
      <span className="absolute inset-0" aria-hidden>{out}</span>
    </span>
  );
};

const captionVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.35 } },
  exit: { transition: { staggerChildren: 0.02 } },
};

// Las palabras aparecen de a una, subiendo apenas y pasando de desenfocadas a nítidas (sin recortes)
const wordVariants: Variants = {
  hidden: { y: '0.35em', opacity: 0, filter: 'blur(10px)' },
  show: { y: '0em', opacity: 1, filter: 'blur(0px)', transition: { duration: 1.1, ease: EASE_OUT } },
  exit: { y: '-0.2em', opacity: 0, filter: 'blur(8px)', transition: { duration: 0.5, ease: [0.4, 0, 1, 1] } },
};

const labelVariants: Variants = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE_OUT } },
  exit: { opacity: 0, x: 16, transition: { duration: 0.3 } },
};

const lineVariants: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.6, ease: EASE_CUT } },
  exit: { scaleX: 0, transition: { duration: 0.3 } },
};

const Word: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <motion.span variants={wordVariants} className={`inline-block will-change-transform ${className}`}>
    {children}
  </motion.span>
);

const Phrase: React.FC<{ text: string; highlight: string }> = ({ text, highlight }) => {
  const at = text.indexOf(highlight);
  const before = at >= 0 ? text.slice(0, at) : text;
  const marked = at >= 0 ? highlight : '';
  const after = at >= 0 ? text.slice(at + highlight.length) : '';
  const split = (s: string) => s.split(' ').filter(Boolean);
  const markedWords = split(marked);

  const renderWords = (words: string[], keyPrefix: string) =>
    words.map((w, i) => (
      <React.Fragment key={`${keyPrefix}-${i}`}>
        <Word>{w}</Word>{' '}
      </React.Fragment>
    ));

  return (
    <>
      {renderWords(split(before), 'b')}
      {/* Palabras clave en rojo, sin fondo */}
      {markedWords.map((w, i) => (
        <React.Fragment key={`m-${i}`}>
          <Word className="text-brand-orange">{w}</Word>{' '}
        </React.Fragment>
      ))}
      {renderWords(split(after), 'a')}
    </>
  );
};

const Caption: React.FC<{ slide: Slide; index: number; total: number }> = ({ slide, index, total }) => (
  <motion.div variants={captionVariants} initial="hidden" animate="show" exit="exit" aria-live="polite">
    <div className="mb-5 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.32em] md:text-sm">
      <motion.svg variants={labelVariants} width="12" height="12" viewBox="0 0 20 20" className="flex-shrink-0">
        <path d="M20 10L0 20V0L20 10Z" fill="#FF0000" />
      </motion.svg>
      <motion.span variants={labelVariants} className="tabular-nums text-white/60">
        {String(index + 1).padStart(2, '0')}<span className="text-white/30">/{String(total).padStart(2, '0')}</span>
      </motion.span>
      <motion.span variants={lineVariants} className="block h-px w-8 origin-left bg-white/50 md:w-12" />
      <motion.span variants={labelVariants}>
        <Decode text={slide.label} />
      </motion.span>
    </div>
    <h2 className="max-w-3xl text-[clamp(1.6rem,3.2vw,3rem)] font-extrabold leading-[1.15] tracking-tight text-white">
      <Phrase text={slide.text} highlight={slide.highlight} />
    </h2>
  </motion.div>
);

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */

const Hero: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(true); // la primera foto también entra animada
  const [transitionCount, setTransitionCount] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [paused, setPaused] = useState(false);

  const variant = VARIANTS[transitionCount % VARIANTS.length];

  const goTo = useCallback(
    (i: number) => {
      if (i === current || transitioning) return;
      setPrev(current);
      setCurrent(i);
      setTransitioning(true);
      setTransitionCount((c) => c + 1);
      setCycle((c) => c + 1);
    },
    [current, transitioning],
  );

  const handleDone = useCallback(() => {
    setTransitioning(false);
    setPrev(null);
  }, []);

  // Avance automático
  useEffect(() => {
    if (paused) return;
    const t = window.setTimeout(() => goTo((current + 1) % SLIDES.length), SLIDE_MS);
    return () => window.clearTimeout(t);
    // goTo depende de transitioning, pero el temporizador solo debe reiniciarse al cambiar de foto
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, cycle, paused]);

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
              <Caption key={current} slide={SLIDES[current]} index={current} total={SLIDES.length} />
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
