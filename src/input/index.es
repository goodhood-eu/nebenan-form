import React from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import classNames from 'classnames';

import TextInputComponent from './base';


class Input extends TextInputComponent {
  render() {
    const { value } = this.state;
    const {
      disabled,
      name: originalName,
      disableAutoComplete,
      onEnterKey,
      onShiftEnterKey,
      label,
      type,
      onChange,
      onFocus,
      onBlur,
      children,
    } = this.props;

    const className = classNames('c-input', this.props.className, {
      'is-disabled': disabled,
    });

    const cleanProps = omit(this.props,
      'disableAutoComplete',
      'label',
      'name',
      'error',
      'children',
      'onUpdate',
      'onEnterKey',
      'onShiftEnterKey',
      'onGetValue',
      'defaultValue',
      'validate',
    );

    const inputClassName = classNames('ui-input', { 'ui-input-error': this.isErrorActive() });
    if (onEnterKey || onShiftEnterKey) cleanProps.onKeyDown = this.handleKeyDown;

    let labelNode;
    if (label) labelNode = <strong className="ui-label">{label}</strong>;

    let error;
    if (this.isErrorActive()) error = <em className="ui-error">{this.getError()}</em>;

    let name;
    if (!disableAutoComplete) {
      name = originalName;
    }

    return (
      <label className={className}>
        {labelNode}
        <div className="c-input-container">
          <input
            {...cleanProps}
            {...{ value, name }}
            ref={this.setEl('input')}
            className={inputClassName}
            type={type || 'text'}
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

Input.defaultProps = {
  disableAutoComplete: false,
};

Input.propTypes = {
  ...TextInputComponent.propTypes,

  disableAutoComplete: PropTypes.bool.isRequired,

  className: PropTypes.string,
  children: PropTypes.node,
  label: PropTypes.node,
  name: PropTypes.string,

  type: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

export default Input;
