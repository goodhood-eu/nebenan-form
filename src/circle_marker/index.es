import React from 'react';
import PropTypes from 'prop-types';
import Marker from '../marker';


const CircleMarker = (props) => {
  const { content, ...cleanProps } = props;

  const icon = {
    iconSize: false,
    className: 'c-circle_marker',
    html: `<span class="c-circle_marker-container"><span class="c-circle_marker-text">${content}</span></span>`,
  };

  return <Marker {...cleanProps} divIcon={icon} />;
};

CircleMarker.propTypes = {
  content: PropTypes.string,
};

export default CircleMarker;
