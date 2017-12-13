React = require('react')
classNames = require('classnames')


Hexagon = (props) ->
  className = classNames('c-hexagon', props.className)

  <i className={className}>
    <span className="c-hexagon-shape" />
    <span className="c-hexagon-content">{props.children}</span>
  </i>

module.exports = Hexagon
