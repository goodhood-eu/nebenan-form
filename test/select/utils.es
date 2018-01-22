import { assert } from 'chai';

import {
  getOption,
  findIndex,
} from 'nebenan-form/lib/select/utils';


describe('ui/select/utils', () => {
  it('getOption', () => {
    const option = { key: 3, value: 3 };
    assert.deepEqual(getOption(3), option, 'returns correct option when item is num');
    assert.deepEqual(getOption(option), option, 'returns correct option when item is object');
  });

  it('findIndex', () => {
    const props = {
      options: [
        { key: 1, value: 1 },
        { key: 2, value: 2 },
        { key: 3, value: 3 },
      ],
    };

    const props2 = {
      options: [
        1,
        2,
        3,
      ],
    };

    assert.equal(findIndex(props, 3), 2, 'finds index in collection');
    assert.equal(findIndex(props, 99), -1, 'not found in collection correct index');

    assert.equal(findIndex(props2, 3), 2, 'finds index in array');
    assert.equal(findIndex(props2, 99), -1, 'not found in array correct index');
  });
});
