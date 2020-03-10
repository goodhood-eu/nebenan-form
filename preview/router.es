import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Error404 from './containers/error404';
import Form from './containers/form';
import Index from './containers/index';
import Inputs from './containers/inputs';
import DefaultLocked from './containers/locked';

export default () => (
  <Switch>
    <Route path="/" component={Index} exact />

    <Route path="/form" component={Form} />
    <Route path="/inputs" component={Inputs} />
    <Route path="/locked" component={DefaultLocked} />

    <Route component={Error404} />
  </Switch>
);
