import React from 'react';
import InputComponent from '../base/index';
import { TimePickerFormFiled } from './time-picker-form-filed';

export default class TimePicker extends InputComponent {
  render() {
    const { name, onChange, label, className, required, disabled } = this.props;
    const error = this.isErrorActive() && this.getError();

    return (
      <TimePickerFormFiled
        ref={this.setEl('input')}
        name={name}
        label={label}
        error={error}
        required={required}
        disabled={disabled}
        onChange={this.actionChange(onChange)}
        className={className}

      />
    );
  }
}

TimePicker.propTypes = {
  ...InputComponent.propTypes,
};
