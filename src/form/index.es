import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import clsx from 'clsx';
import { bindTo, invoke, has } from '../utils';
import { Provider } from './context';


class Form extends PureComponent {
  constructor(props) {
    super(props);
    bindTo(this,
      'addInput',
      'removeInput',
      'updateValidity',
      'setValues',
      'setErrors',
      'setPristine',
      'reset',
      'validate',
      'submit',
    );

    // Fixes weird iteration over object bugs
    this.inputs = [];
    this.state = this.getDefaultState();
    this.staticContext = this.getDefaultContext();
  }

  getDefaultContext() {
    const { addInput, removeInput, updateValidity } = this;
    return { addInput, removeInput, updateValidity };
  }

  getDefaultState() {
    return { isValid: true };
  }

  getModel() {
    return this.inputs.reduce((acc, Component) => {
      acc[Component.getName()] = Component.getValue();
      return acc;
    }, {});
  }

  setValues(data = {}) {
    this.inputs.forEach((Component) => {
      const name = Component.getName();
      if (has(data, name)) Component.setValue(data[name]);
    });
  }

  setErrors(data = {}) {
    const collect = (acc, Component) => {
      const name = Component.getName();

      if (has(data, name)) {
        Component.setError(data[name]);
        return [...acc, name];
      }

      return acc;
    };

    return this.inputs.reduce(collect, []);
  }

  setPristine(done) {
    this.inputs.forEach((Component) => Component.setPristine());

    let complete;
    if (done) complete = () => process.nextTick(done);

    this.setState(this.getDefaultState(), complete);
  }

  setValid(isValid, done) {
    const complete = () => {
      invoke(this.props.onValidityChange, isValid);
      invoke(done);
    };
    this.setState({ isValid }, complete);
  }

  addInput(Component) {
    if (!this.inputs.includes(Component)) this.inputs.push(Component);
  }

  removeInput(Component) {
    this.inputs = this.inputs.filter((item) => item !== Component);
  }

  isDisabled() {
    return !this.state.isValid || this.props.locked;
  }

  isValid() {
    return this.inputs.every((Component) => Component.isValid());
  }

  isPristine() {
    return this.inputs.every((Component) => Component.isPristine());
  }

  updateValidity(done) {
    this.setValid(this.isValid(), done);
  }

  reset(done) {
    // a quickhack solution to avoid having to pass down callbacks to each Component.reset()
    // and then checking when each was called
    this.inputs.forEach((Component) => Component.reset());

    let complete;
    if (done) complete = () => process.nextTick(done);

    this.setState(this.getDefaultState(), complete);
  }

  validate(done) {
    const promises = this.inputs.map((Component) => Component.validate());

    const success = () => this.setValid(true, done);
    const fail = () => this.setValid(false, done);

    const promise = Promise.all(promises);
    promise.then(success).catch(fail);
    return promise;
  }

  submit(event) {
    if (event) event.preventDefault();
    if (this.isDisabled()) return;
    const { onValidSubmit, onInvalidSubmit, onSubmit } = this.props;

    const args = [this.getModel(), this.setErrors, this.setValues];

    const success = () => {
      const complete = () => invoke(onValidSubmit, ...args);
      this.setPristine(complete);
    };
    const fail = () => invoke(onInvalidSubmit, ...args);

    this.validate().then(success).catch(fail);

    invoke(onSubmit, event);
  }

  render() {
    const {
      formError,
      buttonClass,
      buttonText,
      buttonDataTrack,
      alternativeAction,
      children,
    } = this.props;

    const className = clsx('c-form', this.props.className);
    const cleanProps = omit(this.props,
      'children',
      'onValidityChange',
      'onValidSubmit',
      'onInvalidSubmit',
      'formError',
      'buttonText',
      'buttonClass',
      'buttonDataTrack',
      'alternativeAction',
      'locked',
    );

    let error;
    if (formError) {
      error = <strong className="c-form-error ui-error">{formError}</strong>;
    }

    let button;
    if (buttonText) {
      const buttonClassName = buttonClass || 'ui-button ui-button-primary';
      const trackProps = buttonDataTrack && { 'data-track': buttonDataTrack };

      button = (
        <button className={buttonClassName} type="submit" disabled={this.isDisabled()} {...trackProps}>
          {buttonText}
        </button>
      );
    }

    let footer;
    if (button || alternativeAction) {
      footer = (
        <div className="c-form-footer ui-controls">
          {button}
          {alternativeAction}
        </div>
      );
    }

    return (
      <Provider value={this.staticContext}>
        <form
          {...cleanProps} className={className}
          method="post" onSubmit={this.submit} noValidate
        >
          {children}
          {error}
          {footer}
        </form>
      </Provider>
    );
  }
}

Form.propTypes = {
  className: PropTypes.string,
  formError: PropTypes.node,
  buttonClass: PropTypes.string,
  buttonDataTrack: PropTypes.string,
  buttonText: PropTypes.node,
  alternativeAction: PropTypes.node,

  onValidityChange: PropTypes.func,
  onValidSubmit: PropTypes.func,
  onInvalidSubmit: PropTypes.func,
  onSubmit: PropTypes.func,

  locked: PropTypes.bool,

  children: PropTypes.node,
};

export default Form;
