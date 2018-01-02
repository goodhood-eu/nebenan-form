import React from 'react';
import Route from 'react-router/lib/Route';

import Error404 from './containers/error404';
import Form from './containers/form';
import Index from './containers/index';
import Inputs from './containers/inputs';

export default () => (
  <div>
    <Route path="/" component={Index} />

    <Route path="/form" component={Form} />
    <Route path="/inputs" component={Inputs} />

    <Route path="*" component={Error404} />
  </div>
);
