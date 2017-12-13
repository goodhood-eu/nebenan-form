React = require('react')
PropTypes = require('prop-types')
omit = require('lodash/omit')
throttle = require('lodash/throttle')
classNames = require('classnames')

eventproxy = require('nebenan-helpers/lib/eventproxy').default

InputComponent = require('nebenan-base-class/lib/input_component')
Emoji = require('../emoji').default

TAG_LIMIT = 15
CHECKBOX_CHANGE_RATE = 300


class TagCloud extends InputComponent
  @propTypes: items: PropTypes.array.isRequired

  constructor: (props) ->
    if props.multiple and props.radio
      throw new Error('TagCloud can be either multiple, or radio, not both.')

    super(props)

  componentDidMount: ->
    @activate() unless @props.readOnly
    super()

  componentWillUnmount: ->
    @deactivate()
    super()

  componentWillReceiveProps: (nextProps) ->
    if nextProps.readOnly then @deactivate() else @activate()

  getDefaultState: (props) ->
    state = super(props)
    state.value ?= if props.multiple then [] else null
    state

  activate: ->
    return if @isActive
    @stopListeningToClicks = eventproxy('click', @handleGlobalClick)
    @isActive = true

  deactivate: ->
    return unless @isActive
    @stopListeningToClicks()
    @isActive = false

  handleGlobalClick: (event) =>
    return unless @isComponentMounted
    @validate() if not @isPristine() and not @refs.container.contains(event.target)

  getOption: (option) ->
    if typeof option is 'object'
      { key, value } = option
    else
      key = value = option

    { key, value }

  handleClick: (item, event) ->
    { value } = @getOption(item)
    currentValue = @getValue()

    if @props.multiple
      newValue = currentValue.slice()
      index = newValue.indexOf(value)

      if index >= 0
        newValue.splice(index, 1)
      else
        newValue.push(value)

    else
      if currentValue is value and not @props.radio
        newValue = null
      else
        newValue = value

    @setValue(newValue) unless newValue is currentValue
    @actionClearError(@props.onClick)(event)

  renderTag: (item, index) =>
    { key, value } = @getOption(item)
    currentValue = @getValue()

    if currentValue?
      if @props.multiple
        isActive = value in currentValue
      else
        isActive = value is currentValue

    className = classNames('c-tag_cloud-item ui-tag',
      'ui-tag-secondary': !isActive,
      'ui-tag-tertiary is-active': isActive,
    )

    text = <Emoji text={key} limit={TAG_LIMIT} />

    if @props.readOnly
      <li key={value} className={className}>{text}</li>
    else
      <li key={value} className={className} onClick={@handleClick.bind(@, item)}>{text}</li>

  render: ->
    className = classNames('c-tag_cloud', @props.className,
      'is-locked': @props.readOnly
      'is-radio': @props.radio
    )

    cleanProps = omit(@props,
      'label', 'error', 'items', 'validate', 'required', 'multiple',
      'readOnly', 'onClick', 'onUpdate', 'radio', 'children'
    )

    if @isErrorActive()
      error = <em className="ui-error">{@getError()}</em>

    if @props.label
      label =
        <strong className="ui-label c-tag_cloud-label">
          {@props.label}
        </strong>

    <article {...cleanProps} className={className} ref="container">
      {label}
      <ul className="c-tag_cloud-list">
        {@props.items.map(@renderTag)}
      </ul>
      {@props.children}
      {error}
    </article>

TagCloud::setValue = throttle(TagCloud::setValue, CHECKBOX_CHANGE_RATE)
module.exports = TagCloud
