React = require('react')
PropTypes = require('prop-types')
classNames = require('classnames')
omit = require('lodash/omit')

Link = require('../link')
Dropdown = require('../dropdown').default


class Breadcrumbs extends React.PureComponent
  @propTypes:
    items: PropTypes.array.isRequired

  renderItem: (item, index) ->
    key = "#{item.text}:#{item.href or 'leaf'}"

    if item.href
      content = <Link to={item.href}>{item.text}</Link>
    else
      content = item.text

    if index
      separator = <span className="c-breadcrumbs-item-separator">&bull;</span>

    <li key={key} className="c-breadcrumbs-item">{separator}{content}</li>

  render: ->
    className = classNames('c-breadcrumbs', @props.className)
    cleanProps = omit(@props, 'children', 'items')

    lastItemIndex = @props.items.length - 1
    lastItem = @props.items[lastItemIndex]

    if lastItemIndex
      dropdownLabel = <i className="icon-arrow_down ui-link" />
      dropdownOptions = @props.items.slice(0, lastItemIndex)
      dropdown = <Dropdown label={dropdownLabel} options={dropdownOptions} />

    <nav {...cleanProps} className={className}>
      <div className="c-breadcrumbs-content">
        {dropdown}
        <ul>{@props.items.map(@renderItem)}</ul>
      </div>
    </nav>

module.exports = Breadcrumbs
