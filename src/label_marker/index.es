import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Marker from '../marker';


const LabelMarker = (props) => {
  const { content, className, ...cleanProps } = props;
  const iconClass = classNames('c-label_marker', className);

  const html = `<span class="c-label_marker-container">${content}</span>`;

  const icon = {
    html,
    className: iconClass,
    iconSize: false,
  };

  return <Marker {...cleanProps} divIcon={icon} />;
};

LabelMarker.propTypes = {
  className: PropTypes.string,
  content: PropTypes.string.isRequired,
};

export default LabelMarker;
