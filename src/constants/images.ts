/// <reference types="vite/client" />
// Este archivo centraliza todas las imágenes del sitio.
// Para usar tus propias imágenes:
// 1. Sube los archivos a la carpeta 'public/assets/images/[seccion]/' correspondiente.
// 2. Comenta la línea 'remote' y descomenta la línea 'local'.

const BASE = import.meta.env.BASE_URL;

export interface HeroImage {
  src: string;
  alt: string;
  /** Punto focal para object-position (qué parte de la foto se prioriza al recortar). */
  position?: string;
}

export const IMAGES = {
  logo: {
    // Usamos la base URL de Vite para que funcione en cualquier ruta (local o GitHub Pages)
    dark: `${BASE}assets/images/logo/logo1.png`,
    light: `${BASE}assets/images/logo/logo2.png`,
    alt: 'Control-X Logo',
  },
  hero: {
    // Fotos del slider de inicio (originales en /fotos, optimizadas a 2000px).
    ceva: { src: `${BASE}assets/images/hero/hero-01.jpg`, alt: 'Stand de Ceva con iluminación neón', position: '62% 55%' },
    dispocel: { src: `${BASE}assets/images/hero/hero-02.jpg`, alt: 'Stand de Dispocel y Von Franken', position: '55% 50%' },
    bertotto: { src: `${BASE}assets/images/hero/hero-03.jpg`, alt: 'Stand exterior de Bertotto Boglione', position: '60% 45%' },
    cluster: { src: `${BASE}assets/images/hero/hero-04.jpg`, alt: 'Stand del Clúster Petróleo, Gas y Minería de Córdoba', position: '55% 50%' },
    clusterOil: { src: `${BASE}assets/images/hero/hero-05.jpg`, alt: 'Stand del Clúster con soluciones Oil & Gas', position: '55% 50%' },
    gerbaudo: { src: `${BASE}assets/images/hero/hero-06.jpg`, alt: 'Stand de Metalúrgica Gerbaudo', position: '55% 50%' },
    dayco: { src: `${BASE}assets/images/hero/hero-07.jpg`, alt: 'Stand de Dayco con exhibidores iluminados', position: '45% 50%' },
    johnnie: { src: `${BASE}assets/images/hero/hero-08.jpg`, alt: 'Estructura con pantallas LED de Johnnie Walker', position: '55% 45%' },
    vetanco: { src: `${BASE}assets/images/hero/hero-09.jpg`, alt: 'Stand de Vetanco con pérgola de madera', position: '60% 50%' },
  } satisfies Record<string, HeroImage>,
  about: {
    workspace: {
      // Lámina de bocetos de un stand (generada con IA a partir de una foto de un stand de Control X)
      local: `${BASE}assets/images/about/boceto-stand.jpg`,
      remote: "https://picsum.photos/id/600/800/800",
      alt: "Lámina de bocetos de un stand de Control X: vista general, uniones de la estructura, mostrador, cartel y panel con sus encastres",
    },
  },
};

export interface Project {
  src: string;
  /** Tamaño real de la foto optimizada: el carrusel respeta su proporción. */
  w: number;
  h: number;
  client: string;
  kind: string;
}

// Selección de E:\FOTOS\WEB (una foto por proyecto, stands terminados), optimizada a 1600 px.
const P = (file: string, w: number, h: number, client: string, kind: string): Project => ({
  src: `${BASE}assets/images/proyectos/${file}.jpg`,
  w,
  h,
  client,
  kind,
});

export const PROJECTS: Project[] = [
  P('johnnie-walker', 960, 1280, 'Johnnie Walker', 'Estructura con pantallas LED'),
  P('csh', 1600, 1205, 'CSH', 'Stand'),
  P('tecnoimagen', 1600, 1205, 'Tecnoimagen', 'Stand'),
  P('neodent', 960, 1280, 'Neodent', 'Stand'),
  P('aaoc-oncologia', 1156, 867, 'AAOC · Congreso de Oncología Clínica 2025', 'Corpóreo iluminado'),
  P('communication-partner', 1280, 963, 'Communication Partner', 'Stand'),
  P('astrazeneca', 960, 1280, 'AstraZeneca', 'Stand'),
  P('covidex', 1600, 1200, 'Covidex', 'Stand'),
  P('vetanco', 1600, 1200, 'Vetanco', 'Stand'),
  P('nutrifarms', 1200, 1600, 'Nutrifarms', 'Stand'),
  P('eczane', 1600, 1200, 'Laboratorio Eczane', 'Stand'),
  P('brox', 1600, 900, 'Brox', 'Espacio de marca'),
  P('aaoc-acreditaciones', 1600, 900, 'AAOC · Post Chicago 2026', 'Acreditaciones'),
];

// Helper para obtener la url activa
export const getImg = (imgObj: any) => {
  if (imgObj.dark || imgObj.light) {
    return imgObj.dark; // Por defecto devolvemos dark, los componentes manejarán el cambio
  }
  return imgObj.local || imgObj.remote;
};
