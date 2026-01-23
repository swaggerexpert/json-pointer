import { assert } from 'chai';
import { ObjectElement, MemberElement, toValue } from '@swagger-api/apidom-core';
import { InfoElement } from '@swagger-api/apidom-ns-openapi-3-0';

import {
  evaluate,
  JSONPointerIndexError,
  JSONPointerTypeError,
  JSONPointerKeyError,
  JSONPointerParseError,
  URIFragmentIdentifier,
} from '../../../../src/index.js';
import ApiDOMEvaluationRealm from '../../../../src/evaluate/realms/apidom/index.js';

describe('evaluate', function () {
  context('ApiDOM realm', function () {
    const realm = new ApiDOMEvaluationRealm();
    const element = new ObjectElement({
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
        ['', toValue(element)],
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
          const actual = toValue(evaluate(element, jsonString, { realm }));

          assert.deepEqual(actual, expected);
        });
      });
    });

    context('RFC 6901 URI Fragment Identifier tests', function () {
      const fragmentRepEntries = [
        ['#', toValue(element)],
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
          const actual = toValue(
            evaluate(element, URIFragmentIdentifier.from(fragment), {
              realm,
            }),
          );

          assert.deepEqual(actual, expected);
        });
      });
    });

    context('given ApiDOM namespace element', function () {
      specify('should evaluate', function () {
        const infoElement = InfoElement.refract({
          contact: {
            name: 'SwaggerExpert',
            email: 'contact@swaggerexpert.com',
          },
        });
        const actual = toValue(
          evaluate(infoElement, '/contact/name', {
            realm: new ApiDOMEvaluationRealm(),
          }),
        );

        assert.strictEqual(actual, 'SwaggerExpert');
      });
    });

    context('invalid JSON Pointers (should throw errors)', function () {
      specify('should throw JSONPointerParseError for invalid JSON Pointer', function () {
        assert.throws(
          () => evaluate(element, 'invalid-pointer', { realm }),
          JSONPointerParseError,
        );
      });

      specify(
        'should throw JSONPointerTypeError for accessing property on non-object/array',
        function () {
          assert.throws(() => evaluate(element, '/foo/0/bad', { realm }), JSONPointerTypeError);
        },
      );

      specify('should throw JSONPointerKeyError for non-existing key', function () {
        assert.throws(() => evaluate(element, '/nonexistent', { realm }), JSONPointerKeyError);
      });

      specify('should throw JSONPointerIndexError for non-numeric array index', function () {
        assert.throws(() => evaluate(element, '/foo/x', { realm }), JSONPointerIndexError);
      });

      specify('should throw JSONPointerIndexError for out-of-bounds array index', function () {
        assert.throws(() => evaluate(element, '/foo/5', { realm }), JSONPointerIndexError);
      });

      specify('should throw JSONPointerIndexError for leading zero in array index', function () {
        assert.throws(() => evaluate(element, '/foo/01', { realm }), JSONPointerIndexError);
      });

      specify('should throw JSONPointerIndexError for "-" when strictArrays is true', function () {
        assert.throws(
          () => evaluate(element, '/foo/-', { strictArrays: true, realm }),
          JSONPointerIndexError,
        );
      });

      specify('should return undefined for "-" when strictArrays is false', function () {
        assert.strictEqual(evaluate(element, '/foo/-', { strictArrays: false, realm }), undefined);
      });

      specify(
        'should throw JSONPointerKeyError for accessing chain of object properties that do not exist',
        function () {
          assert.throws(() => evaluate(element, '/missing/key', { realm }), JSONPointerKeyError);
        },
      );

      specify(
        'should return undefined accessing object property that does not exist when strictObject is false',
        function () {
          assert.isUndefined(evaluate(element, '/missing', { strictObjects: false, realm }));
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

    context('given member name is not unique in an object', function () {
      specify('should throw JSONPointerKeyError', function () {
        const objectElement = new ObjectElement({ a: 'b' });
        objectElement.content.push(new MemberElement('a', 'c'));

        assert.throws(() => evaluate(objectElement, '/a', { realm }), JSONPointerKeyError);
      });
    });
  });
});
