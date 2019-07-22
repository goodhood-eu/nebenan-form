import { createContext } from 'react';

const noop = () => {};

const defaultContext = {
  addInput: noop,
  removeInput: noop,
  updateValidity: noop,
};

const FormContext = createContext(defaultContext);

export default FormContext;
