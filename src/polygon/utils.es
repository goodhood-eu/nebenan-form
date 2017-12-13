import {
  POLYGON_ACTIVE,
  POLYGON_HIGHLIGHTED,
  POLYGON_SOLID,
  POLYGON_THIN,
  POLYGON_DEFAULT,
} from './constants';

const COLOR_ACTION = '#afca0b';
const COLOR_DARK70 = '#757575';

const WEIGHT_S = 1;
const WEIGHT_L = 4;

const OPACITY_N = 0;
const OPACITY_S = .2;
const OPACITY_M = .5;

const borderStyles = { weight: WEIGHT_L, dashArray: null, color: COLOR_DARK70 };

const STYLES = {
  [POLYGON_ACTIVE]: {
    ...borderStyles,
    fillColor: COLOR_ACTION,
    fillOpacity: OPACITY_S,
  },
  [POLYGON_HIGHLIGHTED]: {
    ...borderStyles,
    fillColor: COLOR_DARK70,
    fillOpacity: OPACITY_M,
  },
  [POLYGON_SOLID]: {
    ...borderStyles,
    fillColor: COLOR_DARK70,
    fillOpacity: OPACITY_S,
  },
  [POLYGON_THIN]: {
    ...borderStyles,
    fillColor: COLOR_DARK70,
    fillOpacity: OPACITY_S,
    weight: WEIGHT_S,
  },
  [POLYGON_DEFAULT]: {
    ...borderStyles,
    fillOpacity: OPACITY_N,
    dashArray: '5,10',
  },
};

export const getOptions = ({ type, onClick, options: override }) => {
  const preset = STYLES[type];
  const interactive = Boolean(onClick);

  return { ...preset, interactive, ...override };
};
