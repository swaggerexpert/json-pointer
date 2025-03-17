import { assert } from 'chai';

import {
  evaluate,
  JSONPointerIndexError,
  JSONPointerTypeError,
  JSONPointerKeyError,
  JSONPointerEvaluateError,
  URIFragmentIdentifier,
} from '../../../src/index.js';
import MapSetEvaluationRealm from '../../../src/evaluate/realms/map-set.js';

describe('evaluate', function () {
  const realm = new MapSetEvaluationRealm();
  const data = new Map([
    ['foo', new Set(['bar', 'baz'])],
    ['', 0],
    ['a/b', 1],
    ['c%d', 2],
    ['e^f', 3],
    ['g|h', 4],
    ['i\\j', 5],
    ['k"l', 6],
    [' ', 7],
    ['m~n', 8],
  ]);

  context('RFC 6901 JSON String tests', function () {
    const jsonStringRepEntries = [
      ['', data],
      ['/foo', new Set(['bar', 'baz'])],
      ['/foo/0', 'bar'],
      ['/', 0],
      ['/a~1b', 1],
      ['/c%d', 2],
      ['/e^f', 3],
      ['/g|h', 4],
      ['/i\\j', 5],
      ['/k"l', 6],
      ['/ ', 7],
      ['/m~0n', 8],
    ];

    jsonStringRepEntries.forEach(([jsonString, expected]) => {
      specify('should correctly evaluate JSON Pointer from JSON String', function () {
        assert.deepEqual(evaluate(data, jsonString, { realm }), expected);
      });
    });
  });

  context('RFC 6901 URI Fragment Identifier tests', function () {
    const fragmentRepEntries = [
      ['#', data],
      ['#/foo', new Set(['bar', 'baz'])],
      ['#/foo/0', 'bar'],
      ['#/', 0],
      ['#/a~1b', 1],
      ['#/c%25d', 2],
      ['#/e%5Ef', 3],
      ['#/g%7Ch', 4],
      ['#/i%5Cj', 5],
      ['#/k%22l', 6],
      ['#/%20', 7],
      ['#/m~0n', 8],
    ];

    fragmentRepEntries.forEach(([fragment, expected]) => {
      specify('should correctly evaluate JSON Pointer from URI Fragment Identifier', function () {
        assert.deepEqual(evaluate(data, URIFragmentIdentifier.from(fragment), { realm }), expected);
      });
    });
  });

  context('valid JSON Pointers', function () {
    specify('should return entire document for ""', function () {
      assert.deepEqual(evaluate(data, '', { realm }), data);
    });

    specify('should return Set(["bar", "baz"]) for "/foo"', function () {
      assert.deepEqual(evaluate(data, '/foo', { realm }), new Set(['bar', 'baz']));
    });

    specify('should return "bar" for "/foo/0"', function () {
      assert.strictEqual(evaluate(data, '/foo/0', { realm }), 'bar');
    });

    specify('should return 0 for "/"', function () {
      assert.strictEqual(evaluate(data, '/', { realm }), 0);
    });

    specify('should return 1 for "/a~1b"', function () {
      assert.strictEqual(evaluate(data, '/a~1b', { realm }), 1);
    });

    specify('should return 2 for "/c%d"', function () {
      assert.strictEqual(evaluate(data, '/c%d', { realm }), 2);
    });

    specify('should return 3 for "/e^f"', function () {
      assert.strictEqual(evaluate(data, '/e^f', { realm }), 3);
    });

    specify('should return 4 for "/g|h"', function () {
      assert.strictEqual(evaluate(data, '/g|h', { realm }), 4);
    });

    specify('should return 5 for "/i\\j"', function () {
      assert.strictEqual(evaluate(data, '/i\\j', { realm }), 5);
    });

    specify('should return 6 for "/k\"l"', function () {
      assert.strictEqual(evaluate(data, '/k"l', { realm }), 6);
    });

    specify('should return 7 for "/ "', function () {
      assert.strictEqual(evaluate(data, '/ ', { realm }), 7);
    });

    specify('should return 8 for "/m~0n"', function () {
      assert.strictEqual(evaluate(data, '/m~0n', { realm }), 8);
    });
  });

  context('invalid JSON Pointers (should throw errors)', function () {
    specify('should throw JSONPointerEvaluateError for invalid JSON Pointer', function () {
      assert.throws(() => evaluate(data, 'invalid-pointer', { realm }), JSONPointerEvaluateError);
    });

    specify(
      'should throw JSONPointerTypeError for accessing property on non-object/array',
      function () {
        assert.throws(() => evaluate(data, '/foo/0/bad', { realm }), JSONPointerTypeError);
      },
    );

    specify('should throw JSONPointerKeyError for non-existing key', function () {
      assert.throws(() => evaluate(data, '/nonexistent', { realm }), JSONPointerKeyError);
    });

    specify('should throw JSONPointerIndexError for non-numeric array index', function () {
      assert.throws(() => evaluate(data, '/foo/x', { realm }), JSONPointerIndexError);
    });

    specify('should throw JSONPointerIndexError for out-of-bounds array index', function () {
      assert.throws(() => evaluate(data, '/foo/5', { realm }), JSONPointerIndexError);
    });

    specify('should throw JSONPointerIndexError for leading zero in array index', function () {
      assert.throws(() => evaluate(data, '/foo/01', { realm }), JSONPointerIndexError);
    });

    specify('should throw JSONPointerIndexError for "-" when strictArrays is true', function () {
      assert.throws(
        () => evaluate(data, '/foo/-', { strictArrays: true, realm }),
        JSONPointerIndexError,
      );
    });

    specify('should return undefined for "-" when strictArrays is false', function () {
      assert.strictEqual(evaluate(data, '/foo/-', { strictArrays: false, realm }), undefined);
    });

    specify(
      'should throw JSONPointerKeyError for accessing chain of object properties that do not exist',
      function () {
        assert.throws(() => evaluate(data, '/missing/key', { realm }), JSONPointerKeyError);
      },
    );

    specify(
      'should return undefined accessing object property that does not exist when strictObject is false',
      function () {
        assert.isUndefined(evaluate(data, '/missing', { strictObjects: false, realm }));
      },
    );

    specify('should throw JSONPointerTypeError when evaluating on primitive', function () {
      assert.throws(() => evaluate('not-an-object', '/foo', { realm }), JSONPointerTypeError);
    });

    specify(
      'should throw JSONPointerTypeError when trying to access deep path on primitive',
      function () {
        assert.throws(() => evaluate({ foo: 42 }, '/foo/bar', { realm }), JSONPointerTypeError);
      },
    );
  });
});
