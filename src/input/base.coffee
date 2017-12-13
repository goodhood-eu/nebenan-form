{ ENTER } = require('nebenan-helpers/lib/constants/keys';)
{ insertString, replaceString } = require('./utils')

InputComponent = require('nebenan-base-class/lib/input_component')


class TextInputComponent extends InputComponent
  componentDidMount: ->
    super()
    @readDomValue()

  getDefaultState: (props) ->
    state = super(props)
    state.value ?= ''
    state

  getValue: -> @state.value.trim() or null

  setValue: (value, args...) ->
    value ?= '' # prevents from setting null
    super(value, args...)

  getCaretPosition: -> @getInput().selectionEnd or @state.value.length

  # Fixes the autofill feature in some of the dumbass browsers that are incapable of
  # triggering "change" event when they change values.
  readDomValue: ->
    { value } = @getInput()
    @setValue(value, @validate) if value isnt @state.value

  focus: => @getInput().focus()
  blur: => @getInput().blur()

  setSelection: (start, end) ->
    end ?= start
    @getInput().setSelectionRange(start, end)

  handleKeyDown: (event) =>
    if event.keyCode is ENTER and not event.ctrlKey
      if event.shiftKey
        @props.onShiftEnterKey?(event)
      else
        @props.onEnterKey?(event)

    @props.onKeyDown?(event)

  insertValue: (text, done) =>
    caret = @getCaretPosition()
    value = @state.value # raw value to deal with emojis

    { result, position } = insertString(value, text, caret)

    complete = =>
      @focus()
      @setSelection(position)
      done?()

    @setValue(result, complete)
    result

  replaceValue: (pattern, replacement, done) ->
    caret = @getCaretPosition()
    value = @state.value # raw value to deal with emojis

    { result, position } = replaceString(value, pattern, replacement, caret)

    complete = =>
      @focus()
      @setSelection(position)
      done?()

    @setValue(result, complete)
    result

module.exports = TextInputComponent
