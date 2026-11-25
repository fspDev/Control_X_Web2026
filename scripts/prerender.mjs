// Prerender para SEO y GEO.
// Después de `vite build`, abre la web compilada en Chrome sin ventana, deja que React la arme
// y guarda ese HTML dentro de <div id="root"> en dist/index.html. Así los buscadores y las IAs
// que no ejecutan JavaScript reciben el contenido completo. En el navegador, React lo reemplaza al cargar.
// Si no encuentra Chrome, avisa y deja el build como estaba (la web funciona igual).

import { spawn } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { preview } from 'vite';

const DIST = resolve('dist/index.html');
const PORT = 4791;
const BASE = '/Control_X_Web2026/';

const chromePaths = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  `${process.env.LOCALAPPDATA}/Google/Chrome/Application/chrome.exe`,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean);

const chrome = chromePaths.find((p) => existsSync(p));
if (!chrome) {
  console.warn('[prerender] No se encontró Chrome: se deja el build sin prerender. (Se puede indicar con CHROME_PATH)');
  process.exit(0);
}

/** Devuelve el contenido interno del primer <div id="root"> balanceando las etiquetas <div>. */
function innerOfRoot(html) {
  const open = html.indexOf('<div id="root"');
  if (open < 0) return null;
  const start = html.indexOf('>', open) + 1;
  const tag = /<div\b|<\/div>/g;
  tag.lastIndex = start;
  let depth = 1;
  let m;
  while ((m = tag.exec(html))) {
    depth += m[0] === '</div>' ? -1 : 1;
    if (depth === 0) return html.slice(start, m.index);
  }
  return null;
}

function dump(url) {
  return new Promise((resolveDump, reject) => {
    const args = [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--hide-scrollbars',
      '--window-size=1366,900',
      '--virtual-time-budget=9000', // deja correr la pantalla de carga y las animaciones de entrada
      '--dump-dom',
      url,
    ];
    const child = spawn(chrome, args, { stdio: ['ignore', 'pipe', 'ignore'] });
    let out = '';
    child.stdout.on('data', (d) => (out += d));
    const timer = setTimeout(() => {
      child.kill();
      reject(new Error('Chrome tardó demasiado'));
    }, 60000);
    child.on('close', () => {
      clearTimeout(timer);
      resolveDump(out);
    });
  });
}

const server = await preview({ preview: { port: PORT, strictPort: true }, logLevel: 'silent' });
try {
  const html = await dump(`http://localhost:${PORT}${BASE}`);
  const inner = innerOfRoot(html);
  if (!inner || !inner.includes('id="hero"') || !inner.includes('id="contact"')) {
    throw new Error('el HTML generado no tiene el contenido esperado');
  }
  const built = readFileSync(DIST, 'utf8');
  if (!built.includes('<div id="root"></div>')) throw new Error('dist/index.html no tiene el <div id="root"></div> vacío');
  writeFileSync(DIST, built.replace('<div id="root"></div>', `<div id="root" data-prerendered="">${inner}</div>`));
  const text = inner.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  console.log(`[prerender] listo: ${Math.round(inner.length / 1024)} KB de HTML, ${text.split(' ').length} palabras de texto visibles para buscadores e IAs`);
} catch (error) {
  console.warn(`[prerender] Se omite: ${error.message}. El build queda sin prerender.`);
} finally {
  await server.close();
}
