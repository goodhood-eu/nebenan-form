import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Marker from '../marker';


const ImageMarker = (props) => {
  const { image, caption, className, ...cleanProps } = props;
  const iconClass = classNames('c-image_marker', className);

  let html = `<span class="c-image_marker-container" style='background-image: url(${image})'></span>`;
  if (caption) html += `<span class="c-image_marker-caption ui-card">${caption}</span>`;

  const icon = {
    html,
    className: iconClass,
    iconSize: false,
  };

  return <Marker {...cleanProps} divIcon={icon} />;
};

ImageMarker.propTypes = {
  className: PropTypes.string,
  image: PropTypes.string.isRequired,
  caption: PropTypes.string,
};

export default ImageMarker;
