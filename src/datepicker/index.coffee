React = require('react')
PropTypes = require('prop-types')
omit = require('lodash/omit')
classNames = require('classnames')

keymanager = require('nebenan-helpers/lib/keymanager').default
eventproxy = require('nebenan-helpers/lib/eventproxy').default

InputProxyComponent = require('nebenan-base-class/lib/input_proxy_component')
Input = require('../input')


class Datepicker extends InputProxyComponent
  @contextTypes: localeData: PropTypes.object

  componentWillUnmount: ->
    @deactivate()
    super()

  handleGlobalClick: (event) =>
    return unless @isComponentMounted
    isOutside = not @refs.container.contains(event.target)
    @hide() if isOutside
    @refs.input.validate() if not @refs.input.isPristine() and isOutside

  activate: ->
    return if @isActive

    Pikaday = require('pikaday')
    options =
      firstDay: 1
      field: @refs.input.getInput()
      format: @props.format or 'L'
      i18n: @context.localeData.modules.calendar
      yearRange: [] # number/array range of years to show: e.g. 10 or [1900, 2015]
      bound: false
      onSelect: @handleSelect

    options.minDate = new Date(@props.minDate) if @props.minDate
    options.maxDate = new Date(@props.maxDate) if @props.maxDate
    options.yearRange = @props.yearRange if @props.yearRange

    @picker = new Pikaday(options)
    @picker.hide() # picker thinks it's visible by default. it ain't.
    @stopListeningToKeys = keymanager('esc', @hide)
    @stopListeningToClicks = eventproxy('click', @handleGlobalClick)

    # Fixes glitch when defaultValue is out of min/max bounds
    @setDefaultValue() if @props.defaultValue

    @isActive = true

  deactivate: ->
    return unless @isActive

    @stopListeningToKeys()
    @stopListeningToClicks()
    @picker.destroy()

    @isActive = false

  show: ->
    return if @picker.isVisible()
    @picker.show()

  hide: =>
    return unless @picker.isVisible()
    @picker.hide()

  setDefaultValue: ->
    value = @picker.toString()
    @refs.input.setValue(value) if @props.defaultValue isnt value

  handleSelect: =>
    value = @picker.toString()
    @refs.input.setValue(value, @refs.input.validate)
    @hide()

  handleClick: (event) =>
    return if event.target.tagName.toLowerCase() is 'select' # Clicking on picker UI
    @activate()
    if @picker.isVisible() then @hide() else @show()

  render: ->
    className = classNames('c-datepicker', @props.className)
    cleanProps = omit(@props, 'format', 'minDate', 'maxDate', 'yearRange')

    <article ref="container" className={className} onClick={@handleClick}>
      <Input {...cleanProps} ref="input" readOnly />
    </article>

module.exports = Datepicker
