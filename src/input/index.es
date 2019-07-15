import React from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import classNames from 'classnames';

import { getDummyName } from './utils';
import TextInputComponent from './base';


class Input extends TextInputComponent {
  componentDidMount() {
    super.componentDidMount();
    this.generateDummyName();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.disableAutoComplete !== this.props.disableAutoComplete) {
      this.generateDummyName();
    }
  }

  generateDummyName() {
    const { disableAutoComplete, name } = this.props;
    const dummyName = disableAutoComplete ? getDummyName(name) : null;

    this.setState({ dummyName });
  }

  render() {
    const {
      onEnterKey,
      onShiftEnterKey,
      label,
      name,
      type,
      onChange,
      onFocus,
      onBlur,
      children,
    } = this.props;

    const { dummyName, value } = this.state;

    const className = classNames('c-input', this.props.className);
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

    return (
      <label className={className}>
        {labelNode}
        <div className="c-input-container">
          <input
            {...cleanProps}
            name={dummyName || name}
            ref={this.setEl('input')}
            className={inputClassName}
            type={type || 'text'}
            onChange={this.actionChange(onChange)}
            onFocus={this.actionClearError(onFocus)}
            onBlur={this.actionValidate(onBlur)}
            value={value}
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
