/* eslint react/no-string-refs: "off" */
/* eslint react/no-unused-prop-types: "off" */

import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import * as validations from 'string-validate';
import { bindTo, invoke, objectPropsMatch } from '../utils';
import FormContext from '../form/context';


const parseArgument = (value) => {
  try {
    return JSON.parse(value);
  } catch (err) {
    return value;
  }
};

export const parseValidations = (validationsString) => {
  if (!validationsString) return [];
  if (typeof validationsString !== 'string') throw new Error('Validation must be a string');

  return validationsString.split(';').reduce((acc, validation) => {
    const [name, argString] = validation.split(/:(.*)/);
    if (name === 'isRequired' || name === 'isRegex' || !validations[name]) return acc;
    const args = argString ? argString.split(',') : [];
    acc.push((...ownArgs) => validations[name](...ownArgs, ...args.map(parseArgument)));
    return acc;
  }, []);
};

export const getRegexValidation = (pattern) => {
  const regex = new RegExp(`^${pattern}$`);
  return (value) => validations.isRegex(value, regex);
};

const VALIDATION_PROPS = ['validate', 'required', 'pattern'];


class InputComponent extends PureComponent {
  constructor(props) {
    super(props);

    bindTo(this,
      'validate',
      'clearValidationError',
      'setValidationError',
      'setError',
    );

    this.els = {};
    this.state = this.getDefaultState(props);
  }

  componentDidMount() {
    this.isComponentMounted = true;
    if (this.isConnected()) this.getFormContext().addInput(this);
    const { syncValidations, customValidation } = this.getValidations(this.props);
    this.syncValidations = syncValidations;
    this.customValidation = customValidation;
  }

  componentDidUpdate(prevProps) {
    if (objectPropsMatch(prevProps, this.props, VALIDATION_PROPS)) return;
    const { syncValidations, customValidation } = this.getValidations(this.props);
    this.syncValidations = syncValidations;
    this.customValidation = customValidation;
  }

  componentWillUnmount() {
    if (this.isConnected()) this.getFormContext().removeInput(this);
    this.isComponentMounted = false;
  }

  setEl(name) {
    return (el) => { this.els[name] = el; };
  }

  getDefaultState(props) {
    return {
      isPristine: true,
      isValid: true,
      error: null,
      value: props.defaultValue,
    };
  }

  getFormContext() {
    return this.context;
  }

  getValidations(props) {
    let syncValidations = [];
    let customValidation = null;

    if (typeof props.validate === 'function') customValidation = props.validate;
    else syncValidations = parseValidations(props.validate);

    if (props.required) syncValidations.push(validations.isRequired);
    if (props.pattern) syncValidations.push(getRegexValidation(props.pattern));

    return { syncValidations, customValidation };
  }

  getInput() {
    return this.els.input;
  }

  getValidation(value) {
    const hasValue = validations.isRequired(value);

    // Prevent validating empty non-required fields, reject early if input is required and empty
    if (!hasValue) {
      if (this.isRequired()) return Promise.reject();
      return Promise.resolve();
    }

    // Prevent custom validation triggering if default validations are invalid
    for (const func of this.syncValidations) {
      if (!func(value)) return Promise.reject();
    }

    if (this.customValidation) {
      const isValid = this.customValidation(value);
      // Expect it to be some kind of a promise
      if (typeof isValid === 'object') return isValid;
      if (!isValid) return Promise.reject();
    }

    return Promise.resolve();
  }

  getValidationError() {
    return this.props.error || true;
  }

  setValidationError() {
    return this.setError(this.getValidationError());
  }

  getError() {
    return this.state.error;
  }

  getName() {
    return this.props.name;
  }

  getValue() {
    return this.state.value;
  }

  setValue(value, done, options = {}) {
    if (!this.isComponentMounted) return;

    const updater = (state, props) => {
      const isPristine = false;
      const { isValid, error } = this.getDefaultState(props);
      return { isPristine, isValid, error, value };
    };

    const complete = () => {
      const { onUpdate } = this.props;
      const { silent } = options;

      if (!silent) invoke(onUpdate, this.getValue());
      if (this.isConnected()) this.getFormContext().updateValidity();

      invoke(done);
    };

    this.setState(updater, complete);
  }

  setError(error, done) {
    if (!this.isComponentMounted) return;
    const isPristine = false;
    const isValid = !error;

    const complete = () => {
      invoke(this.props.onError, this.getError());
      if (this.isConnected()) this.getFormContext().updateValidity();

      invoke(done);
    };

    this.setState({ isPristine, isValid, error }, complete);
  }

  setPristine(done) {
    if (!this.isComponentMounted) return;
    const updater = (state, props) => omit(this.getDefaultState(props), 'value');
    this.setState(updater, done);
  }

  isConnected() {
    // Note: this might cause a loose form state if name prop becomes reset to a falsy value.
    // The input will either never connect or never disconnect. Very unlikely to happen in the wild.
    return Boolean(this.getFormContext() && this.getName());
  }

  isValid() {
    return this.state.isValid;
  }

  isPristine() {
    return this.state.isPristine;
  }

  isErrorActive() {
    return !this.isValid() && this.getError();
  }

  isRequired() {
    return this.syncValidations.includes(validations.isRequired);
  }

  clearValidationError() {
    return this.setError(null);
  }

  validate() {
    const promise = this.getValidation(this.getValue());
    promise.then(this.clearValidationError).catch(this.setValidationError);
    return promise;
  }

  reset(done) {
    if (!this.isComponentMounted) return;
    const updater = (state, props) => this.getDefaultState(props);
    this.setState(updater, done);
  }

  actionChange(action) {
    return (event) => {
      this.setValue(event.target.value);
      invoke(action, event);
    };
  }

  actionClearError(action) {
    return (event) => {
      this.setError(null);
      invoke(action, event);
    };
  }

  actionValidate(action) {
    return (event) => {
      this.validate();
      invoke(action, event);
    };
  }
}

InputComponent.contextType = FormContext;

InputComponent.propTypes = {
  validate: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
  ]),

  disabled: PropTypes.bool,
  required: PropTypes.bool,
  pattern: PropTypes.string,
  defaultValue: PropTypes.any,

  error: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  name: PropTypes.string,

  onUpdate: PropTypes.func,
  onError: PropTypes.func,
};

export default InputComponent;
export { useStateControlledInput } from './hooks';
export { FormContext };
