import PropTypes from 'prop-types';
import throttle from 'lodash/throttle';
import { invoke } from '../utils';
import InputComponent from '../base';

import { CHECKBOX_CHANGE_RATE } from '../constants';


class CheckboxInputComponent extends InputComponent {
  getDefaultState(props) {
    const state = super.getDefaultState(props);
    state.value = Boolean(props.defaultChecked);
    return state;
  }

  // Protect against setting weird values
  setValue(value, ...args) {
    return super.setValue(Boolean(value), ...args);
  }

  actionChange(action) {
    return (event) => {
      this.setValue(event.target.checked, this.validate);
      invoke(action, event);
    };
  }
}

const throttled = throttle(CheckboxInputComponent.prototype.setValue, CHECKBOX_CHANGE_RATE);
CheckboxInputComponent.prototype.setValue = throttled;

CheckboxInputComponent.propTypes = {
  ...InputComponent.propTypes,
  defaultChecked: PropTypes.bool,
};

export default CheckboxInputComponent;
