import { assert } from 'chai';

import { compile } from '../src/index.js';

describe('compile', function () {
  it('should return an empty string for an empty array', function () {
    assert.strictEqual(compile([]), '');
  });

  it('should compile a single reference token', function () {
    assert.strictEqual(compile(['foo']), '/foo');
  });

  it('should join multiple reference tokens with "/"', function () {
    assert.strictEqual(compile(['foo', 'bar', 'baz']), '/foo/bar/baz');
  });

  it('should escape "/" as "~1"', function () {
    assert.strictEqual(compile(['foo/bar']), '/foo~1bar');
  });

  it('should escape "~" as "~0"', function () {
    assert.strictEqual(compile(['foo~bar']), '/foo~0bar');
  });

  it('should escape both "/" and "~" correctly', function () {
    assert.strictEqual(compile(['foo/bar~baz']), '/foo~1bar~0baz');
  });

  it('should handle multiple occurrences of "/" and "~"', function () {
    assert.strictEqual(compile(['/foo~bar/', '/baz~qux/']), '/~1foo~0bar~1/~1baz~0qux~1');
  });

  it('should return the same string if there are no special characters', function () {
    assert.strictEqual(compile(['foo-bar_baz']), '/foo-bar_baz');
  });

  it('should retain spaces and special symbols without escaping them', function () {
    assert.strictEqual(compile(['foo bar', 'baz@qux']), '/foo bar/baz@qux');
  });
});
