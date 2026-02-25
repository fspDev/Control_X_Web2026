// Este archivo centraliza todas las imágenes del sitio.
// Para usar tus propias imágenes:
// 1. Sube los archivos a la carpeta 'public/assets/images/[seccion]/' correspondiente.
// 2. Comenta la línea 'remote' y descomenta la línea 'local'.

export const IMAGES = {
  logo: {
    // Usamos la base URL de Vite para que funcione en cualquier ruta (local o GitHub Pages)
    dark: `${import.meta.env.BASE_URL}assets/images/logo/logo1.png`,
    light: `${import.meta.env.BASE_URL}assets/images/logo/logo2.png`,
    alt: 'Control-X Logo',
  },
  hero: {
    bg: {
      remote: "https://picsum.photos/id/435/1920/1080",
      // local: `${import.meta.env.BASE_URL}assets/images/hero/hero-bg.jpg`,
      alt: "Stand Design Background",
    },
  },
  about: {
    workspace: {
      remote: "https://picsum.photos/id/600/800/800",
      // local: `${import.meta.env.BASE_URL}assets/images/about/taller.jpg`,
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
  clients: {
    // Aquí puedes agregar un array con las rutas de los logos de tus clientes
    // logos: [`${import.meta.env.BASE_URL}assets/images/clients/cliente1.png`, `${import.meta.env.BASE_URL}assets/images/clients/cliente2.png`]
  },
};

// Helper para obtener la url activa
export const getImg = (imgObj: any) => {
  if (imgObj.dark || imgObj.light) {
    return imgObj.dark; // Por defecto devolvemos dark, los componentes manejarán el cambio
  }
  return imgObj.local || imgObj.remote;
};
