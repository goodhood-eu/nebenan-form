import React from 'react';
import { hydrate } from 'react-dom';

import Router from 'react-router/lib/Router';
import browserHistory from 'react-router/lib/browserHistory';

import createRouter from './router';

const routes = createRouter();
hydrate(<Router history={browserHistory} routes={routes} />, document.getElementById('main'));
