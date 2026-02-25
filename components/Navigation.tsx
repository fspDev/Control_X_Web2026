import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { IMAGES, getImg } from '../src/constants/images';

const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  // Calculate logo source based on current theme state
  const logoSrc = isDark ? IMAGES.logo.dark : IMAGES.logo.light;

  useEffect(() => {
    // Check initial state from HTML class
    setIsDark(document.documentElement.classList.contains('dark'));

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  };

  const handleLogoError = () => {
    // Error handling if needed
  };

  const navLinks = [
    { name: 'Inicio', href: '#hero' },
    { name: 'Empresa', href: '#about' },
    { name: 'Servicios', href: '#services' },
    { name: 'Casos', href: '#portfolio' },
    { name: 'Clientes', href: '#clients' },
    { name: 'Contacto', href: '#contact' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-in-out ${isScrolled
          ? 'bg-white/90 dark:bg-brand-dark/90 backdrop-blur-md py-4 shadow-sm'
          : 'bg-transparent py-6'
          }`}
      >
        <div className="container mx-auto px-6 flex items-center">
          <AnimatePresence>
            {isScrolled && (
              <a href="#hero" className="z-50 block outline-none focus:outline-none">
                <motion.img
                  src={logoSrc}
                  alt={IMAGES.logo.alt}
                  onError={handleLogoError}
                  initial={{ opacity: 0, scale: 0.8, x: -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="h-10 md:h-12 w-auto object-contain cursor-pointer"
                />
              </a>
            )}
          </AnimatePresence>

          {/* Desktop Menu - Always Pushed to the Right */}
          <div className="hidden md:flex items-center space-x-8 ml-auto">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-sm font-semibold uppercase tracking-wider hover:text-brand-orange transition-colors ${isScrolled ? 'text-brand-dark dark:text-white' : 'text-white'
                  }`}
              >
                {link.name}
              </a>
            ))}

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors ${isScrolled
                ? 'bg-gray-100 text-brand-dark hover:bg-gray-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20'
                : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          {/* Mobile Toggle Group - Always Pushed to the Right */}
          <div className="flex items-center gap-4 md:hidden z-50 ml-auto">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors md:hidden ${isScrolled
                ? 'text-brand-dark dark:text-white'
                : 'text-white'
                }`}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button
              className="text-brand-dark focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-8 h-8 text-white" />
              ) : (
                <Menu className={`w-8 h-8 ${isScrolled ? 'text-brand-dark dark:text-white' : 'text-white'}`} />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "tween", duration: 0.4 }}
            className="fixed inset-0 z-40 bg-brand-dark flex flex-col justify-center items-center md:hidden"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-3xl font-bold text-white my-4 hover:text-brand-orange transition-colors uppercase tracking-tight"
              >
                {link.name}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;