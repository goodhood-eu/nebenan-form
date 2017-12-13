React = require('react')
classNames = require('classnames')
omit = require('lodash/omit')

InputProxyComponent = require('nebenan-base-class/lib/input_proxy_component')
Autocomplete = require('../autocomplete')


class TagInput extends InputProxyComponent
  getInput: => @refs.input.getInput()
  focus: => @getInput().focus()
  blur: => @getInput().blur()

  handleEnterKey: (event) =>
    event.preventDefault()
    @props.onEnterKey?(event)
    @handleSelect()

  handleClick: (event) =>
    event.preventDefault() # do not reset validation
    @handleSelect()

  handleSelect: =>
    @getInput().validate().then(@handleValidSelect)

  handleValidSelect: =>
    value = @getValue()
    @props.onSelect?(value) if value

  render: ->
    className = classNames('c-tag_input', @props.className)
    cleanProps = omit(@props, 'children', 'onSelect')

    <Autocomplete
      {...cleanProps}
      ref="input"
      className={className}
      placeholder={@props.placeholder}
      onEnterKey={@handleEnterKey}
      onSelect={@handleSelect}
      error={@t('input.error_short_text')}
      validate="isShortText"
    >
      <span className="c-tag_input-add_button" onClick={@handleClick}>{@t('generic.add')}</span>
      {@props.children}
    </Autocomplete>

module.exports = TagInput
