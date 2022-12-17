const { assert } = require('chai');
const sinon = require('sinon');

const {
  bindTo,
  has,
  invoke,
  objectPropsMatch,
} = require('../../lib/utils');


describe('utils', () => {
  it('bindTo', () => {
    const obj = {
      handler() { return this; },
      anotherHandler() { return this; },
    };

    bindTo(obj, 'handler', 'anotherHandler', 'unexistend');

    const result1 = obj.handler();
    const result2 = obj.anotherHandler();

    assert.deepEqual(result1, obj, 'bound 1st func');
    assert.deepEqual(result2, obj, 'bound 2nd func');
  });

  it('has', () => {
    const Klass = function() { this.a = true; };
    Klass.prototype.c = true;
    const test = new Klass();

    assert.isFalse(has({}, 'a'), 'empty object');
    assert.isTrue(has({ b: undefined }, 'b'), 'own undefined prop');
    assert.isTrue(has(test, 'a'), 'own prop');
    assert.isFalse(has(test, 'c'), 'prototype');
  });

  it('invoke', () => {
    const func = (first, second) => second;
    const spy = sinon.spy();
    invoke(spy);
    assert.isUndefined(invoke(), 'empty call does nothing');
    assert.isTrue(spy.calledOnce, 'called');
    assert.equal(invoke(func, 'a', 'b'), 'b', 'passes down args properly');
  });

  it('objectPropsMatch', () => {
    assert.isTrue(objectPropsMatch(), 'empty call');
    assert.isTrue(objectPropsMatch({}, {}), 'empty objects no props');
    assert.isTrue(objectPropsMatch({}, {}, ['test']), 'empty objects w props');
    assert.isTrue(objectPropsMatch({ test: 1 }, { test: 1 }, ['test']), 'objects w same props');
    assert.isFalse(objectPropsMatch({ test: 1 }, { test: 2 }, ['test']), 'objects w diff props');
    assert.isFalse(objectPropsMatch({ test: 1 }, {}, ['test']), 'one prop missing');
  });
});
