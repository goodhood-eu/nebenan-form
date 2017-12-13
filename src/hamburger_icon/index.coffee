React = require('react')
classNames = require('classnames')
omit = require('lodash/omit')


HamburgerIcon = (props) ->
  className = classNames('c-hamburger_icon', 'is-active': props.active)
  cleanProps = omit(props, 'children', 'active')

  <span {...cleanProps} className={className}>
    <i className="c-hamburger_icon-1" />
    <i className="c-hamburger_icon-2" />
    <i className="c-hamburger_icon-3" />
  </span>

module.exports = HamburgerIcon
