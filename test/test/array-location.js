import { assert } from 'chai';
import { testArrayLocation } from '../../src/index.js';

describe('testArrayLocation', function () {
  context('valid array locations', function () {
    specify('should return true for valid array locations (rfc 6901)', function () {
      const validLocations = [
        '0', // minimal valid index
        '1', // single-digit positive number
        '9', // highest single digit
        '10', // multi-digit number
        '42', // arbitrary number
        '999', // large index
        '123456789', // long valid number
        '-', // valid array-dash
      ];

      validLocations.forEach((location) => {
        assert.isTrue(testArrayLocation(location), `failed for location: ${location}`);
      });
    });
  });

  context('invalid array locations', function () {
    specify('should return false for locations with disallowed characters', function () {
      const invalidLocations = [
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
        '--', // multiple dashes
        '-0', // dash followed by zero
        ' - ', // dash with spaces
      ];

      invalidLocations.forEach((location) => {
        assert.isFalse(testArrayLocation(location), `failed for location: ${location}`);
      });
    });
  });

  context('edge cases', function () {
    specify('should return false for non-string inputs', function () {
      assert.isFalse(testArrayLocation(42)); // number instead of string
      assert.isFalse(testArrayLocation(null));
      assert.isFalse(testArrayLocation(undefined));
      assert.isFalse(testArrayLocation({}));
      assert.isFalse(testArrayLocation([]));
    });

    specify('should allow exactly "0"', function () {
      assert.isTrue(testArrayLocation('0'));
    });

    specify('should allow exactly "-"', function () {
      assert.isTrue(testArrayLocation('-'));
    });

    specify('should allow numbers without leading zeros', function () {
      assert.isTrue(testArrayLocation('1'));
      assert.isTrue(testArrayLocation('10'));
      assert.isTrue(testArrayLocation('123'));
    });

    specify('should disallow numbers with leading zeros', function () {
      assert.isFalse(testArrayLocation('01'));
      assert.isFalse(testArrayLocation('007'));
    });
  });
});
