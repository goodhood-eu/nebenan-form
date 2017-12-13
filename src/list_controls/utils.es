import { has } from 'nebenan-helpers/lib/utils/data';

const VALUE_PROPS = [
  'search',
  'filter',
  'sort',
];

const defaultValue = {};
VALUE_PROPS.forEach((key) => { defaultValue[key] = null; });

export const getValue = (state) => {
  if (!state) return defaultValue;

  const value = {};
  VALUE_PROPS.forEach((key) => { value[key] = has(state, key) ? state[key] : null; });
  return value;
};

export const isValueEmpty = (valueObj) => {
  for (const key of Object.keys(valueObj)) {
    if (valueObj[key]) return false;
  }

  return true;
};

export const getSignature = (state) => {
  if (isValueEmpty(state)) return null;
  return JSON.stringify(state);
};

export const getOptions = (type, optionsList, handler) => {
  const callback = handler.bind(null, type);
  return optionsList.map(({ key, value }) => ({ key, value, callback }));
};
