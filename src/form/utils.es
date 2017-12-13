export const isInputFilled = (Component, inputs) => (
  inputs.some((input) => input instanceof Component && input.getValue())
);
