import { isInt } from 'string-validate';

const TIME_REGEX = /^(\d{1,2})?(:(\d{1,2})?)?$/;

export const isTimeFormat = (value) => TIME_REGEX.test(value);
export const formatValue = (value) => value.replace(/^(\d{2}):?(\d{1,2})(.*)$/, '$1:$2');

export const getCaretPosition = (currentPosition, oldValue, newValue) => {
  const isCaretAtEnd = currentPosition >= oldValue.length;
  return isCaretAtEnd ? newValue.length : currentPosition;
};

const limitHours = (value) => Math.min(23, Math.max(value, 0));
const limitMinutes = (value) => Math.min(59, Math.max(value, 0));
const padLeft = (value) => value.toString().padStart(2, '0');

export const transformValue = (value, changeMinutes, diff) => {
  const [hours = '', minutes = ''] = value.split(':');

  if (changeMinutes) {
    let intMinutes = parseInt(minutes || 0, 10);
    intMinutes = limitMinutes(intMinutes + diff);
    return `${hours}:${padLeft(intMinutes)}`;
  }

  let intHours = parseInt(hours || 0, 10);
  intHours = limitHours(intHours + diff);

  let result = padLeft(intHours);
  if (minutes) result += `:${minutes}`;

  return result;
};

export const getFormattedValue = (value) => {
  if (isTimeFormat(value)) return value;
  if (isInt(value)) return formatValue(value);
  return null;
};
