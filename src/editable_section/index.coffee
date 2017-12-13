React = require('react')
classNames = require('classnames')
omit = require('lodash/omit')

BaseComponent = require('nebenan-base-class/lib/base_component')


class EditableSection extends BaseComponent
  constructor: (props) ->
    super(props)
    @state =
      isOpened: false

  open: => @setState(isOpened: true)
  close: => @setState(isOpened: false)

  getContent: ->
    if @state.isOpened
      @props.form
    else
      @props.children

  renderControl: ->
    if @state.isOpened
      <span className="ui-link" onClick={@close}>
        <span>{@t('generic.cancel')}</span> <i className="icon-cross" />
      </span>
    else if @props.children
      <span className="ui-link" onClick={@open}>
        <span>{@t('generic.edit')}</span> <i className="icon-pen" />
      </span>
    else
      <span className="ui-link" onClick={@open}>
        <i className="icon-circle_plus" />
      </span>

  render: ->
    cleanProps = omit(@props, 'children', 'form', 'title')
    content = @getContent()
    control = @renderControl() if @props.form

    className = classNames('c-editable_section', @props.className,
      'is-empty': not content
    )

    <article {...cleanProps} className={className}>
      <header className="c-editable_section-header">
        {control}
        <h2>{@props.title}</h2>
      </header>
      {content}
    </article>

module.exports = EditableSection
