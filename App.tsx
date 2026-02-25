import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import Clients from './components/Clients';
import Contact from './components/Contact';
import Footer from './components/Footer';

const App: React.FC = () => {
  // A simple loading state to simulate a smooth entry
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-brand-dark flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
          <span className="text-white text-sm tracking-widest uppercase font-bold">Control-X</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-x-hidden">
      <Navigation />
      
      <main>
        <Hero />
        <About />
        <Services />
        <Portfolio />
        <Clients />
        <Contact />
      </main>

      <Footer />
    </div>
  );
};

export default App;