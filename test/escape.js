import { assert } from 'chai';

import { escape } from '../src/index.js';

describe('escape', function () {
  it('should replace "/" with "~1"', function () {
    assert.strictEqual(escape('foo/bar'), 'foo~1bar');
  });

  it('should replace "~" with "~0"', function () {
    assert.strictEqual(escape('foo~bar'), 'foo~0bar');
  });

  it('should replace both "/" and "~" correctly', function () {
    assert.strictEqual(escape('foo/bar~baz'), 'foo~1bar~0baz');
  });

  it('should handle multiple occurrences of "/" and "~"', function () {
    assert.strictEqual(escape('/foo~bar/baz~qux'), '~1foo~0bar~1baz~0qux');
  });

  it('should return the same string if there are no "/" or "~" characters', function () {
    assert.strictEqual(escape('foobar'), 'foobar');
  });

  it('should handle an empty string correctly', function () {
    assert.strictEqual(escape(''), '');
  });

  it('should not modify unrelated characters', function () {
    assert.strictEqual(escape('foo-bar_baz!@#$%^&*()'), 'foo-bar_baz!@#$%^&*()');
  });
});
