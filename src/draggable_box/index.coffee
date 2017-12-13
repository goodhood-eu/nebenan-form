React = require('react')
classNames = require('classnames')
omit = require('lodash/omit')

{ getPrefixed, eventCoordinates } = require('nebenan-helpers/lib/utils/dom')
TRIGGER_DISTANCE = 20
TRIGGER_TIMEOUT = 500


class DraggableBox extends React.PureComponent
  constructor: (props) ->
    super(props)
    @state = @getDefaultState()

  componentWillUnmount: ->
    @deactivateDrag()
    @deactivateSwipe()

  getDefaultState: ->
    active: false
    x: null
    y: null

  activateDrag: ->
    return if @isActive
    document.addEventListener('mousemove', @handleDragMove)
    document.addEventListener('mouseup', @handleDragEnd)
    @isActive = true

  deactivateDrag: ->
    return unless @isActive
    document.removeEventListener('mousemove', @handleDragMove)
    document.removeEventListener('mouseup', @handleDragEnd)
    @isActive = false

  activateSwipe: ->
    return if @isActive
    document.addEventListener('touchmove', @handleSwipeMove)
    document.addEventListener('touchend', @handleSwipeEnd)
    @isActive = true

  deactivateSwipe: ->
    return unless @isActive
    document.removeEventListener('touchmove', @handleSwipeMove)
    document.removeEventListener('touchend', @handleSwipeEnd)
    @isActive = false

  handleMoveStart: (event) ->
    { pageX, pageY } = eventCoordinates(event, 'pageX', 'pageY')
    @startX = pageX
    @startY = pageY

  handleMoveEnd: ->
    wasActive = @state.active

    complete = =>
      @props.onMoveEnd?() if wasActive

    @setState(@getDefaultState(), complete)

  handleDragStart: (event) =>
    @activateDrag()
    @handleMoveStart(event)
    @props.onMouseDown?(event)

  handleDragMove: (event) =>
    { pageX, pageY } = event
    x = pageX - @startX
    y = pageY - @startY

    updater = (state) =>
      if state.active
        @props.onMove?(pageX, pageY, x, y)
        return { x, y }

      else if Math.abs(x) > TRIGGER_DISTANCE or Math.abs(y) > TRIGGER_DISTANCE
        @props.onMoveStart?(@startX, @startY)
        return { active: true }

    @setState(updater)

  handleDragEnd: (event) =>
    @deactivateDrag()
    @handleMoveEnd()
    @startX = @startY = null

  handleDelayedStart: =>
    @setState(active: true)
    @props.onMoveStart?(@startX, @startY)

  handleSwipeStart: (event) =>
    @activateSwipe()
    @startTime = Date.now()
    @startTid = setTimeout(@handleDelayedStart, TRIGGER_TIMEOUT)
    @handleMoveStart(event)

    @props.onTouchStart?(event)

  handleSwipeMove: (event) =>
    if Date.now() - @startTime < TRIGGER_TIMEOUT
      clearTimeout(@startTid)
      @deactivateSwipe()
      return

    event.preventDefault()

    { pageX, pageY } = eventCoordinates(event, 'pageX', 'pageY')
    x = pageX - @startX
    y = pageY - @startY

    @setState({ x, y })
    @props.onMove?(pageX, pageY, x, y)

  handleSwipeEnd: (event) =>
    @deactivateSwipe()
    @handleMoveEnd()
    @startX = @startY = @startTime = @startTid = null

  render: ->
    className = classNames('c-draggable_box', @props.className, 'is-active': @state.active)
    cleanProps = omit(@props, 'children', 'onMoveStart', 'onMove', 'onMoveEnd')

    if @state.active
      style = getPrefixed(transform: "translate3d(#{@state.x}px, #{@state.y}px, 0) scale(1.2)")

    <div
      {...cleanProps} className={className} style={style}
      onMouseDown={@handleDragStart}
      onTouchStart={@handleSwipeStart}
    >
      {@props.children}
    </div>

module.exports = DraggableBox
