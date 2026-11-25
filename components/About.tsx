import React from 'react';
import { motion } from 'framer-motion';
import { IMAGES, getImg } from '../src/constants/images';
import SectionTitle from './SectionTitle';

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-white dark:bg-brand-dark text-brand-dark dark:text-white transition-colors duration-300">
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
            className="relative w-full max-w-[480px] justify-self-center md:justify-self-end"
          >
             {/* Lámina vertical (3:4), entera y a color. Su fondo es #111111, el mismo negro de la web, así se funde con la sección */}
             <img
               src={getImg(IMAGES.about.workspace)}
               alt={IMAGES.about.workspace.alt}
               width={896}
               height={1200}
               loading="lazy"
               className="relative block h-auto w-full"
             />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;