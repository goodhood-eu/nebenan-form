throttle = require('lodash/throttle')
InputComponent = require('nebenan-base-class/lib/input_component')
CHECKBOX_CHANGE_RATE = 300


class CheckboxInputComponent extends InputComponent
  getDefaultState: (props) ->
    state = super(props)
    state.value = Boolean(props.defaultChecked)
    state

  # Protect against setting weird values
  setValue: (value, args...) -> super(Boolean(value), args...)

  actionChange: (action) ->
    (event) =>
      @setValue(event.target.checked, @validate)
      action?(event)

CheckboxInputComponent::setValue = throttle(CheckboxInputComponent::setValue, CHECKBOX_CHANGE_RATE)
module.exports = CheckboxInputComponent
