export const getOption = (option) => {
  if (typeof option !== 'object') return { key: option, value: option };
  const { key, value } = option;
  return { key, value };
};

export const findIndex = (props, value) => (
  props.options.findIndex((item) => getOption(item).value === value)
);
