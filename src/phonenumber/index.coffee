React = require('react')
classNames = require('classnames')
omit = require('lodash/omit')


Phonenumber = (props) ->
  className = classNames('vcard', props.className)
  cleanProps = omit(props, 'children', 'number')

  <span {...cleanProps} className={className}><span className="tel">{props.number}</span></span>

module.exports = Phonenumber
