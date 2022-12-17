import parseISO from 'date-fns/parseISO';
import formatDate from 'date-fns/format';
import { getSubTheme, mergeThemes } from 'nebenan-helpers/lib/themes';

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

export const getCalendarTheme = (baseCalendarTheme, passedTheme) => (
  mergeThemes(baseCalendarTheme, getSubTheme(passedTheme, 'calendar'))
);
