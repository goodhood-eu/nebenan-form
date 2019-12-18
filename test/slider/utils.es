import { assert } from 'chai';

import {
  ensureValueBounds,
  convertValueToPercent,
  convertPercentToValue,
} from '../../src/slider/utils';


describe('ui/slider/utils', () => {
  it('ensureValueBounds', () => {
    assert.equal(
      ensureValueBounds(0, 0, 0),
      0,
      'returns 0 if all values are 0',
    );
    assert.equal(
      ensureValueBounds(null, 3, 5),
      3,
      'returns lower bound if the value is null',
    );
    assert.equal(
      ensureValueBounds(7, 3, 5),
      5,
      'returns upper bound if the value is not in the range and biger than upper bound',
    );
    assert.equal(
      ensureValueBounds(-7, -5, -3),
      -5,
      'returns lower bound if the value is not in the range and smaller than lower bound',
    );
  });
  it('convertValueToPercent', () => {
    assert.equal(convertValueToPercent(), 0, 'returns 0 if nothing passed');
    assert.equal(convertValueToPercent(4, 2, 3), 2, 'returns correct value');
    assert.equal(convertValueToPercent(4, 3, 3), Infinity, 'returns Infinity if divider is 0');
  });
  it('convertPercentToValue', () => {
    assert.equal(
      convertPercentToValue(1, 2, 3, 4),
      2,
      'calculate the value and returns lower bound if the value is not in the range and smaller than lower bound',
    );
    assert.equal(
      convertPercentToValue(3, 7, 4, 5),
      7,
      'calculate the value and returns upper bound if the value is not in the range and bigger than upper bound',
    );
  });
});
