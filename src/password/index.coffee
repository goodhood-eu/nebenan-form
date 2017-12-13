React = require('react')
omit = require('lodash/omit')
classNames = require('classnames')

InputProxyComponent = require('nebenan-base-class/lib/input_proxy_component')
Input = require('../input')


class Password extends InputProxyComponent
  constructor: (props) ->
    super(props)
    @state = isVisible: false

  focus: => @getInput().focus()
  blur: => @getInput().blur()

  handleClick: (event) =>
    event.preventDefault()
    @setState((state) => { isVisible: !state.isVisible })

  render: ->
    className = classNames('c-password', @props.className)
    cleanProps = omit(@props, 'children')

    type = if @state.isVisible then 'text' else 'password'
    iconClassName = classNames('c-password-icon',
      'icon-eye': not @state.isVisible
      'icon-eye_crossed': @state.isVisible
    )

    <Input {...cleanProps} ref="input" className={className} type={type}>
      <i className={iconClassName} onClick={@handleClick} />
      {@props.children}
    </Input>

module.exports = Password
