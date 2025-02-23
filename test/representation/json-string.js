import { assert } from 'chai';

import { JSONString } from '../../src/index.js';

describe('JSON String Representation (isomorphic behavior)', function () {
  it('should preserve identity under to() and from() (RFC 6901)', function () {
    const pointers = [
      '',
      '/foo',
      '/foo/0',
      '/',
      '/a~1b',
      '/c%d',
      '/e^f',
      '/g|h',
      '/i\\j',
      '/k"l',
      '/ ',
      '/m~0n',
    ];

    pointers.forEach((pointer) => {
      const jsonString = JSONString.to(pointer);
      const decodedPointer = JSONString.from(jsonString);
      assert.strictEqual(decodedPointer, pointer, `Failed for pointer: ${pointer}`);
    });
  });

  context('edge cases', function () {
    specify('should handle empty string conversion', function () {
      assert.strictEqual(JSONString.to(''), '""');
      assert.strictEqual(JSONString.from('""'), '');
    });

    specify('should handle special characters correctly', function () {
      assert.strictEqual(JSONString.to('/foo"bar'), '"/foo\\"bar"'); // escape quotes
      assert.strictEqual(JSONString.from('"/foo\\"bar"'), '/foo"bar');

      assert.strictEqual(JSONString.to('/back\\slash'), '"/back\\\\slash"'); // escape backslash
      assert.strictEqual(JSONString.from('"/back\\\\slash"'), '/back\\slash');
    });

    specify('should handle unicode characters correctly', function () {
      assert.strictEqual(JSONString.to('/😀'), '"/😀"');
      assert.strictEqual(JSONString.from('"/😀"'), '/😀');
    });

    specify('should return original string if `from()` is given malformed JSON', function () {
      assert.strictEqual(JSONString.from('not a json string'), 'not a json string');
      assert.strictEqual(JSONString.from('{invalid:json}'), '{invalid:json}');
      assert.strictEqual(JSONString.from('42'), '42');
    });

    specify('should correctly handle deeply nested JSON Pointers', function () {
      const nestedPointer = '/foo/bar/baz/qux/quux/corge/grault/garply/waldo/fred';
      const jsonString = JSONString.to(nestedPointer);
      const decodedPointer = JSONString.from(jsonString);
      assert.strictEqual(decodedPointer, nestedPointer);
    });

    specify('should preserve leading and trailing spaces', function () {
      assert.strictEqual(JSONString.to(' /foo/bar '), '" /foo/bar "');
      assert.strictEqual(JSONString.from('" /foo/bar "'), ' /foo/bar ');
    });
  });
});
