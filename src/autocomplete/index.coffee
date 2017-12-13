React = require('react')
omit = require('lodash/omit')
classNames = require('classnames')

keymanager = require('nebenan-helpers/lib/keymanager').default
eventproxy = require('nebenan-helpers/lib/eventproxy').default

InputProxyComponent = require('nebenan-base-class/lib/input_proxy_component')
Input = require('../input')
ContextList = require('../context_list')

defaultGetValue = (key, options) -> options[key]


class Autocomplete extends InputProxyComponent
  componentWillUnmount: ->
    @hide()
    super()

  componentWillReceiveProps: (nextProps) ->
    if nextProps.options?.length and nextProps.options isnt @props.options
      @show()
    else
      @hide()

  focus: => @getInput().focus()
  blur: => @getInput().blur()

  show: =>
    return if @isActive

    @refs.list.activate()
    @stopListeningToKeys = keymanager('esc', @hide)
    @stopListeningToClicks = eventproxy('click', @handleGlobalClick)

    @isActive = true

  hide: =>
    return unless @isActive

    @refs.list.deactivate()
    @stopListeningToKeys()
    @stopListeningToClicks()

    @isActive = false

  handleGlobalClick: (event) =>
    return unless @isComponentMounted
    @hide() if not @refs.container.contains(event.target)

  handleSelect: (key) =>
    getValue = @props.getValue or defaultGetValue
    value = getValue(key, @props.options)

    complete = =>
      @isSelected = false
      @hide()
      @refs.input.validate()
      @props.onSelect?(value, key)

    @isSelected = true
    @refs.input.setValue(value, complete)

  handleUpdate: (value) =>
    if @isSelected
      @props.onUpdate?(value, 'select')
    else
      @props.onUpdate?(value, 'change')
      @props.onInput?(value)

  renderList: ->
    { options, getOption } = @props

    <ContextList
      ref="list"
      className="ui-card ui-options"
      options={options}
      getOption={getOption}
      onSelect={@handleSelect}
    />

  render: ->
    className = classNames('c-autocomplete', @props.className)
    cleanProps = omit(@props, 'children', 'options', 'getOption', 'onInput', 'onSelect', 'getValue', 'className')

    <article ref="container" className={className}>
      <Input {...cleanProps} ref="input" autoComplete="off" onUpdate={@handleUpdate}>
        {@renderList()}
        {@props.children}
      </Input>
    </article>

module.exports = Autocomplete
