React = require('react')
classNames = require('classnames')


renderChild = (child) -> <div className="c-form_group-item">{child}</div>

FormGroup = (props) ->
  size = props.children?.length or 0
  className = classNames('c-form_group', props.className,
    "is-multiple is-size-#{size}": size > 1
  )
  children = React.Children.map(props.children, renderChild)

  <div className={className}>{children}</div>

module.exports = FormGroup
