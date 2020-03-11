import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import omit from 'lodash/omit';
import TimeField from 'react-simple-timefield';
import TextInputComponent from '../input/base';


const style = { width: undefined }; // hack for reset react-simple-timefield style

export default class TimePicker extends TextInputComponent {
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
          <TimeField
            {...cleanProps}
            ref={this.setEl('input')}
            className={inputClassName}
            style={style}
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

TimePicker.propTypes = {
  ...TextInputComponent.propTypes,

  className: PropTypes.string,
  children: PropTypes.node,
  label: PropTypes.node,
  name: PropTypes.string,

  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};
