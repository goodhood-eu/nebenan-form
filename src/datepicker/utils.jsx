import { format, parseISO } from 'date-fns';
import { getSubTheme, mergeThemes } from 'nebenan-helpers/lib/themes';

const DATE_FORMAT_ISO = 'yyyy-MM-dd';

export const getValueFromISO = (value, dateFormat) => (
  (value ? format(parseISO(value), dateFormat) : '')
);

export const getValueFromDate = (date) => (
  date ? format(date, DATE_FORMAT_ISO) : ''
);

export const getDate = (dateOrIso) => {
  if (!dateOrIso) return null;
  if (dateOrIso instanceof Date) return dateOrIso;
  return parseISO(dateOrIso);
};

export const getCalendarTheme = (baseCalendarTheme, passedTheme) => (
  mergeThemes(baseCalendarTheme, getSubTheme(passedTheme, 'calendar'))
);
