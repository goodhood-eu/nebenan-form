import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import omit from 'lodash/omit';

import { invoke } from '../utils';
import TimeInput from './time_input';
import TextInputComponent from '../input/base';


class Time extends TextInputComponent {
  actionChange(action) {
    return (value) => {
      this.setValue(value, this.validate);
      invoke(action, value);
    };
  }

  getValue() {
    let { value } = this.state;
    const [hours, minutes] = value.split(':');

    if (!hours || !minutes) value = null;

    return this.props.onGetValue ? this.props.onGetValue(value) : value;
  }

  // Disable reading value from DOM
  readDomValue() {}

  render() {
    const {
      disabled,
      children,
      label,
      name,
      onChange,
      onBlur,
      onFocus,
    } = this.props;

    const cleanProps = omit(this.props,
      'label',
      'name',
      'error',
      'children',
      'onUpdate',
      'defaultValue',
      'validate',
    );

    const className = clsx(this.props.className, 'c-input', { 'is-disabled': disabled });
    const inputClassName = clsx('ui-input', className, { 'ui-input-error': this.isErrorActive() });

    let labelNode;
    if (label) labelNode = <strong className="ui-label">{label}</strong>;

    let error;
    if (this.isErrorActive()) error = <em className="ui-error">{this.getError()}</em>;

    return (
      <label className={className}>
        {labelNode}
        <div className="c-input-container">
          <TimeInput
            {...cleanProps}
            ref={this.setEl('input')}
            className={inputClassName}
            name={name}
            disabled={disabled}
            value={this.state.value}
            onChange={this.actionChange(onChange)}
            onFocus={this.actionClearError(onFocus)}
            onBlur={this.actionValidate(onBlur)}
          />
          {children}
        </div>
        {error}
      </label>
    );
  }
}

Time.propTypes = {
  ...TextInputComponent.propTypes,

  className: PropTypes.string,
  children: PropTypes.node,
  label: PropTypes.node,
  name: PropTypes.string,

  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

export default Time;
