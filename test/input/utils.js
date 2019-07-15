const { assert } = require('chai');
const inputUtils = require('../../lib/input/utils');


const PILE_OF_POO = '💩';

const replacable = '[woop]';
const injectable = 'Donald McDonald';

const rawStringInject = `Dr. Prof. ${PILE_OF_POO} ${PILE_OF_POO} Mann says:is a human shaped lizard!`;
const rawStringReplace = `Dr. Prof. ${PILE_OF_POO} ${PILE_OF_POO} Mann says: ${replacable}is a human shaped lizard!`;
const injectPosition = `Dr. Prof. ${PILE_OF_POO} ${PILE_OF_POO} Mann says:`.length;
const replacePosition = `Dr. Prof. ${PILE_OF_POO} ${PILE_OF_POO} Mann says: ${replacable}`.length;

const compiledString = `Dr. Prof. ${PILE_OF_POO} ${PILE_OF_POO} Mann says: Donald McDonald is a human shaped lizard!`;
const compiledPosition = `Dr. Prof. ${PILE_OF_POO} ${PILE_OF_POO} Mann says: Donald McDonald `.length;

const smallString = 'blah blah';


describe('ui/input/utils', () => {
  it('insertString - api', () => {
    const response = inputUtils.insertString(rawStringInject, injectable, injectPosition);
    assert.isObject(response, 'returns an object');
    assert.isDefined(response.result, 'result has been defined');
    assert.isDefined(response.position, 'position has been defined');
  });

  it('insertString - long sentence', () => {
    const { result, position } = inputUtils.insertString(rawStringInject, injectable, injectPosition);
    assert.equal(result, compiledString, 'inserted content correctly');
    assert.equal(position, compiledPosition, 'calculated cursor position correctly');
  });

  it('insertString - empty string', () => {
    const { result, position } = inputUtils.insertString('', injectable, 0);
    assert.equal(result, injectable, 'inserted content correctly');
    assert.equal(position, injectable.length, 'calculated cursor position correctly');
  });

  it('insertString - beginning of string', () => {
    const expected = `${injectable} ${smallString}`;

    const { result, position } = inputUtils.insertString(smallString, injectable, 0);
    assert.equal(result, expected, 'inserted content correctly');
    assert.equal(position, injectable.length + 1, 'calculated cursor position correctly');
  });

  it('insertString - end of string', () => {
    const expected = `${smallString} ${injectable}`;

    const { result, position } = inputUtils.insertString(smallString, injectable, smallString.length);
    assert.equal(result, expected, 'inserted content correctly');
    assert.equal(position, expected.length, 'calculated cursor position correctly');
  });

  it('replaceString - api', () => {
    const response = inputUtils.replaceString(rawStringReplace, replacable, injectable, replacePosition);
    assert.isObject(response, 'returns an object');
    assert.isDefined(response.result, 'result has been defined');
    assert.isDefined(response.position, 'position has been defined');
  });

  it('replaceString - long sentence', () => {
    const { result, position } = inputUtils.replaceString(rawStringReplace, replacable, injectable, replacePosition);
    assert.equal(result, compiledString, 'replaced content correctly');
    assert.equal(position, compiledPosition, 'calculated cursor position correctly');
  });

  it('replaceString - empty string', () => {
    const { result, position } = inputUtils.replaceString(replacable, replacable, injectable, replacable.length);
    assert.equal(result, injectable, 'replaced content correctly');
    assert.equal(position, injectable.length, 'calculated cursor position correctly');
  });

  it('replaceString - beginning of string', () => {
    const original = `${replacable}${smallString}`;
    const expected = `${injectable} ${smallString}`;

    const { result, position } = inputUtils.replaceString(original, replacable, injectable, replacable.length);
    assert.equal(result, expected, 'inserted content correctly');
    assert.equal(position, injectable.length + 1, 'calculated cursor position correctly');
  });

  it('replaceString - end of string', () => {
    const original = `${smallString} ${replacable}`;
    const expected = `${smallString} ${injectable}`;

    const { result, position } = inputUtils.replaceString(original, replacable, injectable, original.length);
    assert.equal(result, expected, 'inserted content correctly');
    assert.equal(position, expected.length, 'calculated cursor position correctly');
  });

  it('getUniqueID', () => {
    const segmentRegex = /^[a-f0-9]+$/;

    const id1 = inputUtils.getUniqueID();
    const id2 = inputUtils.getUniqueID();

    assert.isString(id1, 'returns a string');
    assert.lengthOf(id1, 4, 'returns proper length');
    assert.notEqual(id1, id2, 'ids don\'t match');
    assert.match(id1, segmentRegex, 'correct pattern format');
  });
});
