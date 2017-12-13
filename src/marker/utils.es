export const getIcon = (leaflet, divIcon, defaultIcon) => {
  if (divIcon) return leaflet.divIcon(divIcon);
  if (defaultIcon) return leaflet.icon(defaultIcon);
};
