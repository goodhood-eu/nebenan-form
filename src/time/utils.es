export const cleanValue = (value) => value.replace(':', '');
export const formatValue = (value) => value.replace(/^(\d{2})(\d{1,2})(.*)$/, '$1:$2');

export const isPositiveInteger = (value) => {
  const intValue = parseInt(value, 10);
  return Number.isInteger(intValue) && intValue > 0;
};

export const restoreCaret = (input, position) => {
  let newPosition = position;
  if (newPosition === 3) newPosition += 1;

  input.setSelectionRange(newPosition, newPosition);
};
