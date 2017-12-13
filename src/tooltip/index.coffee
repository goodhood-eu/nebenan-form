React = require('react')

omit = require('lodash/omit')
classNames = require('classnames')

TYPES = ['left', 'right', 'top', 'bottom']


module.exports = (props) ->
  type = if props.type in TYPES then props.type else 'top'

  cleanProps = omit(props, 'className', 'type', 'text', 'children')
  className = classNames("c-tooltip c-tooltip-#{type}", props.className)

  <span {...cleanProps} className={className}>
    <em>{props.text}</em>
    {props.children}
  </span>
