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
    this.state = this.getDefaultState(props);
    this.staticContext = this.getDefaultContext();
  }

  getDefaultContext() {
    const { addInput, removeInput, updateValidity } = this;
    return { addInput, removeInput, updateValidity };
  }

  getDefaultState(props) {
    return { isValid: !props.defaultLocked };
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
        acc.push(name);
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
      as,
      formError,
      buttonClass,
      buttonText,
      alternativeAction,
      children,
    } = this.props;

    const isDisabled = this.isDisabled();

    const className = clsx('c-form', this.props.className);
    const cleanProps = omit(this.props,
      'as',
      'children',
      'onValidityChange',
      'onValidSubmit',
      'onInvalidSubmit',
      'formError',
      'buttonText',
      'buttonClass',
      'alternativeAction',
      'locked',
      'defaultLocked',
    );

    const Component = as || 'form';

    const isNativeForm = Component === 'form';

    let formProps = { className };
    if (isNativeForm) {
      formProps = {
        ...formProps,
        method: 'post',
        onSubmit: this.submit,
        noValidate: true,
      };
    }

    let error;
    if (formError) {
      error = <strong className="c-form-error ui-error">{formError}</strong>;
    }

    let button;
    if (buttonText) {
      const ButtonComponent = isNativeForm ? 'button' : 'span';

      const buttonProps = {
        className: clsx(buttonClass || 'ui-button ui-button-primary', { 'is-disabled': isDisabled }),
        disabled: isDisabled,
      };

      if (isNativeForm) {
        buttonProps.type = 'submit';
      } else {
        buttonProps.onClick = this.submit;
      }

      button = <ButtonComponent {...buttonProps}>{buttonText}</ButtonComponent>;
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
        <Component {...cleanProps} {...formProps}>
          {children}
          {error}
          {footer}
        </Component>
      </Provider>
    );
  }
}

Form.defaultProps = {
  locked: false,
  defaultLocked: false,
};

Form.propTypes = {
  className: PropTypes.string,

  as: PropTypes.elementType,

  formError: PropTypes.node,
  buttonClass: PropTypes.string,
  buttonText: PropTypes.node,
  alternativeAction: PropTypes.node,

  onValidityChange: PropTypes.func,
  onValidSubmit: PropTypes.func,
  onInvalidSubmit: PropTypes.func,
  onSubmit: PropTypes.func,

  locked: PropTypes.bool.isRequired,
  defaultLocked: PropTypes.bool.isRequired,

  children: PropTypes.node,
};

export default Form;
