const STYLES_PREFIXES = {
  transform: ['Webkit', 'ms'],
};

const capitalizeFirst = (string = '') => string.charAt(0).toUpperCase() + string.slice(1);


export const documentOffset = (documentContainer, node) => {
  if (!documentContainer || !node) throw new Error('Both documentContainer and node are required');
  if (typeof node.getBoundingClientRect !== 'function') throw new Error('Wrong arguments order');

  const { top, left } = node.getBoundingClientRect();

  // can't use scrollX and scrollY because IE
  const { pageXOffset = 0, pageYOffset = 0 } = documentContainer;

  return {
    left: Math.round(left + pageXOffset),
    top: Math.round(top + pageYOffset),
  };
};

export const size = (node) => ({
  width: node.offsetWidth,
  height: node.offsetHeight,
});

export const getPrefixed = (styles) => {
  const result = { ...styles };

  for (const key of Object.keys(styles)) {
    if (!STYLES_PREFIXES[key]) continue;

    STYLES_PREFIXES[key].forEach((prefix) => {
      // react uses camelCase
      result[`${prefix}${capitalizeFirst(key)}`] = styles[key];
    });
  }

  return result;
};

export const eventCoordinates = (event, ...args) => {
  const prop = event.touches ? event.touches[0] : event;
  return args.reduce((acc, name) => {
    acc[name] = prop[name];
    return acc;
  }, {});
};
