import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Marker from '../marker';


const IMarker = (props) => {
  const { small, className, ...cleanProps } = props;
  const iconClass = classNames('c-info_marker', className, { 'is-small': small });

  const icon = {
    className: iconClass,
    iconSize: false,
    html: '<i class="icon-i" />',
  };

  return <Marker {...cleanProps} divIcon={icon} />;
};

IMarker.defaultProps = {
  small: false,
};

IMarker.propTypes = {
  className: PropTypes.string,
  small: PropTypes.bool.isRequired,
};

export default IMarker;
