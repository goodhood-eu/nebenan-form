import parseISO from 'date-fns/parseISO';
import formatDate from 'date-fns/format';

export const getValue = (value, dateFormat) => (
  (value ? formatDate(parseISO(value), dateFormat) : '')
);
