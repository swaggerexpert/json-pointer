import { assert } from 'chai';

import { URIFragmentIdentifier } from '../../src/index.js';

describe('URI Fragment Identifier (to/from)', function () {
  context('to()', function () {
    specify(
      'should convert JSON Pointer to URI Fragment without modifying "~" and "/"',
      function () {
        assert.strictEqual(URIFragmentIdentifier.to('/a~b/c'), '#/a~b/c');
      },
    );

    specify('should encode spaces and special characters', function () {
      assert.strictEqual(URIFragmentIdentifier.to('/hello world/$test'), '#/hello%20world/$test');
    });

    specify('should return "#" for an empty JSON Pointer', function () {
      assert.strictEqual(URIFragmentIdentifier.to(''), '#');
    });
  });

  context('from()', function () {
    specify('should decode URI but preserve "~0" and "~1"', function () {
      assert.strictEqual(URIFragmentIdentifier.from('#/a~0b~1c'), '/a~0b~1c');
    });

    specify('should decode "%20" as space', function () {
      assert.strictEqual(URIFragmentIdentifier.from('#/hello%20world/$test'), '/hello world/$test');
    });

    specify('should remove "#" from the fragment', function () {
      assert.strictEqual(URIFragmentIdentifier.from('#/foo/bar'), '/foo/bar');
    });

    specify('should return an empty string for "#"', function () {
      assert.strictEqual(URIFragmentIdentifier.from('#'), '');
    });

    specify('should not modify a fragment without "#" prefix', function () {
      assert.strictEqual(URIFragmentIdentifier.from('/foo/bar'), '/foo/bar');
    });

    specify('should return the original input if decoding fails', function () {
      assert.strictEqual(URIFragmentIdentifier.from('%E3%81%'), '%E3%81%'); // Malformed UTF-8 sequence
    });
  });
});
