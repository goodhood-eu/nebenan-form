React = require('react')
PropTypes = require('prop-types')
InteractiveComponent = require('nebenan-base-class/lib/interactive_component')
omit = require('lodash/omit')
throttle = require('lodash/throttle')
classNames = require('classnames')

eventproxy = require('nebenan-helpers/lib/eventproxy').default
{ scroll, documentOffset, size, offset } = require('nebenan-helpers/lib/utils/dom')
{ LoadingSpinner } = require('../loading')

SCROLL_RATE = 100
OFFSET = 150


class Infinite extends InteractiveComponent
  @propTypes: loading: PropTypes.bool

  startScroller: =>
    @activate()
    @checkViewportPosition()

  componentDidMount: ->
    super()
    process.nextTick(@startScroller) # pause to render to get refs

  componentWillUnmount: ->
    @deactivate()
    super()

  componentDidUpdate: (prevProps, prevState) ->
    if @props.loading
      @deactivate()
    else
      process.nextTick(@startScroller)  # pause to render to get refs

  activate: ->
    return unless @isComponentMounted
    return if @isActive

    @scrolledNode = @props.getScrolledNode?() or global
    @handleScroll = throttle(@checkViewportPosition, SCROLL_RATE)

    @scroll = scroll(@scrolledNode)

    @scrolledNode.addEventListener('scroll', @handleScroll)
    @stopListeningToResize = eventproxy('resize', @checkViewportPosition)
    @isActive = true

  deactivate: ->
    return unless @isComponentMounted
    return unless @isActive
    @scrolledNode.removeEventListener('scroll', @handleScroll)
    @stopListeningToResize()
    @isActive = false

  checkViewportPosition: =>
    return unless @isComponentMounted
    return if @props.loading
    triggerOffset = @props.triggerOffset or OFFSET

    globalOffset = @scroll.get() + size(document.body).height

    if @props.getScrolledNode
      nodeOffsetTop = offset(@refs.container).top
    else
      nodeOffsetTop = documentOffset(global, @refs.container).top

    nodeOffset = nodeOffsetTop + size(@refs.container).height

    if nodeOffset - globalOffset < triggerOffset
      @deactivate()
      @props.onActive?()

  render: ->
    cleanProps = omit(@props, 'triggerOffset', 'loading', 'onActive', 'getScrolledNode')
    className = classNames('c-infinite', @props.className)
    loadingKlass = classNames('c-infinite-loading', 'is-active': @props.loading)

    <aside {...cleanProps} className={className} ref="container">
      <div className={loadingKlass}>{@props.children or <LoadingSpinner />}</div>
    </aside>

module.exports = Infinite
