import React from 'react';
import PropTypes from 'prop-types';

import {
  PIN_MARKER_PRIMARY,
  PIN_MARKER_SECONDARY,
} from './constants';

import Marker from '../marker';


const PinMarker = (props) => {
  const { type, ...cleanProps } = props;

  const icon = {
    iconUrl: `/images/map/pin_${type}.png`,
    iconSize: [45, 45],
    iconAnchor: [22, 45],

    iconRetinaUrl: null,
    shadowUrl: null,
    shadowRetinaUrl: null,
    shadowSize: null,
    shadowAnchor: null,
  };

  return <Marker {...cleanProps} icon={icon} />;
};

PinMarker.defaultProps = {
  type: PIN_MARKER_SECONDARY,
};

PinMarker.propTypes = {
  type: PropTypes.oneOf([
    PIN_MARKER_PRIMARY,
    PIN_MARKER_SECONDARY,
  ]),
};

export default PinMarker;
