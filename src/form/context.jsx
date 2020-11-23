import { createContext } from 'react';

const FormContext = createContext();

export const Consumer = FormContext.Consumer;
export const Provider = FormContext.Provider;

export default FormContext;
