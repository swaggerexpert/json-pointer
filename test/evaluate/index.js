import { assert } from 'chai';

import {
  evaluate,
  JSONPointerIndexError,
  JSONPointerTypeError,
  JSONPointerKeyError,
  JSONPointerEvaluateError,
  URIFragmentIdentifier,
} from '../../src/index.js';
import JSONEvaluationRealm from '../../src/evaluate/realms/json/index.js';

describe('evaluate', function () {
  const data = {
    foo: ['bar', 'baz'],
    '': 0,
    'a/b': 1,
    'c%d': 2,
    'e^f': 3,
    'g|h': 4,
    'i\\j': 5,
    'k"l': 6,
    ' ': 7,
    'm~n': 8,
  };

  context('RFC 6901 JSON String tests', function () {
    const jsonStringRepEntries = [
      ['', data],
      ['/foo', ['bar', 'baz']],
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
        assert.deepEqual(evaluate(data, jsonString), expected);
      });
    });
  });

  context('RFC 6901 URI Fragment Identifier tests', function () {
    const fragmentRepEntries = [
      ['#', data],
      ['#/foo', ['bar', 'baz']],
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
        assert.deepEqual(evaluate(data, URIFragmentIdentifier.from(fragment)), expected);
      });
    });
  });

  context('given custom realm option', function () {
    specify('should use custom realm', function () {
      const result = evaluate(data, '/a~1b', { realm: new JSONEvaluationRealm() });

      assert.deepEqual(result, 1);
    });

    specify('should throw on invalid custom realm', function () {
      const realm = {};

      assert.throws(() => evaluate(data, '/a~1b', { realm }), JSONPointerEvaluateError);
    });
  });

  context('invalid JSON Pointers (should throw errors)', function () {
    specify('should throw JSONPointerEvaluateError for invalid JSON Pointer', function () {
      assert.throws(() => evaluate(data, 'invalid-pointer'), JSONPointerEvaluateError);
    });

    specify(
      'should throw JSONPointerTypeError for accessing property on non-object/array',
      function () {
        assert.throws(() => evaluate(data, '/foo/0/bad'), JSONPointerTypeError);
      },
    );

    specify('should throw JSONPointerKeyError for non-existing key', function () {
      assert.throws(() => evaluate(data, '/nonexistent'), JSONPointerKeyError);
    });

    specify('should throw JSONPointerIndexError for non-numeric array index', function () {
      assert.throws(() => evaluate(data, '/foo/x'), JSONPointerIndexError);
    });

    specify('should throw JSONPointerIndexError for unsafe integer array index', function () {
      assert.throws(
        () => evaluate(data, '/foo/9007199254740992'),
        JSONPointerIndexError,
        /must be an unsigned 32-bit integer/,
      );
    });

    specify('should throw JSONPointerIndexError for out-of-bounds array index', function () {
      assert.throws(() => evaluate(data, '/foo/5'), JSONPointerIndexError);
    });

    specify('should throw JSONPointerIndexError for leading zero in array index', function () {
      assert.throws(() => evaluate(data, '/foo/01'), JSONPointerIndexError);
    });

    specify('should throw JSONPointerIndexError for "-" when strictArrays is true', function () {
      assert.throws(() => evaluate(data, '/foo/-', { strictArrays: true }), JSONPointerIndexError);
    });

    specify('should return undefined for "-" when strictArrays is false', function () {
      assert.strictEqual(evaluate(data, '/foo/-', { strictArrays: false }), undefined);
    });

    specify(
      'should throw JSONPointerKeyError for accessing chain of object properties that do not exist',
      function () {
        assert.throws(() => evaluate(data, '/missing/key'), JSONPointerKeyError);
      },
    );

    specify(
      'should return undefined accessing object property that does not exist when strictObject is false',
      function () {
        assert.isUndefined(evaluate(data, '/missing', { strictObjects: false }));
      },
    );

    specify('should throw JSONPointerTypeError when evaluating on primitive', function () {
      assert.throws(() => evaluate('not-an-object', '/foo'), JSONPointerTypeError);
    });

    specify(
      'should throw JSONPointerTypeError when trying to access deep path on primitive',
      function () {
        assert.throws(() => evaluate({ foo: 42 }, '/foo/bar'), JSONPointerTypeError);
      },
    );
  });
});
