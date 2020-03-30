export const cleanValue = (value) => value.replace(/:/g, '');
export const formatValue = (value) => value.replace(/^(\d{2})(\d{1,2})(.*)$/, '$1:$2');

export const restoreCaret = (input, position) => {
  input.setSelectionRange(position, position);
};

export const getCaretPosition = (currentPosition, oldValue, newValue) => {
  const isCaretAtEnd = currentPosition >= oldValue.length;
  return isCaretAtEnd ? newValue.length : currentPosition;
};

const limitHours = (value) => Math.min(23, Math.max(value, 0));
const limitMinutes = (value) => Math.min(59, Math.max(value, 0));

const transformValue = (value, caretPosition, transform) => {
  let [hours = '', minutes = ''] = value.split(':');

  if (caretPosition > 2) minutes = limitMinutes(transform(parseInt(minutes, 10)));
  else hours = limitHours(transform(parseInt(hours, 10)));

  return `${hours}:${minutes}`;
};

export const increaseValue = (value, caretPosition) => (
  transformValue(value, caretPosition, (number) => number + 1)
);

export const decreaseValue = (value, caretPosition) => (
  transformValue(value, caretPosition, (number) => number - 1)
);
