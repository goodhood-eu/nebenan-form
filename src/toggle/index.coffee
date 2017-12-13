React = require('react')
omit = require('lodash/omit')
classNames = require('classnames')

CheckboxInputComponent = require('../checkbox/base')


class Toggle extends CheckboxInputComponent
  render: ->
    if @isErrorActive()
      error = <em className="ui-error">{@getError()}</em>

    className = classNames('c-toggle', @props.className,
      'is-error': error
      'is-disabled': @props.disabled
      'has-label': @props.label
    )
    cleanProps = omit(@props, 'label', 'error', 'className', 'children', 'defaultValue', 'defaultChecked', 'onUpdate')

    <label className={className}>
      <div className="c-toggle-container" >
        <span className="c-toggle-control">
          <input
            {...cleanProps} ref="input"
            type="checkbox"
            onChange={@actionChange(@props.onChange)}
            checked={@state.value}
          />
          <span className="c-toggle-slide">
            <span className="c-toggle-state">
              <em className="is-positive">{@t('generic.yes')}</em>
              <i />
              <em>{@t('generic.no')}</em>
            </span>
          </span>
        </span>
        <strong className="ui-label ui-label-primary c-toggle-label">{@props.label}</strong>
      </div>
      {@props.children}
      {error}
    </label>

module.exports = Toggle
