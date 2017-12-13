React = require('react')
PropTypes = require('prop-types')
omit = require('lodash/omit')
throttle = require('lodash/throttle')
classNames = require('classnames')

CHECKBOX_CHANGE_RATE = 300

InputComponent = require('nebenan-base-class/lib/input_component')


class Radio extends InputComponent
  @propTypes: options: PropTypes.array.isRequired

  getDefaultState: (props) ->
    state = super(props)
    state.value ?= null
    state

  handleChange: (value, event) ->
    @setValue(value, @validate)
    @props.onChange?(event)

  renderRadio: (option, index) =>
    isChecked = @state.value is option.value
    className = classNames('c-radio-item',
      'is-checked': isChecked
    )
    cleanProps = omit(@props, 'error', 'className', 'children', 'type', 'options', 'defaultValue', 'defaultChecked', 'onUpdate')

    if option.label
      label =
        <strong className="c-radio-item-label ui-label ui-label-primary">
          {option.label}
        </strong>

    <label key={option.value} className={className}>
      <div className="c-radio-item-container" >
        <span className="c-radio-item-control">
          <input
            {...cleanProps} ref="input"
            type="radio"
            value={index}
            checked={isChecked}
            onChange={@handleChange.bind(@, option.value)}
          />
          <i className="c-radio-item-state" />
        </span>
        {label}
      </div>
      {option.children}
    </label>

  render: ->
    className = classNames('c-radio', @props.className,
      "is-type-#{@props.type}": @props.type
      'is-error': @isErrorActive()
    )

    radios = @props.options.map(@renderRadio)

    if @isErrorActive()
      error = <em className="ui-error">{@getError()}</em>

    <article className={className}>
      {radios}
      {@props.children}
      {error}
    </article>

Radio::setValue = throttle(Radio::setValue, CHECKBOX_CHANGE_RATE)
module.exports = Radio
