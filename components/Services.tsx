import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Store,
  PenTool,
  ShoppingBag,
  Tag
} from 'lucide-react';
import SectionTitle from './SectionTitle';
import StandFigure from './figures/StandFigure';
import PopFigure from './figures/PopFigure';
import ShowcaseFigure from './figures/ShowcaseFigure';
import StageFigure from './figures/StageFigure';

interface ServiceItem {
  icon: React.ElementType;
  title: string;
  description: string;
  /** Figura isométrica animada que explica la solución. */
  figure: React.FC;
}

const services: ServiceItem[] = [
  { icon: Store, title: "Diseño y construcción de Stands", description: "Soluciones de impacto para ferias y exposiciones.", figure: StandFigure },
  { icon: Tag, title: "Material POP", description: "Publicidad en el punto de venta estratégica.", figure: PopFigure },
  { icon: ShoppingBag, title: "Exhibidores", description: "Mobiliario para destacar productos.", figure: ShowcaseFigure },
  { icon: PenTool, title: "Escenografías", description: "Ambientaciones temáticas para eventos y TV.", figure: StageFigure },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

/*
 * Tarjetas a la izquierda, figura a la derecha: elegir una tarjeta cambia la figura.
 * En celular la figura queda debajo de la lista.
 */
const Services: React.FC = () => {
  const [active, setActive] = useState(0);
  const Figure = services[active].figure;

  return (
    <section id="services" className="py-24 bg-brand-gray dark:bg-black transition-colors duration-300">
      <div className="container mx-auto px-6">
        <SectionTitle
          subtitle="Servicios"
          title="Nuestras soluciones"
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            role="tablist"
            aria-label="Soluciones"
            className="flex flex-col gap-4"
          >
            {services.map((service, index) => {
              const isOn = active === index;
              return (
                <motion.button
                  type="button"
                  key={service.title}
                  variants={itemVariants}
                  role="tab"
                  aria-selected={isOn}
                  aria-controls="service-figure"
                  onClick={() => {
                    setActive(index);
                    // En celular y tablet la figura queda debajo de la lista: bajamos hasta ella
                    if (window.innerWidth < 1024) {
                      document.getElementById('service-figure')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                  }}
                  className={`group flex items-start gap-5 border-l-4 p-6 text-left shadow-sm transition-colors duration-300 md:p-7 ${
                    isOn
                      ? 'border-brand-orange bg-brand-dark text-white dark:bg-zinc-900'
                      : 'border-transparent bg-white hover:border-brand-orange dark:bg-zinc-900/60 dark:hover:bg-zinc-900'
                  }`}
                >
                  <service.icon size={40} strokeWidth={1.5} className="flex-shrink-0 text-brand-orange" />
                  <span className="flex flex-col">
                    <span className={`text-lg font-bold leading-snug ${isOn ? 'text-white' : 'text-brand-dark dark:text-white'}`}>
                      {service.title}
                    </span>
                    <span className={`mt-2 text-sm leading-relaxed ${isOn ? 'text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>
                      {service.description}
                    </span>
                    <span className={`mt-4 text-xs font-bold uppercase tracking-widest ${isOn ? 'text-brand-orange' : 'text-gray-400 group-hover:text-brand-orange'}`}>
                      {isOn ? 'Viendo la animación' : 'Ver animación'}
                    </span>
                  </span>
                </motion.button>
              );
            })}
          </motion.div>

          {/* Figura de la solución elegida; queda fija al hacer scroll en escritorio */}
          <div id="service-figure" role="tabpanel" className="lg:sticky lg:top-24">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="[&_.iso-figure]:my-0"
              >
                <Figure />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
