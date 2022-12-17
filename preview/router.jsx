import { Switch, Route } from 'react-router-dom';

import Error404 from './containers/error404';
import Form from './containers/form';
import Index from './containers/index';
import Inputs from './containers/inputs';
import DatePicker from './containers/datepicker';

export default () => (
  <Switch>
    <Route path="/" component={Index} exact />

    <Route path="/form" component={Form} />
    <Route path="/inputs" component={Inputs} />
    <Route path="/datepicker" component={DatePicker} />

    <Route component={Error404} />
  </Switch>
);
