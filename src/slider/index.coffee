React = require('react')
PropTypes = require('prop-types')
omit = require('lodash/omit')
classNames = require('classnames')

eventproxy = require('nebenan-helpers/lib/eventproxy').default
{ documentOffset, size, getPrefixed, eventCoordinates } = require('nebenan-helpers/lib/utils/dom')

InputComponent = require('nebenan-base-class/lib/input_component')

ensureValueBounds = (value, min, max) -> Math.max(Math.min(value, max), min)

convertValueToPercent = (value, min, max) ->
  if value
    (value - min) / (max - min)
  else
    0

convertPercentToValue = (percent, min, max, step) ->
  multiplier = (max - min) / step
  value = (Math.round(percent * multiplier) * step) + min
  ensureValueBounds(value, min, max)


class Slider extends InputComponent
  @propTypes:
    step: PropTypes.number
    min: PropTypes.number
    max: PropTypes.number

  @defaultProps:
    step: 1
    min: 0
    max: 10

  componentDidMount: ->
    super()
    @stopListeningToClicks = eventproxy('click', @handleGlobalClick)
    @stopListeningToResize = eventproxy('resize', @handleResize)
    @handleResize()

  componentWillUnmount: ->
    @deactivateSwipe()
    @stopListeningToClicks()
    @stopListeningToResize()
    super()

  getDefaultState: (props) ->
    state = super(props)
    state.value = ensureValueBounds(state.value or 0, props.min, props.max)
    state.percent = convertValueToPercent(state.value, props.min, props.max)
    state

  getTrackOffset: -> documentOffset(global, @refs.track).left

  handleGlobalClick: (event) =>
    return unless @isComponentMounted
    @validate() if not @isPristine() and not @refs.container.contains(event.target)

  handleResize: =>
    return unless @isComponentMounted
    trackWidth = size(@refs.track).width
    @setState({ trackWidth })

  activateSwipe: ->
    return if @isActive
    document.addEventListener('mousemove', @handleSwipe)
    document.addEventListener('touchmove', @handleSwipe)
    document.addEventListener('mouseup', @handleSwipeEnd)
    document.addEventListener('touchend', @handleSwipeEnd)
    @setError(null)
    @isActive = true

  deactivateSwipe: ->
    return unless @isActive
    document.removeEventListener('mousemove', @handleSwipe)
    document.removeEventListener('touchmove', @handleSwipe)
    document.removeEventListener('mouseup', @handleSwipeEnd)
    document.removeEventListener('touchend', @handleSwipeEnd)
    @isActive = false

  handleClick: (event) => @setPosition(event.pageX - @getTrackOffset(), @validate)

  handleSwipeStart: =>
    @activateSwipe()
    @trackOffset = @getTrackOffset()

  handleSwipe: (event) =>
    event.preventDefault()
    { pageX } = eventCoordinates(event, 'pageX')
    @setPosition(pageX - @trackOffset)

  handleSwipeEnd: =>
    @deactivateSwipe()
    @trackOffset = null

  setPosition: (position, done) ->
    percent = Math.max(Math.min(position / @state.trackWidth, 1), 0)
    value = convertPercentToValue(percent, @props.min, @props.max, @props.step)

    if value isnt @state.value
      @setValue(value, done)
    else
      done?()

  setValue: (value, done) ->
    @setState((state, props) => { percent: convertValueToPercent(value, props.min, props.max) })
    super(value, done)

  render: ->
    className = classNames('c-slider', @props.className, 'is-error': @isErrorActive())
    cleanProps = omit(@props, 'label', 'error', 'validate', 'required', 'children', 'min', 'max', 'step', 'getLabel', 'onUpdate')

    if @props.getLabel
      label = @props.getLabel(@state.value)
    else
      label = @state.value

    style = getPrefixed(transform: "translateX(#{@state.percent * @state.trackWidth}px)")

    if @isErrorActive()
      error = <em className="ui-error">{@getError()}</em>

    <article {...cleanProps} className={className} ref="container">
      <strong className="ui-label">{@props.label}</strong>
      <div className="c-slider-track" ref="track" onClick={@handleClick}>
        <span className="c-slider-line" />
        <span
          ref="handle" className="c-slider-handle" style={style}
          onTouchStart={@handleSwipeStart} onMouseDown={@handleSwipeStart}
        >
          <em className="c-slider-label">{label}</em>
        </span>
      </div>
      {error}
    </article>

module.exports = Slider
