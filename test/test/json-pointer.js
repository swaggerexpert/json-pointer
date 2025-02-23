import { assert } from 'chai';
import { testJSONPointer } from '../../src/index.js';

describe('testJSONPointer', function () {
  context('valid JSON Pointers', function () {
    it('should return true for valid JSON Pointers (rfc 6901)', function () {
      const validPointers = [
        '', // whole document
        '/foo', // valid key
        '/foo/0', // valid array index
        '/', // empty key (valid but rare)
        '/a~1b', // escaped `/`
        '/c%d', // special character
        '/e^f', // special character
        '/g|h', // special character
        '/i\\j', // escape sequence
        '/k"l', // quotation mark inside key
        '/ ', // space as key
        '/m~0n', // escaped `~`
        '/foo//bar', // valid: double `/` means empty segment
        '/foo/01', // valid: JSON Pointer allows leading zeroes in path segments
        '/-', // valid: `-` can be used in array operations
        '/foo/bar/', // valid: trailing slash is allowed
        '/foo[0]', // valid: brackets are allowed in keys
        '/foo?bar', // valid: `?` can be part of a key
        '/#hashtag', // valid: `#` can be part of a key
        '/foo bar', // valid: spaces are allowed in keys
      ];

      validPointers.forEach((pointer) => {
        assert.isTrue(testJSONPointer(pointer), `failed for pointer: ${pointer}`);
      });
    });
  });

  context('invalid JSON Pointers', function () {
    it('should return false for malformed JSON Pointers', function () {
      const invalidPointers = [
        '/foo/~', // unescaped `~` at the end
        '/foo/~2bar', // invalid escape `~2`,
        'foo', // valid relative JSON Pointer
        'foo/bar', // valid relative JSON Pointer
      ];

      invalidPointers.forEach((pointer) => {
        assert.isFalse(testJSONPointer(pointer), `failed for pointer: ${pointer}`);
      });
    });
  });
});
