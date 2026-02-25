import React from 'react';
import { motion } from 'framer-motion';
import { 
  Store, 
  PenTool, 
  ShoppingBag, 
  Tag
} from 'lucide-react';
import SectionTitle from './SectionTitle';

interface ServiceItem {
  icon: React.ElementType;
  title: string;
  description: string;
}

const services: ServiceItem[] = [
  { icon: Store, title: "Diseño y construcción de Stands", description: "Soluciones de impacto para ferias y exposiciones." },
  { icon: Tag, title: "Material POP", description: "Publicidad en el punto de venta estratégica." },
  { icon: ShoppingBag, title: "Exhibidores", description: "Mobiliario para destacar productos." },
  { icon: PenTool, title: "Escenografías", description: "Ambientaciones temáticas para eventos y TV." },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const Services: React.FC = () => {
  return (
    <section id="services" className="py-24 bg-brand-gray dark:bg-black transition-colors duration-300">
      <div className="container mx-auto px-6">
        <SectionTitle 
          subtitle="Servicios"
          title="Nuestras soluciones"
        />

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white dark:bg-zinc-900 p-8 group hover:bg-brand-dark dark:hover:bg-gray-100 transition-colors duration-300 shadow-sm border-b-4 border-transparent hover:border-brand-orange"
            >
              <div className="mb-6 text-brand-orange group-hover:text-white dark:group-hover:text-brand-orange transition-colors">
                <service.icon size={48} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-brand-dark dark:text-white group-hover:text-white dark:group-hover:text-brand-dark transition-colors">
                {service.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed group-hover:text-gray-400 dark:group-hover:text-gray-600 transition-colors">
                {service.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;