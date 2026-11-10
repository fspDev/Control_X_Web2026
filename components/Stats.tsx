import React, { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView } from 'framer-motion';
import SectionTitle from './SectionTitle';

interface Stat {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

// Cifras estimativas. "+20 años" sale del texto de la web; el resto son estimaciones a confirmar.
const STATS: Stat[] = [
  { value: 20, prefix: '+', label: 'años de trayectoria' },
  { value: 1847, prefix: '+', label: 'proyectos realizados' },
  { value: 386, prefix: '+', label: 'ferias y eventos' },
  { value: 23640, prefix: '+', suffix: 'm²', label: 'construidos' },
  { value: 19, label: 'provincias recorridas' },
];

const fmt = new Intl.NumberFormat('es-AR');

const Counter: React.FC<{ stat: Stat; delay: number }> = ({ stat, delay }) => {
  const ref = useRef<HTMLSpanElement>(null);
  // Solo recortamos abajo: con margen en los costados, los números angostos de la izquierda nunca "entraban"
  const inView = useInView(ref, { once: true, margin: '0px 0px -80px 0px' });
  const reduce = false; // la web anima siempre (ver App.tsx)
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setN(stat.value);
      return;
    }
    const controls = animate(0, stat.value, {
      duration: 2,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduce, stat.value, delay]);

  return (
    <span ref={ref} className="tabular-nums">
      {stat.prefix && <span className="text-brand-orange">{stat.prefix}</span>}
      {fmt.format(n)}
      {stat.suffix && <span className="ml-1 text-[0.55em] align-top">{stat.suffix}</span>}
    </span>
  );
};

const Stats: React.FC = () => (
  <section id="cifras" className="relative overflow-hidden bg-brand-dark py-24 text-white">
    {/* X gigante de fondo */}
    <svg
      aria-hidden
      viewBox="0 0 168 168"
      className="pointer-events-none absolute -right-24 top-1/2 h-[140%] -translate-y-1/2 opacity-[0.04]"
    >
      <path d="M0 0 L60 84 L0 168 Z M168 0 L108 84 L168 168 Z M56 0 L112 0 L84 40 Z M56 168 L112 168 L84 128 Z" fill="#fff" />
    </svg>

    <div className="container relative mx-auto px-6">
      {/* Mismo encabezado y misma línea izquierda que el resto de las secciones */}
      <SectionTitle subtitle="Trayectoria" title="Números que nos respaldan" dark />

      <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-5 md:gap-x-4 lg:gap-x-8">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -80px 0px' }}
            transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="border-t border-white/15 pt-6 last:col-span-2 md:last:col-span-1"
          >
            {/* En celular 2 columnas; desde tablet las 5 cifras en una sola fila, con el tamaño ajustado al ancho */}
            <div className="whitespace-nowrap text-[clamp(1.5rem,8vw,2.25rem)] font-extrabold leading-none tracking-tighter md:text-[clamp(1.4rem,2.9vw,3.5rem)]">
              <Counter stat={s} delay={i * 0.1} />
            </div>
            <p className="mt-3 text-xs font-semibold uppercase leading-snug tracking-[0.18em] text-white/60">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Stats;
