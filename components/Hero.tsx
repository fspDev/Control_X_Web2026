import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { IMAGES, getImg } from '../src/constants/images';

const Hero: React.FC = () => {
  const [isScrolled, setIsScrolled] = React.useState(false);

  const [isDark, setIsDark] = React.useState(true);

  React.useEffect(() => {
    // Check initial state from HTML class
    setIsDark(document.documentElement.classList.contains('dark'));

    // Observer for theme changes
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);
  return (
    <section id="hero" className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-brand-dark text-white">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={getImg(IMAGES.hero.bg)}
          alt={IMAGES.hero.bg.alt}
          className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-[3s] scale-105 hover:scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/60 to-transparent" />
      </div>

      <div className="container relative z-10 px-6 mx-auto h-full flex flex-col justify-center items-center pt-32 pb-16">
        <div className="flex flex-col items-center justify-center gap-6 w-full max-w-xl mx-auto">
          <div className="w-full flex justify-center min-h-[100px] md:min-h-[200px]">
            <AnimatePresence>
              {!isScrolled && (
                <motion.img
                  src={isDark ? IMAGES.logo.dark : IMAGES.logo.light}
                  alt={IMAGES.logo.alt}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="w-full h-auto object-contain"
                />
              )}
            </AnimatePresence>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="w-full text-center"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[0.85] tracking-tighter mb-6 break-words w-full">
              Diseño, imagen y <br /> <span className="text-brand-orange">comunicación</span>
            </h1>
            <h2 className="text-base md:text-lg text-gray-300 font-light leading-relaxed mb-8 mx-auto max-w-md">
              Somos una empresa con más de 20 años de experiencia en soluciones integrales para la industria publicitaria.
            </h2>

          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;