React = require('react')
PropTypes = require('prop-types')
classNames = require('classnames')
omit = require('lodash/omit')

Expandable = require('../expandable')


class ExpandableCard extends React.PureComponent
  @propTypes:
    title: PropTypes.node.isRequired

  render: ->
    className = classNames('c-expandable_card', @props.className)
    cleanProps = omit(@props, 'children', 'iconClass', 'title')

    if @props.iconClass
      iconClassName = classNames('c-expandable_card-icon', @props.iconClass)
      icon = <i className={iconClassName} />

    state =
      <span className="c-expandable_card-state ui-link">
        <i className="icon-arrow_up" />
        <i className="icon-arrow_down" />
      </span>

    control =
      <span className="c-expandable_card-control ui-h2">
        {state}
        {icon} {@props.title}
      </span>

    <Expandable {...cleanProps} className={className} control={control}>
      {@props.children}
    </Expandable>

module.exports = ExpandableCard
