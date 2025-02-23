import { assert } from 'chai';
import { testReferenceToken } from '../../src/index.js';

describe('testReferenceToken', function () {
  context('valid reference tokens', function () {
    specify('should return true for valid reference tokens (rfc 6901)', function () {
      const validTokens = [
        'foo', // simple name
        'bar123', // alphanumeric
        'hello.world', // period is allowed
        'json_pointer', // underscore allowed
        '0abcDEF', // mix of cases and digits
        '~0', // valid escaped '~'
        '~1', // valid escaped '/'
        'some~0thing', // mixed escape sequence
        'some~1thing', // mixed escape sequence
        'value$', // special character allowed
        'emoji😀', // unicode allowed
        'unicodeΩ', // unicode allowed
        'bar~01', // partial escape followed by invalid char
        '', // empty
      ];

      validTokens.forEach((token) => {
        assert.isTrue(testReferenceToken(token), `failed for token: ${token}`);
      });
    });
  });

  context('invalid reference tokens', function () {
    specify('should return false for tokens with disallowed characters', function () {
      const invalidTokens = [
        'foo/bar', // `/` is not allowed unless escaped
        'foo~', // `~` must be followed by `0` or `1`
        'foo~2', // invalid escape sequence
        'foo~x', // invalid escape sequence
        '~3', // invalid escape sequence
        'foo~1bar/', // contains `/`
        'test~0~', // dangling `~`
        '/leadingSlash', // must not start with '/'
        'trailingSlash/', // must not end with '/'
        'mid~slash/', // misplaced `/`
      ];

      invalidTokens.forEach((token) => {
        assert.isFalse(testReferenceToken(token), `failed for token: ${token}`);
      });
    });
  });

  context('edge cases', function () {
    specify('should return false for non-string inputs', function () {
      assert.isFalse(testReferenceToken(42));
      assert.isFalse(testReferenceToken(null));
      assert.isFalse(testReferenceToken(undefined));
      assert.isFalse(testReferenceToken({}));
      assert.isFalse(testReferenceToken([]));
    });

    specify('should allow a single character if valid', function () {
      assert.isTrue(testReferenceToken('a'));
      assert.isTrue(testReferenceToken('1'));
      assert.isTrue(testReferenceToken('~0'));
      assert.isTrue(testReferenceToken('~1'));
    });

    specify('should disallow a single invalid character', function () {
      assert.isFalse(testReferenceToken('/'));
      assert.isFalse(testReferenceToken('~'));
    });
  });
});
