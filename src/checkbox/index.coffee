React = require('react')
omit = require('lodash/omit')
classNames = require('classnames')

CheckboxInputComponent = require('./base')


class Checkbox extends CheckboxInputComponent
  render: ->
    if @isErrorActive()
      error = <em className="ui-error">{@getError()}</em>

    className = classNames('c-checkbox', @props.className,
      'is-error': error
      'is-disabled': @props.disabled
      'has-label': @props.label
    )
    cleanProps = omit(@props, 'label', 'error', 'className', 'children', 'defaultValue', 'defaultChecked', 'onUpdate')

    <label className={className}>
      <div className="c-checkbox-container" >
        <span className="c-checkbox-control">
          <input
            {...cleanProps} ref="input"
            type="checkbox"
            onChange={@actionChange(@props.onChange)}
            checked={@state.value}
          />
          <i className="c-checkbox-state icon-checkmark" />
        </span>
        <strong className="ui-label ui-label-primary">{@props.label}</strong>
      </div>
      {@props.children}
      {error}
    </label>

module.exports = Checkbox
