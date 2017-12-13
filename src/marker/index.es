/* eslint react/no-unused-prop-types: "off" */
import PropTypes from 'prop-types';
import MapComponent from 'nebenan-base-class/lib/map_component';

import { reverse } from 'nebenan-helpers/lib/utils/data';
import { getIcon } from './utils';


class Marker extends MapComponent {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
    };
  }

  setMarker(marker) {
    this.marker = marker;
    this.setState({ isReady: Boolean(marker) });
  }

  getChildContext() {
    return { marker: this.marker };
  }

  updateListener(props, nextProps, listener, prop) {
    if (props[prop] === nextProps[prop]) return;
    this.marker.off(listener);
    this.marker.on(listener, nextProps[prop]);
  }

  update(nextProps, nextContext) {
    if (nextProps.options !== this.props.options) {
      this.destroy();
      this.create(nextProps, nextContext);
      return;
    }

    const { marker } = this;
    const { position, divIcon, icon: defaultIcon, tooltip } = nextProps;

    if (position !== this.props.position) {
      marker.setLatLng(reverse(position));
    }

    if (divIcon !== this.props.divIcon || defaultIcon !== this.props.icon) {
      const icon = getIcon(this.leaflet, divIcon, defaultIcon);
      marker.setIcon(icon);
    }

    if (this.props.tooltip !== tooltip) {
      marker.unbindTooltip();
      marker.bindTooltip(tooltip);
    }

    this.updateListener(this.props, nextProps, 'click', 'onClick');
    this.updateListener(this.props, nextProps, 'popupopen', 'onPopupOpen');
    this.updateListener(this.props, nextProps, 'popupclose', 'onPopupClose');
  }

  create(props, context) {
    this.leaflet = require('leaflet');
    const { marker: createMarker } = this.leaflet;
    const {
      tooltip,
      position,
      options,
      divIcon,
      icon: defaultIcon,
      onClick,
      onPopupOpen,
      onPopupClose,
    } = props;

    const icon = getIcon(this.leaflet, divIcon, defaultIcon);
    const interactive = Boolean(onClick);
    const marker = createMarker(reverse(position), { ...options, icon, interactive });

    if (tooltip) marker.bindTooltip(tooltip);
    if (onPopupOpen) marker.on('popupopen', onPopupOpen);
    if (onPopupClose) marker.on('popupclose', onPopupClose);
    if (onClick) marker.on('click', onClick);

    context.map.addLayer(marker);
    this.setMarker(marker);
  }

  destroy() {
    this.context.map.removeLayer(this.marker);
    this.marker.off();
    this.setMarker(null);
  }

  render() {
    if (this.state.isReady) return this.props.children;
    return null;
  }
}

Marker.childContextTypes = {
  marker: PropTypes.object,
};

Marker.defaultProps = {
  children: null,
};

Marker.propTypes = {
  children: PropTypes.node,
  position: PropTypes.arrayOf(PropTypes.number),
  options: PropTypes.object,
  divIcon: PropTypes.object,
  icon: PropTypes.object,
  tooltip: PropTypes.string,

  onClick: PropTypes.func,
  onPopupOpen: PropTypes.func,
  onPopupClose: PropTypes.func,
};

export default Marker;
