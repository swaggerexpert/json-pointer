import { assert } from 'chai';

import {
  evaluate,
  JSONPointerIndexError,
  JSONPointerTypeError,
  JSONPointerKeyError,
  JSONPointerEvaluateError,
  referenceTokenListEvaluator,
  URIFragmentIdentifier,
} from '../../src/index.js';
import JSONEvaluationRealm from '../../src/evaluate/realms/json.js';

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

  context('RFC 6901 JSON String tests', function () {
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

  context('valid JSON Pointers', function () {
    specify('should return entire document for ""', function () {
      assert.deepEqual(evaluate(data, ''), data);
    });

    specify('should return array ["bar", "baz"] for "/foo"', function () {
      assert.deepEqual(evaluate(data, '/foo'), ['bar', 'baz']);
    });

    specify('should return "bar" for "/foo/0"', function () {
      assert.strictEqual(evaluate(data, '/foo/0'), 'bar');
    });

    specify('should return 0 for "/"', function () {
      assert.strictEqual(evaluate(data, '/'), 0);
    });

    specify('should return 1 for "/a~1b"', function () {
      assert.strictEqual(evaluate(data, '/a~1b'), 1);
    });

    specify('should return 2 for "/c%d"', function () {
      assert.strictEqual(evaluate(data, '/c%d'), 2);
    });

    specify('should return 3 for "/e^f"', function () {
      assert.strictEqual(evaluate(data, '/e^f'), 3);
    });

    specify('should return 4 for "/g|h"', function () {
      assert.strictEqual(evaluate(data, '/g|h'), 4);
    });

    specify('should return 5 for "/i\\j"', function () {
      assert.strictEqual(evaluate(data, '/i\\j'), 5);
    });

    specify('should return 6 for "/k\"l"', function () {
      assert.strictEqual(evaluate(data, '/k"l'), 6);
    });

    specify('should return 7 for "/ "', function () {
      assert.strictEqual(evaluate(data, '/ '), 7);
    });

    specify('should return 8 for "/m~0n"', function () {
      assert.strictEqual(evaluate(data, '/m~0n'), 8);
    });
  });

  context('given custom evaluator option', function () {
    specify('should correctly use a default evaluator', function () {
      const result = evaluate(data, '/a~1b', { evaluator: referenceTokenListEvaluator });

      assert.deepEqual(result, 1); // Evaluator should return unescaped reference token list
    });

    specify('should use a custom evaluator', function () {
      const evaluator = (ast) => {
        const parts = [];

        ast.translate(parts);

        return parts.filter(([type]) => type === 'reference-token').map(([, value]) => value);
      };

      assert.throws(() => evaluate(data, '/a~1b', { evaluator }), JSONPointerKeyError);
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
