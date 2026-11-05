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
      remote: "https://picsum.photos/id/600/800/800",
      // local: `${BASE}assets/images/about/taller.jpg`,
      alt: "Taller de Control-X",
    },
  },
  portfolio: [
    {
      id: 1,
      title: "Stand Tecnológico",
      category: "Stands",
      remote: "https://picsum.photos/id/180/600/800",
      gallery: [
        "https://picsum.photos/id/180/1200/800",
        "https://picsum.photos/id/181/1200/800",
        "https://picsum.photos/id/182/1200/800",
      ]
    },
    {
      id: 2,
      title: "Showroom Automotriz",
      category: "Showrooms",
      remote: "https://picsum.photos/id/133/800/600",
      gallery: [
        "https://picsum.photos/id/133/1200/800",
        "https://picsum.photos/id/134/1200/800",
        "https://picsum.photos/id/135/1200/800",
      ]
    },
    {
      id: 3,
      title: "Letras Corpóreas",
      category: "Corpóreas",
      remote: "https://picsum.photos/id/250/600/600",
      gallery: [
        "https://picsum.photos/id/250/1200/800",
        "https://picsum.photos/id/251/1200/800",
        "https://picsum.photos/id/252/1200/800",
      ]
    },
    {
      id: 4,
      title: "Display POS",
      category: "Material POP",
      remote: "https://picsum.photos/id/366/600/800",
      gallery: [
        "https://picsum.photos/id/366/1200/800",
        "https://picsum.photos/id/367/1200/800",
        "https://picsum.photos/id/368/1200/800",
      ]
    },
    {
      id: 5,
      title: "Escenografía TV",
      category: "Escenografías",
      remote: "https://picsum.photos/id/450/800/600",
      gallery: [
        "https://picsum.photos/id/450/1200/800",
        "https://picsum.photos/id/451/1200/800",
        "https://picsum.photos/id/452/1200/800",
      ]
    },
    {
      id: 6,
      title: "Grabado Láser",
      category: "Routeados",
      remote: "https://picsum.photos/id/531/600/600",
      gallery: [
        "https://picsum.photos/id/531/1200/800",
        "https://picsum.photos/id/532/1200/800",
        "https://picsum.photos/id/533/1200/800",
      ]
    },
  ],
};

// Helper para obtener la url activa
export const getImg = (imgObj: any) => {
  if (imgObj.dark || imgObj.light) {
    return imgObj.dark; // Por defecto devolvemos dark, los componentes manejarán el cambio
  }
  return imgObj.local || imgObj.remote;
};
