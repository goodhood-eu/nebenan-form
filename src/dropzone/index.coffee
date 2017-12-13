React = require('react')
omit = require('lodash/omit')
classNames = require('classnames')

BaseComponent = require('nebenan-base-class/lib/base_component')


class Dropzone extends BaseComponent
  constructor: (props) ->
    super(props)
    @state = @getDefaultState()

  componentDidMount: -> @activate()
  componentWillUnmount: -> @deactivate()

  getDefaultState: ->
    isActive: false
    isHover: false

  handleDragStart: (event) =>
    @startedCounter++
    if @startedCounter is 1
      @setState(isActive: true)
      @props.onDragStart?(event)

  handleDragEnd: (event) =>
    @startedCounter--
    if @startedCounter is 0
      @setState(isActive: false)
      @props.onDragEnd?(event)

  handleGlobalDrop: => @reset()

  handleDragEnter: (event) =>
    @enteredCounter++
    if @enteredCounter is 1
      @setState(isHover: true)
      @props.onDragEnter?(event)

  handleDragLeave: (event) =>
    @enteredCounter--
    if @enteredCounter is 0
      @setState(isHover: false)
      @props.onDragLeave?(event)

  handleDragOver: (event) =>
    event.preventDefault()
    event.stopPropagation()
    @props.onDragOver?(event)

  handleDrop: (event) =>
    event.preventDefault()
    { files } = event.dataTransfer
    @props.onSelect?(files) if files.length # dragging nodes around
    @props.onDrop?(event)

  reset: (done) ->
    # counters are needed to handle insane enter/leave calls
    @startedCounter = 0
    @enteredCounter = 0
    @setState(@getDefaultState(), done)

  activate: ->
    @reset()

    document.addEventListener('dragenter', @handleDragStart)
    document.addEventListener('dragleave', @handleDragEnd)
    document.addEventListener('drop', @handleGlobalDrop)

  deactivate: ->
    document.removeEventListener('dragenter', @handleDragStart)
    document.removeEventListener('dragleave', @handleDragEnd)
    document.removeEventListener('drop', @handleGlobalDrop)

  render: ->
    className = classNames('c-dropzone', @props.className,
      'is-active': @state.isActive
      'is-hover': @state.isHover
    )
    cleanProps = omit(@props, 'children', 'onSelect', 'onDragStart', 'onDragEnd')

    <span
      {...cleanProps} className={className}
      onDragOver={@handleDragOver} onDragEnter={@handleDragEnter}
      onDragLeave={@handleDragLeave} onDrop={@handleDrop}
    >
      {@props.children}
      <span className="c-dropzone-overlay">
        <span className="c-dropzone-overlay-text-active">{@t('dropzone.label_drag')}</span>
        <span className="c-dropzone-overlay-text-hover">{@t('dropzone.label_release')}</span>
      </span>
    </span>

module.exports = Dropzone
