import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Scroll suave global
const style = document.createElement('style');
style.innerHTML = `html{scroll-behavior:smooth}@media (prefers-reduced-motion: reduce){html{scroll-behavior:auto}}`;
document.head.appendChild(style);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* HashRouter para GitHub Pages y otros hostings estáticos sin SPA fallback */}
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
