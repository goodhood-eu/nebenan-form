import { hydrate } from 'react-dom';

import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './router';

const Component = (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
);
hydrate(Component, document.getElementById('main'));
