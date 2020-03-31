import parseISO from 'date-fns/parseISO';
import formatDate from 'date-fns/format';

export const getValue = (t, value) => (
  (value ? formatDate(parseISO(value), t('system.date_format')) : '')
);
export const toString = (value) => formatDate(value, 'yyyy-MM-dd');
