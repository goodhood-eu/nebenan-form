React = require('react')
omit = require('lodash/omit')
classNames = require('classnames')

TextInputComponent = require('./base')


class Input extends TextInputComponent
  render: ->
    className = classNames('c-input', @props.className)
    cleanProps = omit(@props,
      'label', 'error', 'children', 'onUpdate', 'onEnterKey', 'onShiftEnterKey',
      'defaultValue', 'validate'
    )

    inputClassName = classNames('ui-input', 'ui-input-error': @isErrorActive())
    cleanProps.onKeyDown = @handleKeyDown if @props.onEnterKey or @props.onShiftEnterKey

    if @isErrorActive()
      error = <em className="ui-error">{@getError()}</em>

    <label className={className}>
      <strong className="ui-label">{@props.label}</strong>
      <div className="c-input-container">
        <input
          {...cleanProps} ref="input" className={inputClassName}
          type={@props.type or 'text'}
          onChange={@actionChange(@props.onChange)}
          onFocus={@actionClearError(@props.onFocus)}
          onBlur={@actionValidate(@props.onBlur)}
          value={@state.value}
        />
        {@props.children}
      </div>
      {error}
    </label>

module.exports = Input
