const getPrecision = (min, max, step) => {
  const integerLength = Math.max(min, max).toString().length;
  const fraction = step.toString().split('.')[1];
  const fractionLength = fraction ? fraction.length : 0;
  return integerLength + fractionLength;
};

export const ensureValueBounds = (value, min, max) => Math.max(Math.min(value, max), min);

export const convertValueToPercent = (value, min, max) => {
  if (value) return (value - min) / (max - min);
  return 0;
};

export const convertPercentToValue = (percent, min, max, step) => {
  const multiplier = (max - min) / step;
  const value = (Math.round(percent * multiplier) * step) + min;
  const precision = getPrecision(min, max, step);
  return ensureValueBounds(value.toPrecision(precision), min, max);
};
