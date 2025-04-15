import { assert } from 'chai';

import { evaluate, JSONPointerEvaluateError } from '../../src/index.js';

describe('evaluate', function () {
  context('given trace option as object', function () {
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
        message: 'JSON Pointer "/a/b" was successfully evaluated against the provided value',
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

    specify('should produce error message with tracing info', function () {
      const trace = {};

      assert.throws(
        () => evaluate({ a: { b: 'c' } }, '1', { trace }),
        JSONPointerEvaluateError,
        'Invalid JSON Pointer: "1". Syntax error at position 0, expected "/"',
      );
      assert.lengthOf(trace.steps, 1);
    });
  });

  context('given trace option as boolean', function () {
    specify('should produce error message with tracing info', function () {
      assert.throws(
        () => evaluate({ a: { b: 'c' } }, '1', { trace: true }),
        JSONPointerEvaluateError,
        'Invalid JSON Pointer: "1". Syntax error at position 0, expected "/"',
      );
    });
  });

  specify('should produce error message without tracking info #1', function () {
    assert.throws(
      () => evaluate({ a: { b: 'c' } }, '1'),
      JSONPointerEvaluateError,
      'Invalid JSON Pointer: "1". Syntax error at position 0',
    );
  });

  specify('should produce error message without tracking info #2', function () {
    assert.throws(
      () => evaluate({ a: { b: 'c' } }, '1', { trace: false }),
      JSONPointerEvaluateError,
      'Invalid JSON Pointer: "1". Syntax error at position 0',
    );
  });
});
