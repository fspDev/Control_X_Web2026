import React from 'react';
import { motion } from 'framer-motion';
import { IMAGES, getImg } from '../src/constants/images';
import SectionTitle from './SectionTitle';

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 md:py-32 bg-white dark:bg-brand-dark text-brand-dark dark:text-white transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <SectionTitle 
              subtitle="Nuestra Empresa"
              title="Quiénes somos"
            />
            <div className="space-y-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-light">
              <p>
                Somos una empresa especializada en diseño y fabricación de stands, exhibidores y soluciones para puntos de venta.
                Ayudamos a las marcas a destacarse en ferias, congresos y eventos, transformando espacios en experiencias que venden.
              </p>
              <p>
                Somos un equipo de profesionales con amplia experiencia, diseño propio y fabricación con tecnología de vanguardia.
                Acompañamos cada proyecto de principio a fin, desde la idea hasta la instalación final, con cobertura nacional.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-[400px] md:h-[500px] w-full"
          >
             <div className="absolute inset-0 bg-brand-dark dark:bg-zinc-800 translate-x-4 translate-y-4 transition-colors duration-300"></div>
             <img 
               src={getImg(IMAGES.about.workspace)} 
               alt={IMAGES.about.workspace.alt}
               className="relative w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
             />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;