import { assert } from 'chai';

import { unescape } from '../src/index.js';

describe('unescape', function () {
  it('should replace "~1" with "/"', function () {
    assert.strictEqual(unescape('foo~1bar'), 'foo/bar');
  });

  it('should replace "~0" with "~"', function () {
    assert.strictEqual(unescape('foo~0bar'), 'foo~bar');
  });

  it('should replace both "~1" and "~0" correctly', function () {
    assert.strictEqual(unescape('foo~1bar~0baz'), 'foo/bar~baz');
  });

  it('should handle multiple occurrences of "~1" and "~0"', function () {
    assert.strictEqual(unescape('~1foo~0bar~1baz~0qux'), '/foo~bar/baz~qux');
  });

  it('should return the same string if there are no "~1" or "~0" sequences', function () {
    assert.strictEqual(unescape('foobar'), 'foobar');
  });

  it('should handle an empty string correctly', function () {
    assert.strictEqual(unescape(''), '');
  });

  it('should not modify unrelated characters', function () {
    assert.strictEqual(unescape('foo-bar_baz~9'), 'foo-bar_baz~9');
  });
});
