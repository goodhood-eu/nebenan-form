startsWithSpaceRegex = /^\s/
endsWithSpaceRegex = /\s$/

insertString = (string, text, insertAt) ->
  start = string.slice(0, insertAt)
  end = string.slice(insertAt)
  position = insertAt + text.length

  if start.length and not endsWithSpaceRegex.test(start)
    text = " #{text}"
    position++

  if end.length and not startsWithSpaceRegex.test(end)
    text += ' '
    position++

  result = start + text + end

  { result, position }

replaceString = (string, pattern, replacement, insertAt) ->
  start = string.slice(0, insertAt)
  end = string.slice(insertAt)

  text = start.replace(pattern, '')
  text += replacement

  if end.length and not startsWithSpaceRegex.test(end)
    text += ' '

  position = text.length
  result = text + end

  { result, position }

module.exports = { insertString, replaceString }
