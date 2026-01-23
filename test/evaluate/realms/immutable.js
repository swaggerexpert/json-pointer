import { assert } from 'chai';
import Immutable from 'immutable';

import {
  evaluate,
  JSONPointerIndexError,
  JSONPointerTypeError,
  JSONPointerKeyError,
  JSONPointerParseError,
  URIFragmentIdentifier,
} from '../../../src/index.js';
import ImmutableEvaluationRealm from '../../../contrib/realms/immutable/index.js';

describe('evaluate', function () {
  const { fromJS } = Immutable;

  context('Immutable.js realm', function () {
    const realm = new ImmutableEvaluationRealm();
    const map = fromJS({
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
    });

    context('RFC 6901 JSON String tests', function () {
      const jsonStringRepEntries = [
        ['', map],
        ['/foo', map.get('foo')],
        ['/foo/0', map.getIn(['foo', 0])],
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
          const actual = evaluate(map, jsonString, { realm });

          assert.strictEqual(actual, expected);
        });
      });
    });

    context('RFC 6901 URI Fragment Identifier tests', function () {
      const fragmentRepEntries = [
        ['#', map],
        ['#/foo', map.get('foo')],
        ['#/foo/0', map.getIn(['foo', 0])],
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
          const actual = evaluate(map, URIFragmentIdentifier.from(fragment), {
            realm,
          });

          assert.deepEqual(actual, expected);
        });
      });
    });

    context('invalid JSON Pointers (should throw errors)', function () {
      specify('should throw JSONPointerParseError for invalid JSON Pointer', function () {
        assert.throws(() => evaluate(map, 'invalid-pointer', { realm }), JSONPointerParseError);
      });

      specify(
        'should throw JSONPointerTypeError for accessing property on non-object/array',
        function () {
          assert.throws(() => evaluate(map, '/foo/0/bad', { realm }), JSONPointerTypeError);
        },
      );

      specify('should throw JSONPointerKeyError for non-existing key', function () {
        assert.throws(() => evaluate(map, '/nonexistent', { realm }), JSONPointerKeyError);
      });

      specify('should throw JSONPointerIndexError for non-numeric array index', function () {
        assert.throws(() => evaluate(map, '/foo/x', { realm }), JSONPointerIndexError);
      });

      specify('should throw JSONPointerIndexError for out-of-bounds array index', function () {
        assert.throws(() => evaluate(map, '/foo/5', { realm }), JSONPointerIndexError);
      });

      specify('should throw JSONPointerIndexError for leading zero in array index', function () {
        assert.throws(() => evaluate(map, '/foo/01', { realm }), JSONPointerIndexError);
      });

      specify('should throw JSONPointerIndexError for "-" when strictArrays is true', function () {
        assert.throws(
          () => evaluate(map, '/foo/-', { strictArrays: true, realm }),
          JSONPointerIndexError,
        );
      });

      specify('should return undefined for "-" when strictArrays is false', function () {
        assert.strictEqual(evaluate(map, '/foo/-', { strictArrays: false, realm }), undefined);
      });

      specify(
        'should throw JSONPointerKeyError for accessing chain of object properties that do not exist',
        function () {
          assert.throws(() => evaluate(map, '/missing/key', { realm }), JSONPointerKeyError);
        },
      );

      specify(
        'should return undefined accessing object property that does not exist when strictObject is false',
        function () {
          assert.isUndefined(evaluate(map, '/missing', { strictObjects: false, realm }));
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
});
