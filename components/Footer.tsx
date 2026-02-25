import React, { useState, useEffect } from 'react';
import { IMAGES, getImg } from '../src/constants/images';
import { Instagram, MessageCircle } from 'lucide-react';

const Footer: React.FC = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check initial state from HTML class
    setIsDark(document.documentElement.classList.contains('dark'));

    // Observer for theme changes
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  const logoSrc = isDark ? IMAGES.logo.dark : IMAGES.logo.light;

  const handleLogoError = () => {
    // Error handling if needed
  };

  return (
    <footer className="bg-brand-gray dark:bg-black text-brand-dark dark:text-white py-16 border-t border-brand-dark/5 dark:border-white/10 transition-colors duration-300">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-8 md:mb-0 flex flex-col items-center md:items-start text-center md:text-left">
          <img 
            src={logoSrc} 
            alt={IMAGES.logo.alt} 
            onError={handleLogoError}
            className="h-12 w-auto mb-6" 
          />
          <p className="text-gray-500 dark:text-gray-500 text-sm">
            © {new Date().getFullYear()} Todos los derechos reservados.
          </p>
        </div>
        
        <div className="flex flex-col items-center md:items-end gap-4">
          <div className="flex space-x-12">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-3"
            >
              <div className="p-4 rounded-full border border-brand-dark/10 dark:border-white/10 group-hover:bg-brand-orange group-hover:border-brand-orange transition-all duration-300">
                <Instagram size={28} className="group-hover:scale-110 group-hover:text-white transition-all" />
              </div>
              <span className="text-sm uppercase tracking-[0.15em] font-bold text-brand-dark/60 dark:text-white/70 group-hover:text-brand-orange dark:group-hover:text-white transition-colors">Instagram</span>
            </a>
            <a 
              href="https://wa.me/543514888756" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-3"
            >
              <div className="p-4 rounded-full border border-brand-dark/10 dark:border-white/10 group-hover:bg-brand-orange group-hover:border-brand-orange transition-all duration-300">
                <MessageCircle size={28} className="group-hover:scale-110 group-hover:text-white transition-all" />
              </div>
              <span className="text-sm uppercase tracking-[0.15em] font-bold text-brand-dark/60 dark:text-white/70 group-hover:text-brand-orange dark:group-hover:text-white transition-colors">WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;