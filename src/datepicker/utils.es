import parseISO from 'date-fns/parseISO';
import formatDate from 'date-fns/format';

const DATE_FORMAT_ISO = 'yyyy-MM-dd';

export const getValueFromISO = (value, dateFormat) => (
  (value ? formatDate(parseISO(value), dateFormat) : '')
);

export const getValueFromDate = (date) => (
  date ? formatDate(date, DATE_FORMAT_ISO) : ''
);

export const getDate = (dateOrIso) => {
  if (!dateOrIso) return null;
  if (dateOrIso instanceof Date) return dateOrIso;
  return parseISO(dateOrIso);
};

const stripPrefix = (key, prefix) => {
  const strippedKey = key.substring(prefix.length);
  return strippedKey.charAt(0).toLowerCase() + strippedKey.slice(1);
};

export const getSubTheme = (theme, prefix) => (
  Object.entries(theme || {})
    .reduce((acc, [key, value]) => {
      if (key.startsWith(prefix)) {
        acc[stripPrefix(key, prefix)] = value;
      }

      return acc;
    }, {})
);

export const mergeThemes = (baseTheme, otherTheme) => {
  if (!otherTheme) return baseTheme;

  const result = {};
  Object.keys(baseTheme).forEach((key) => {
    const baseValue = baseTheme[key];
    const extendValue = otherTheme[key];

    result[key] = [baseValue, extendValue].filter((v) => Boolean(v)).join(' ');
  });

  return result;
};
