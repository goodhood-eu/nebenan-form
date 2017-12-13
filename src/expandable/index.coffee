React = require('react')
PropTypes = require('prop-types')
classNames = require('classnames')
omit = require('lodash/omit')


class Expandable extends React.PureComponent
  @propTypes:
    control: PropTypes.node.isRequired

  constructor: (props) ->
    super(props)
    @state = isActive: props.defaultState or false

  hide: -> @setActive(false)
  show: -> @setActive(true)

  isActive: -> @state.isActive

  setActive: (isActive) ->
    @setState({ isActive }, @props.onUpdate)

  handleControlClick: =>
    updater = (state) => { isActive: !state.isActive }
    @setState(updater, @props.onUpdate)

  render: ->
    className = classNames('c-expandable', @props.className, 'is-active': @state.isActive)
    cleanProps = omit(@props, 'children', 'defaultState', 'control', 'onUpdate')

    if @state.isActive
      content = <div className="c-expandable-content">{@props.children}</div>

    <article {...cleanProps} className={className}>
      <aside className="c-expandable-control" onClick={@handleControlClick}>
        {@props.control}
      </aside>
      {content}
    </article>

module.exports = Expandable
