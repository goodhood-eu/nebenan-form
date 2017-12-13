import React from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import classNames from 'classnames';

import TextInputComponent from './base';


class Input extends TextInputComponent {
  render() {
    const {
      onEnterKey,
      onShiftEnterKey,
      label,
      type,
      onChange,
      onFocus,
      onBlur,
      children,
    } = this.props;

    const className = classNames('c-input', this.props.className);
    const cleanProps = omit(this.props,
      'label',
      'error',
      'children',
      'onUpdate',
      'onEnterKey',
      'onShiftEnterKey',
      'defaultValue',
      'validate',
    );

    const inputClassName = classNames('ui-input', { 'ui-input-error': this.isErrorActive() });
    if (onEnterKey || onShiftEnterKey) cleanProps.onKeyDown = this.handleKeyDown;

    let error;
    if (this.isErrorActive()) error = <em className="ui-error">{this.getError()}</em>;

    return (
      <label className={className}>
        <strong className="ui-label">{label}</strong>
        <div className="c-input-container">
          <input
            {...cleanProps} ref={this.setEl('input')} className={inputClassName}
            type={type || 'text'}
            onChange={this.actionChange(onChange)}
            onFocus={this.actionClearError(onFocus)}
            onBlur={this.actionValidate(onBlur)}
            value={this.state.value}
          />
          {children}
        </div>
        {error}
      </label>
    );
  }
}

Input.propTypes = {
  ...TextInputComponent.propTypes,

  className: PropTypes.string,
  children: PropTypes.node,
  label: PropTypes.node,

  type: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

export default Input;
