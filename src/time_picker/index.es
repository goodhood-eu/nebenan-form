import React from 'react';
import InputComponent from '../base/index';
import { TimePickerFormField } from './time-picker-form-filed';


export default class TimePicker extends InputComponent {
  render() {
    const { name, onChange, label, className, required, disabled } = this.props;
    const error = this.isErrorActive() && this.getError();

    return (
      <TimePickerFormField
        ref={this.setEl('input')}
        name={name}
        value={this.state.value}
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
