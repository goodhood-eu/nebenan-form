/* eslint react/no-unused-prop-types: "off" */
import PropTypes from 'prop-types';
import MapComponent from 'nebenan-base-class/lib/map_component';


class MarkerPopup extends MapComponent {
  update(nextProps, nextContext) {
    this.destroy();
    this.create(nextProps, nextContext);
  }

  create(props, context) {
    const { popup: createPopup } = require('leaflet');
    const { content, className, options: baseOptions, defaultOpen } = props;
    const options = { ...baseOptions, className };

    const popup = createPopup(options);
    popup.setContent(content);
    context.marker.bindPopup(popup);
    if (defaultOpen) context.marker.openPopup();

    this.popup = popup;
  }

  destroy() {
    this.context.marker.unbindPopup();
    this.popup = null;
  }

  render() { return null; }
}

MarkerPopup.contextTypes = {
  marker: PropTypes.object,
};

MarkerPopup.defaultProps = {
  defaultOpen: false,
};

MarkerPopup.propTypes = {
  className: PropTypes.string,
  content: PropTypes.string,
  options: PropTypes.object,
  defaultOpen: PropTypes.bool.isRequired,
};

export default MarkerPopup;
