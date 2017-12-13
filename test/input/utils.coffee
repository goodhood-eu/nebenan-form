{ assert } = require('chai')
inputUtils = require('../../src/input/utils')

PILE_OF_POO = '💩'

replacable = '[woop]'
injectable = 'Donald McDonald'

rawStringInject = "Dr. Prof. #{PILE_OF_POO} #{PILE_OF_POO} Mann says:is a human shaped lizard!"
rawStringReplace = "Dr. Prof. #{PILE_OF_POO} #{PILE_OF_POO} Mann says: #{replacable}is a human shaped lizard!"
injectPosition = "Dr. Prof. #{PILE_OF_POO} #{PILE_OF_POO} Mann says:".length
replacePosition = "Dr. Prof. #{PILE_OF_POO} #{PILE_OF_POO} Mann says: #{replacable}".length

compiledString = "Dr. Prof. #{PILE_OF_POO} #{PILE_OF_POO} Mann says: Donald McDonald is a human shaped lizard!"
compiledPosition = "Dr. Prof. #{PILE_OF_POO} #{PILE_OF_POO} Mann says: Donald McDonald ".length

smallString = 'blah blah'


describe 'ui/input/utils', ->
  it 'insertString - api', ->
    response = inputUtils.insertString(rawStringInject, injectable, injectPosition)
    assert.isObject(response, 'returns an object')
    assert.isDefined(response.result, 'result has been defined')
    assert.isDefined(response.position, 'position has been defined')

  it 'insertString - long sentence', ->
    { result, position } = inputUtils.insertString(rawStringInject, injectable, injectPosition)
    assert.equal(result, compiledString, 'inserted content correctly')
    assert.equal(position, compiledPosition, 'calculated cursor position correctly')

  it 'insertString - empty string', ->
    { result, position } = inputUtils.insertString('', injectable, 0)
    assert.equal(result, injectable, 'inserted content correctly')
    assert.equal(position, injectable.length, 'calculated cursor position correctly')

  it 'insertString - beginning of string', ->
    expected = "#{injectable} #{smallString}"

    { result, position } = inputUtils.insertString(smallString, injectable, 0)
    assert.equal(result, expected, 'inserted content correctly')
    assert.equal(position, injectable.length + 1, 'calculated cursor position correctly')

  it 'insertString - end of string', ->
    expected = "#{smallString} #{injectable}"

    { result, position } = inputUtils.insertString(smallString, injectable, smallString.length)
    assert.equal(result, expected, 'inserted content correctly')
    assert.equal(position, expected.length, 'calculated cursor position correctly')

  it 'replaceString - api', ->
    response = inputUtils.replaceString(rawStringReplace, replacable, injectable, replacePosition)
    assert.isObject(response, 'returns an object')
    assert.isDefined(response.result, 'result has been defined')
    assert.isDefined(response.position, 'position has been defined')

  it 'replaceString - long sentence', ->
    { result, position } = inputUtils.replaceString(rawStringReplace, replacable, injectable, replacePosition)
    assert.equal(result, compiledString, 'replaced content correctly')
    assert.equal(position, compiledPosition, 'calculated cursor position correctly')

  it 'replaceString - empty string', ->
    { result, position } = inputUtils.replaceString(replacable, replacable, injectable, replacable.length)
    assert.equal(result, injectable, 'replaced content correctly')
    assert.equal(position, injectable.length, 'calculated cursor position correctly')

  it 'replaceString - beginning of string', ->
    original = "#{replacable}#{smallString}"
    expected = "#{injectable} #{smallString}"

    { result, position } = inputUtils.replaceString(original, replacable, injectable, replacable.length)
    assert.equal(result, expected, 'inserted content correctly')
    assert.equal(position, injectable.length + 1, 'calculated cursor position correctly')

  it 'replaceString - end of string', ->
    original = "#{smallString} #{replacable}"
    expected = "#{smallString} #{injectable}"

    { result, position } = inputUtils.replaceString(original, replacable, injectable, original.length)
    assert.equal(result, expected, 'inserted content correctly')
    assert.equal(position, expected.length, 'calculated cursor position correctly')
