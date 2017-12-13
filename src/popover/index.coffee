React = require('react')
classNames = require('classnames')

Dropdown = require('../dropdown').default


class Popover extends React.PureComponent
  show: => @refs.dropdown.show()
  hide: => @refs.dropdown.hide()

  render: ->
    klass = classNames('c-popover', @props.className)
    <Dropdown {...@props} ref="dropdown" className={klass} positionTop />

module.exports = Popover
