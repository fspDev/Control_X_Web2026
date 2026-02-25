import React from 'react';
import { motion } from 'framer-motion';
import SectionTitle from './SectionTitle';

const Clients: React.FC = () => {
  // Creating generic client placeholders
  const clients = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    name: `Cliente ${i + 1}`,
  }));

  return (
    <section id="clients" className="py-24 bg-brand-dark text-white overflow-hidden">
      <div className="container mx-auto px-6">
        <SectionTitle 
          subtitle="Nuestros Clientes"
          title="Empresas que confían en nosotros"
          dark={true}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {clients.map((client, index) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex items-center justify-center h-24 border border-white/10 hover:border-brand-orange/50 transition-colors duration-300 bg-white/5 backdrop-blur-sm"
            >
              {/* Placeholder for Logos - Text used for demo */}
              <span className="text-xl font-bold text-gray-400 font-sans tracking-tight">LOGO {index + 1}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Clients;