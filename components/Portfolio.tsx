import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { IMAGES, getImg } from '../src/constants/images';
import SectionTitle from './SectionTitle';

const Portfolio: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openProject = (project: any) => {
    setSelectedProject(project);
    setCurrentImageIndex(0);
    // Prevent scroll when modal is open
    document.body.style.overflow = 'hidden';
  };

  const closeProject = () => {
    setSelectedProject(null);
    document.body.style.overflow = 'auto';
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedProject) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedProject.gallery.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedProject) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedProject.gallery.length) % selectedProject.gallery.length);
    }
  };

  return (
    <section id="portfolio" className="py-24 bg-white dark:bg-brand-dark transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <SectionTitle 
            subtitle="Nuestro Trabajo"
            title="Casos de Éxito"
          />
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden md:inline-block px-6 py-3 border-2 border-brand-dark dark:border-white text-brand-dark dark:text-white font-bold uppercase hover:bg-brand-dark hover:text-white dark:hover:bg-white dark:hover:text-brand-dark transition-all duration-300"
          >
            Ver más proyectos
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {IMAGES.portfolio.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              onClick={() => openProject(project)}
              className={`group relative overflow-hidden cursor-pointer ${index === 1 || index === 4 ? 'lg:col-span-2' : ''}`}
            >
              <div className="aspect-[4/3] w-full h-full overflow-hidden">
                <img
                  src={getImg(project)}
                  alt={project.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />
              </div>
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-brand-dark/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                <span className="text-brand-orange text-sm font-bold uppercase tracking-wider translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                  {project.category}
                </span>
                <h3 className="text-white text-2xl font-bold mt-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                  {project.title}
                </h3>
                <p className="text-white/60 text-sm mt-2 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-150 italic">
                  Click para ver galería
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal Carousel */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeProject}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12"
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-6 right-6 z-[110] text-white/50 hover:text-white transition-colors"
              onClick={closeProject}
            >
              <X size={40} />
            </motion.button>

            <div className="relative w-full max-w-6xl aspect-video flex items-center justify-center group" onClick={(e) => e.stopPropagation()}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  src={selectedProject.gallery[currentImageIndex]}
                  alt={`${selectedProject.title} - ${currentImageIndex + 1}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="w-full h-full object-contain"
                />
              </AnimatePresence>

              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/5 text-white hover:bg-white/10 transition-colors backdrop-blur-md opacity-0 group-hover:opacity-100"
                aria-label="Anterior"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/5 text-white hover:bg-white/10 transition-colors backdrop-blur-md opacity-0 group-hover:opacity-100"
                aria-label="Siguiente"
              >
                <ChevronRight size={32} />
              </button>

              {/* Info & Counter */}
              <div className="absolute -bottom-16 left-0 right-0 flex justify-between items-center text-white">
                <div>
                  <h4 className="text-xl font-bold">{selectedProject.title}</h4>
                  <p className="text-brand-orange text-sm font-bold uppercase">{selectedProject.category}</p>
                </div>
                <div className="text-sm font-mono tracking-widest text-white/50">
                  {String(currentImageIndex + 1).padStart(2, '0')} / {String(selectedProject.gallery.length).padStart(2, '0')}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Portfolio;