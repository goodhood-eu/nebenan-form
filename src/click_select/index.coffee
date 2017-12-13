React = require('react')
classNames = require('classnames')


class ClickSelect extends React.PureComponent
  handleClick: (event) =>
    # hack: contentEditable makes iOS selection work
    @refs.container.setAttribute('contentEditable', true)

    range = document.createRange()
    range.selectNodeContents(@refs.container)

    selection = global.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)

    @refs.container.setAttribute('contentEditable', false)

    @props.onClick?(event)

  render: ->
    className = classNames('c-click_select', @props.className)
    <span {...@props} className={className} ref="container" onClick={@handleClick} />

module.exports = ClickSelect
