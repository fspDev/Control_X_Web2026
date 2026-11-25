import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Si el HTML viene prerenderizado (build de producción), no se muestra la pantalla de carga:
// el contenido ya está a la vista y no debe parpadear.
const prerendered = rootElement.hasAttribute("data-prerendered");

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App skipIntro={prerendered} />
  </React.StrictMode>
);