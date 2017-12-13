import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Marker from '../marker';


const EyecatcherMarker = (props) => {
  const { content, className, ...cleanProps } = props;
  const iconClass = classNames('c-eyecatcher_marker', className);

  const html = (
    `<div class="c-eyecatcher_marker-container">
      ${content}
    </div>`
  );

  const icon = {
    html,
    className: iconClass,
    iconSize: false,
  };

  return <Marker {...cleanProps} divIcon={icon} />;
};

EyecatcherMarker.propTypes = {
  className: PropTypes.string,
  content: PropTypes.string,
};

export default EyecatcherMarker;
