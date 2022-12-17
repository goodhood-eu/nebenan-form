import { Switch, Route } from 'react-router-dom';

import Error404 from './containers/error404';
import Index from './containers/index';

export default () => (
  <Switch>
    <Route path="/" component={Index} exact />

    <Route component={Error404} />
  </Switch>
);
