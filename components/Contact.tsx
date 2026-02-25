import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import SectionTitle from './SectionTitle';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-24 bg-white dark:bg-brand-dark transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Info Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2"
          >
            <SectionTitle 
              subtitle="Contacto"
              title="Hablemos de tu próximo proyecto"
            />

            <div className="space-y-8">
              <div className="flex items-start space-x-4 group cursor-pointer">
                <div className="p-3 bg-brand-gray dark:bg-zinc-800 rounded-full group-hover:bg-brand-orange group-hover:text-white dark:text-white transition-colors duration-300">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-brand-dark dark:text-white">Visitanos</h4>
                  <p className="text-gray-500 dark:text-gray-400">Laprida 2790, Alto Alberdi,<br />Córdoba, Argentina</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 group cursor-pointer">
                <div className="p-3 bg-brand-gray dark:bg-zinc-800 rounded-full group-hover:bg-brand-orange group-hover:text-white dark:text-white transition-colors duration-300">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-brand-dark dark:text-white">Llamanos</h4>
                  <p className="text-gray-500 dark:text-gray-400">+54 351 488-8756</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 group cursor-pointer">
                <div className="p-3 bg-brand-gray dark:bg-zinc-800 rounded-full group-hover:bg-brand-orange group-hover:text-white dark:text-white transition-colors duration-300">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-brand-dark dark:text-white">Escribinos</h4>
                  <p className="text-gray-500 dark:text-gray-400">info@control-x.com.ar</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 bg-brand-gray dark:bg-zinc-900 p-8 md:p-12 transition-colors duration-300"
          >
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-brand-dark dark:text-white mb-2 uppercase transition-colors duration-300">Nombre</label>
                <input
                  type="text"
                  id="name"
                  className="w-full bg-white dark:bg-brand-dark dark:text-white border-b-2 border-transparent focus:border-brand-orange p-4 outline-none transition-colors"
                  placeholder="Tu nombre o empresa"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-brand-dark dark:text-white mb-2 uppercase transition-colors duration-300">Email</label>
                <input
                  type="email"
                  id="email"
                  className="w-full bg-white dark:bg-brand-dark dark:text-white border-b-2 border-transparent focus:border-brand-orange p-4 outline-none transition-colors"
                  placeholder="tu@email.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-bold text-brand-dark dark:text-white mb-2 uppercase transition-colors duration-300">Mensaje</label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full bg-white dark:bg-brand-dark dark:text-white border-b-2 border-transparent focus:border-brand-orange p-4 outline-none transition-colors resize-none"
                  placeholder="Contanos sobre tu proyecto..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-brand-dark dark:bg-white dark:text-brand-dark text-white font-bold py-4 px-8 uppercase tracking-wider hover:bg-brand-orange dark:hover:bg-brand-orange dark:hover:text-white transition-colors duration-300 flex items-center justify-center gap-2"
              >
                Enviar Mensaje <Send size={18} />
              </button>
            </form>
          </motion.div>
        </div>

        {/* Optional Map Placeholder */}
        <div className="mt-16 w-full h-96 bg-gray-200 dark:bg-zinc-800 grayscale hover:grayscale-0 transition-all duration-500 overflow-hidden relative shadow-2xl rounded-sm">
          <iframe
            src="https://maps.google.com/maps?q=Laprida+2790,+Alto+Alberdi,+Córdoba,+Argentina&t=&z=15&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación Control-X"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default Contact;