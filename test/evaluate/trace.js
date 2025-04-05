import { assert } from 'chai';

import {
  evaluate,
  JSONPointerIndexError,
  JSONPointerTypeError,
  JSONPointerKeyError,
  JSONPointerEvaluateError,
  URIFragmentIdentifier,
} from '../../src/index.js';
import JSONEvaluationRealm from '../../src/evaluate/realms/json.js';

describe('evaluate', function () {
  context('given trace option', function () {
    specify('should trace successful evaluation', function () {
      const data = { a: { b: 'c' } };
      const trace = {};
      const expected = {
        steps: [
          {
            referenceToken: 'a',
            referenceTokenPosition: 0,
            input: data,
            inputType: 'object',
            output: data.a,
            success: true,
          },
          {
            referenceToken: 'b',
            referenceTokenPosition: 1,
            input: data.a,
            inputType: 'object',
            output: 'c',
            success: true,
          },
        ],
        failed: false,
        failedAt: -1,
        message: 'JSON Pointer successfully evaluated against the value',
        context: {
          jsonPointer: '/a/b',
          referenceTokens: ['a', 'b'],
          strictArrays: true,
          strictObjects: true,
          realm: 'json',
          value: data,
        },
      };

      evaluate(data, '/a/b', { trace });

      assert.deepEqual(trace, expected);
    });

    specify('should trace failed evaluation', function () {
      const data = { a: { b: 'c' } };
      const trace = {};
      const expected = {
        steps: [
          {
            referenceToken: 'a',
            referenceTokenPosition: 0,
            input: data,
            inputType: 'object',
            output: data.a,
            success: true,
          },
          {
            referenceToken: 'c',
            referenceTokenPosition: 1,
            input: data.a,
            inputType: 'object',
            output: undefined,
            success: false,
            reason: 'Invalid object key "c" at position 1 in "/a/c": key not found in object',
          },
        ],
        failed: true,
        failedAt: 1,
        message: 'Invalid object key "c" at position 1 in "/a/c": key not found in object',
        context: {
          jsonPointer: '/a/c',
          referenceTokens: ['a', 'c'],
          strictArrays: true,
          strictObjects: true,
          realm: 'json',
          value: data,
        },
      };

      try {
        evaluate(data, '/a/c', { trace });
      } catch {}

      assert.deepEqual(trace, expected);
    });
  });
});
