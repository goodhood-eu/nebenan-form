React = require('react')
classNames = require('classnames')
omit = require('lodash/omit')


PopupLink = (props) ->
  className = classNames('c-popup_link', props.className)
  cleanProps = omit(props, 'children', 'to', 'follow')

  rel = 'noopener noreferrer' # for safety, see: https://mathiasbynens.github.io/rel-noopener/
  rel += ' nofollow' if not props.follow

  <a {...cleanProps} className={className} href={props.to} target="_blank" rel={rel}>
    {props.children}
  </a>

module.exports = PopupLink
