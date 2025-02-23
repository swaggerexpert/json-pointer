import { assert } from 'chai';
import { testArrayIndex } from '../../src/index.js';

describe('testArrayIndex', function () {
  context('valid array indices', function () {
    specify('should return true for valid array indices (rfc 6901)', function () {
      const validIndices = [
        '0', // minimal valid index
        '1', // single-digit positive number
        '9', // highest single digit
        '10', // multi-digit number
        '42', // arbitrary number
        '999', // large index
        '123456789', // long valid number
      ];

      validIndices.forEach((index) => {
        assert.isTrue(testArrayIndex(index), `failed for index: ${index}`);
      });
    });
  });

  context('invalid array indices', function () {
    specify('should return false for indices with disallowed characters', function () {
      const invalidIndices = [
        '-1', // negative number
        '01', // leading zero
        '00', // multiple leading zeros
        '0123', // leading zero on a multi-digit number
        '1.0', // floating-point number
        '1,000', // comma-separated
        '1e3', // scientific notation
        'ten', // non-numeric string
        '1a', // mixed alphanumeric
        '1-', // trailing dash
        '', // empty string
        ' ', // space only
        ' 10', // leading space
        '10 ', // trailing space
        '0x1', // hexadecimal notation
      ];

      invalidIndices.forEach((index) => {
        assert.isFalse(testArrayIndex(index), `failed for index: ${index}`);
      });
    });
  });

  context('edge cases', function () {
    specify('should return false for non-string inputs', function () {
      assert.isFalse(testArrayIndex(42)); // number instead of string
      assert.isFalse(testArrayIndex(null));
      assert.isFalse(testArrayIndex(undefined));
      assert.isFalse(testArrayIndex({}));
      assert.isFalse(testArrayIndex([]));
    });

    specify('should allow exactly "0"', function () {
      assert.isTrue(testArrayIndex('0'));
    });

    specify('should allow numbers without leading zeros', function () {
      assert.isTrue(testArrayIndex('1'));
      assert.isTrue(testArrayIndex('10'));
      assert.isTrue(testArrayIndex('123'));
    });

    specify('should disallow numbers with leading zeros', function () {
      assert.isFalse(testArrayIndex('01'));
      assert.isFalse(testArrayIndex('007'));
    });
  });
});
