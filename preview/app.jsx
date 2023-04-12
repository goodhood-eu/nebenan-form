import { createRoot, hydrateRoot } from 'react-dom/client';

import { BrowserRouter, HashRouter } from 'react-router-dom';
import AppRoutes from './router';

const Component = (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
);

const mainNode = document.getElementById('main');
const isPrerender = Boolean(mainNode);

if (isPrerender) {
  hydrateRoot(mainNode, (
    <BrowserRouter>
      {Component}
    </BrowserRouter>
  ));
} else {
  const node = document.createElement('main');
  document.body.appendChild(node);

  createRoot(node).render((
    // eslint-disable-next-line no-undef
    <HashRouter basename={PUBLIC_PATH}>
      {Component}
    </HashRouter>
  ));
}
