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

    specify('should percent encode disallowed character', function () {
      assert.strictEqual(URIFragmentIdentifier.to('/foo?#'), '#/foo?%23');
    });

    specify('should correctly convert JSON Pointer to URI Fragment (RFC 6901)', function () {
      assert.strictEqual(URIFragmentIdentifier.to(''), '#');
      assert.strictEqual(URIFragmentIdentifier.to('/foo'), '#/foo');
      assert.strictEqual(URIFragmentIdentifier.to('/foo/0'), '#/foo/0');
      assert.strictEqual(URIFragmentIdentifier.to('/'), '#/');
      assert.strictEqual(URIFragmentIdentifier.to('/a~1b'), '#/a~1b');
      assert.strictEqual(URIFragmentIdentifier.to('/c%d'), '#/c%25d');
      assert.strictEqual(URIFragmentIdentifier.to('/e^f'), '#/e%5Ef');
      assert.strictEqual(URIFragmentIdentifier.to('/g|h'), '#/g%7Ch');
      assert.strictEqual(URIFragmentIdentifier.to('/i\\j'), '#/i%5Cj');
      assert.strictEqual(URIFragmentIdentifier.to('/k"l'), '#/k%22l');
      assert.strictEqual(URIFragmentIdentifier.to('/ '), '#/%20');
      assert.strictEqual(URIFragmentIdentifier.to('/m~0n'), '#/m~0n');
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

    specify('should percent decode disallowed percent encoded character', function () {
      assert.strictEqual(URIFragmentIdentifier.from('#/foo?%23'), '/foo?#');
    });

    specify(
      'should correctly convert between JSON Pointer and URI Fragment (RFC 6901)',
      function () {
        assert.strictEqual(URIFragmentIdentifier.from('#'), '');
        assert.strictEqual(URIFragmentIdentifier.from('#/foo'), '/foo');
        assert.strictEqual(URIFragmentIdentifier.from('#/foo/0'), '/foo/0');
        assert.strictEqual(URIFragmentIdentifier.from('#/'), '/');
        assert.strictEqual(URIFragmentIdentifier.from('#/a~1b'), '/a~1b');
        assert.strictEqual(URIFragmentIdentifier.from('#/c%25d'), '/c%d');
        assert.strictEqual(URIFragmentIdentifier.from('#/e%5Ef'), '/e^f');
        assert.strictEqual(URIFragmentIdentifier.from('#/g%7Ch'), '/g|h');
        assert.strictEqual(URIFragmentIdentifier.from('#/i%5Cj'), '/i\\j');
        assert.strictEqual(URIFragmentIdentifier.from('#/k%22l'), '/k"l');
        assert.strictEqual(URIFragmentIdentifier.from('#/%20'), '/ ');
        assert.strictEqual(URIFragmentIdentifier.from('#/m~0n'), '/m~0n');
      },
    );
  });
});
