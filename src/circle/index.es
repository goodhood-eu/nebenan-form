/* eslint react/no-unused-prop-types: "off" */
import PropTypes from 'prop-types';

import MapComponent from 'nebenan-base-class/lib/map_component';

import { reverse } from 'nebenan-helpers/lib/utils/data';
import { getOptions } from './utils';
import {
  CIRCLE_ACTIVE,
  CIRCLE_DEFAULT,
} from './constants';


class Circle extends MapComponent {
  update(nextProps, nextContext) {
    this.destroy();
    this.create(nextProps, nextContext);
  }

  create(props, context) {
    const { circle: createCircle } = require('leaflet');
    const { center } = props;
    const options = getOptions(props);
    const circle = createCircle(reverse(center), options);

    context.map.addLayer(circle);
    this.circle = circle;
  }

  destroy() {
    this.context.map.removeLayer(this.circle);
    this.circle = null;
  }

  render() { return null; }
}

Circle.defaultProps = {
  type: CIRCLE_DEFAULT,
};

Circle.propTypes = {
  type: PropTypes.oneOf([
    CIRCLE_ACTIVE,
    CIRCLE_DEFAULT,
  ]).isRequired,

  center: PropTypes.arrayOf(PropTypes.number).isRequired,
  radius: PropTypes.number.isRequired,
};

export default Circle;
