/* eslint react/no-unused-prop-types: "off" */
import PropTypes from 'prop-types';
import MapComponent from 'nebenan-base-class/lib/map_component';

import { reverse } from 'nebenan-helpers/lib/utils/data';
import { getOptions } from './utils';
import {
  POLYGON_ACTIVE,
  POLYGON_HIGHLIGHTED,
  POLYGON_SOLID,
  POLYGON_THIN,
  POLYGON_DEFAULT,
} from './constants';


class Polygon extends MapComponent {
  update(nextProps, nextContext) {
    this.destroy();
    this.create(nextProps, nextContext);
  }

  create(props, context) {
    const { polygon: createPolygon } = require('leaflet');
    const { area, onClick } = props;
    const options = getOptions(props);
    const polygon = createPolygon(area.map(reverse), options);

    if (onClick) polygon.on('click', onClick);

    context.map.addLayer(polygon);
    this.polygon = polygon;
  }

  destroy() {
    this.polygon.off();
    this.context.map.removeLayer(this.polygon);
    this.polygon = null;
  }

  render() { return null; }
}

Polygon.defaultProps = {
  type: POLYGON_DEFAULT,
};

Polygon.propTypes = {
  type: PropTypes.oneOf([
    POLYGON_ACTIVE,
    POLYGON_HIGHLIGHTED,
    POLYGON_SOLID,
    POLYGON_THIN,
    POLYGON_DEFAULT,
  ]).isRequired,

  area: PropTypes.arrayOf(
    PropTypes.arrayOf(PropTypes.number),
  ).isRequired,

  options: PropTypes.object,

  onClick: PropTypes.func,
};

export default Polygon;
