React = require('react')
classNames = require('classnames')

{ renderShortname } = require('nebenan-helpers/lib/emoji')

ContextList = require('../context_list')


class EmojiSuggestions extends React.PureComponent
  componentDidMount: -> @refs.list.activate()
  componentWillUnmount: -> @refs.list.deactivate()

  renderOption: (key, list) ->
    shortname = list[key]
    safeContent = __html: renderShortname(shortname, single: true)

    <small className="c-emoji_suggestions-option">
      <span dangerouslySetInnerHTML={safeContent} />
      {shortname}
    </small>

  render: ->
    className = classNames('c-emoji_suggestions', @props.className)
    <ContextList {...@props} ref="list" className={className} getOption={@renderOption} />

module.exports = EmojiSuggestions
