React = require('react')
omit = require('lodash/omit')
classNames = require('classnames')

keymanager = require('nebenan-helpers/lib/keymanager').default
{ DOWN, RIGHT, TAB, UP, LEFT, ENTER, SPACE } = require('nebenan-helpers/lib/constants/keys';)

defaultGetOption = (key, options) -> options[key]


class ContextList extends React.PureComponent
  @defaultProps: options: []

  constructor: (props) ->
    super(props)
    @state =
      keys: Object.keys(props.options)
      isActive: false
      selected: null

  componentWillUnmount: -> @deactivate()
  componentWillReceiveProps: (nextProps) ->
    if @props.options isnt nextProps.options
      nextState =
        keys: Object.keys(nextProps.options)
        selected: null

      @setState(nextState)

  isActive: -> @state.isActive

  activate: ->
    return if @state.isActive
    @stopListening = keymanager('down right tab up left enter space', @handleKey)
    @setState(isActive: true)

  deactivate: ->
    return unless @state.isActive
    @stopListening?()
    @setState(isActive: false, selected: null)

  selectNext: (done) ->
    updater = (state) =>
      index = Math.max(0, state.keys.indexOf(state.selected)) if state.selected
      newSelected = state.keys[index + 1] or state.keys[0]
      { selected: newSelected }

    @setState(updater, done)

  selectPrevious: (done) ->
    updater = (state) =>
      index = Math.max(0, state.keys.indexOf(state.selected)) if state.selected
      newSelected = state.keys[index - 1] or state.keys[state.keys.length - 1]
      { selected: newSelected }

    @setState(updater, done)

  handleKey: (event) =>
    event.preventDefault() if event.keyCode in [DOWN, RIGHT, TAB, UP, LEFT]

    switch event.keyCode
      when DOWN, RIGHT, TAB
        @selectNext()
      when UP, LEFT
        @selectPrevious()
      when ENTER, SPACE
        if @state.selected?
          event.preventDefault()
          @props.onSelect?(@state.selected, @props.options)

  handleClick: (key, event) ->
    # Prevents from double events - e.g.: both onClick on item and onSelect would be triggered
    event.preventDefault()
    event.stopPropagation()

    @setState(selected: key)
    @props.onSelect?(key, @props.options)

  handleMouseEnter: (key, event) -> @setState(selected: key)
  handleMouseLeave: (event) =>
    @setState(selected: null)
    @props.onMouseLeave?(event)

  renderOption: (key) =>
    className = classNames('c-context_list-item',
      'is-selected': @state.selected is key
    )
    getOption = @props.getOption or defaultGetOption

    <li
      key={key} className={className}
      onClick={@handleClick.bind(@, key)}
      onMouseEnter={@handleMouseEnter.bind(@, key)}
    >
      {getOption(key, @props.options)}
    </li>

  render: ->
    className = classNames('c-context_list', @props.className, 'is-active': @state.isActive)
    cleanProps = omit(@props, 'className', 'children', 'options', 'getOption', 'onSelect')

    <ul {...cleanProps} className={className} onMouseLeave={@handleMouseLeave}>
      {@state.keys.map(@renderOption)}
    </ul>

module.exports = ContextList
