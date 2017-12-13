React = require('react')

omit = require('lodash/omit')
classNames = require('classnames')


getPercentage = (input) ->
  if typeof input is 'number' and input < 1
    percent = String(input * 100)
  else
    percent = String(input)

  percent = "#{percent}%" if percent.indexOf('%') is -1
  percent

Progress = (props) ->
  percent = getPercentage(props.state)
  type = props.type or 'primary'

  cleanProps = omit(props, 'className', 'state', 'size', 'type', 'children')
  klass = classNames("c-progress c-progress-#{type}", props.className,
    'c-progress-small': props.size is 'small'
  )

  <div {...cleanProps} className={klass}>
    <span className="c-progress-state" style={{ width: percent }}><em>{percent}</em></span>
    {props.children}
  </div>

module.exports = Progress
