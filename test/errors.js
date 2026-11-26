import { assert } from 'chai';

import {
  JSONPointerError,
  JSONPointerParseError,
  JSONPointerCompileError,
  JSONPointerEvaluateError,
  JSONPointerTypeError,
  JSONPointerKeyError,
  JSONPointerIndexError,
} from '../src/index.js';

describe('errors', function () {
  const errorClasses = {
    JSONPointerError,
    JSONPointerParseError,
    JSONPointerCompileError,
    JSONPointerEvaluateError,
    JSONPointerTypeError,
    JSONPointerKeyError,
    JSONPointerIndexError,
  };

  Object.entries(errorClasses).forEach(([name, ErrorClass]) => {
    specify(`${name} should have explicit name`, function () {
      assert.strictEqual(ErrorClass.name, name);
      assert.strictEqual(new ErrorClass('message').name, name);
    });
  });

  specify('should name instances of subclasses after the subclass', function () {
    class CustomError extends JSONPointerKeyError {}

    assert.strictEqual(new CustomError('message').name, 'CustomError');
  });
});
