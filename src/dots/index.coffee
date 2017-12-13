React = require('react')
classNames = require('classnames')
omit = require('lodash/omit')


module.exports = class Dots extends React.PureComponent
  handleItemClick: (index, event) -> @props.onItemClick?(index, event)

  itemMapper: (item, index) =>
    <li key={index} onClick={@handleItemClick.bind(@, index)} className={classNames('is-active': index is @props.active)} />

  render: ->
    cleanProps = omit(@props, 'active', 'count', 'onItemClick')
    klassName = classNames('c-dots', @props.className)

    items = [1..@props.count].map(@itemMapper)
    <ul {...cleanProps} className={klassName}>{items}</ul>
