import { assert } from 'chai';

import { parse } from '../../src/index.js';

describe('parse', function () {
  context('given valid source string', function () {
    context('""', function () {
      specify('should parse', function () {
        const parseResult = parse('');

        assert.isTrue(parseResult.result.success);
        assert.deepEqual(parseResult.tree, []);
      });
    });

    context('/foo', function () {
      specify('should parse', function () {
        const parseResult = parse('/foo');

        assert.isTrue(parseResult.result.success);
        assert.deepEqual(parseResult.tree, ['foo']);
      });
    });

    context('/foo/bar/baz', function () {
      specify('should parse', function () {
        const parseResult = parse('/foo/bar/baz');

        assert.isTrue(parseResult.result.success);
        assert.deepEqual(parseResult.tree, ['foo', 'bar', 'baz']);
      });
    });

    context('/foo//bar', function () {
      specify('should parse', function () {
        const parseResult = parse('/foo//bar');

        assert.isTrue(parseResult.result.success);
        assert.deepEqual(parseResult.tree, ['foo', '', 'bar']);
      });
    });

    context('/a~0b~1c', function () {
      specify('should parse', function () {
        const parseResult = parse('/a~0b~1c');

        assert.isTrue(parseResult.result.success);
        assert.deepEqual(parseResult.tree, ['a~b/c']);
      });
    });

    context('empty string', function () {
      specify('should parse', function () {
        const parseResult = parse('');

        assert.isTrue(parseResult.result.success);
        assert.deepEqual(parseResult.tree, []);
      });
    });

    context('//foo/bar', function () {
      specify('should parse correctly', function () {
        const parseResult = parse('//foo/bar');

        assert.isTrue(parseResult.result.success);
        assert.deepEqual(parseResult.tree, ['', 'foo', 'bar']);
      });
    });

    context('/', function () {
      specify('should parse', function () {
        const parseResult = parse('/');

        assert.isTrue(parseResult.result.success);
        assert.deepEqual(parseResult.tree, ['']);
      });
    });

    context('/foo~~~bar', function () {
      specify('should fail parsing', function () {
        const parseResult = parse('/foo~~~bar');

        assert.isFalse(parseResult.result.success);
        assert.isUndefined(parseResult.tree);
      });
    });

    context('/𝛑/测试', function () {
      specify('should parse correctly', function () {
        const parseResult = parse('/𝛑/测试');

        assert.isTrue(parseResult.result.success);
        assert.deepEqual(parseResult.tree, ['𝛑', '测试']);
      });
    });

    context('/foo/-/bar', function () {
      specify('should parse correctly', function () {
        const parseResult = parse('/foo/-/bar');

        assert.isTrue(parseResult.result.success);
        assert.deepEqual(parseResult.tree, ['foo', '-', 'bar']);
      });
    });

    context('/foo/bar/', function () {
      specify('should parse correctly', function () {
        const parseResult = parse('/foo/bar/');

        assert.isTrue(parseResult.result.success);
        assert.deepEqual(parseResult.tree, ['foo', 'bar', '']);
      });
    });

    context('/foo?bar', function () {
      specify('should parse correctly', function () {
        const parseResult = parse('/foo?bar');

        assert.isTrue(parseResult.result.success);
        assert.deepEqual(parseResult.tree, ['foo?bar']);
      });
    });

    context('/foo#bar', function () {
      specify('should parse correctly', function () {
        const parseResult = parse('/foo#bar');

        assert.isTrue(parseResult.result.success);
        assert.deepEqual(parseResult.tree, ['foo#bar']);
      });
    });
  });

  context('given invalid source string', function () {
    context('1', function () {
      specify('should fail parsing', function () {
        const parseResult = parse('1');

        assert.isFalse(parseResult.result.success);
        assert.isUndefined(parseResult.tree);
      });
    });

    context('nonsensical string', function () {
      specify('should fail parsing', function () {
        const parseResult = parse('nonsensical string');

        assert.isFalse(parseResult.result.success);
        assert.isUndefined(parseResult.tree);
      });
    });

    context('/foo~2bar', function () {
      specify('should fail parsing', function () {
        const parseResult = parse('/foo~2bar');

        assert.isFalse(parseResult.result.success);
        assert.isUndefined(parseResult.tree);
      });
    });

    context('/foo~xbar', function () {
      specify('should fail parsing', function () {
        const parseResult = parse('/foo~xbar');

        assert.isFalse(parseResult.result.success);
        assert.isUndefined(parseResult.tree);
      });
    });

    context('foo/bar', function () {
      specify('should fail parsing', function () {
        const parseResult = parse('foo/bar');

        assert.isFalse(parseResult.result.success);
        assert.isUndefined(parseResult.tree);
      });
    });
  });

  context('given non-string input', function () {
    specify('should throw error', function () {
      assert.throws(() => parse([]), TypeError);
      assert.throws(() => parse(1), TypeError);
      assert.throws(() => parse(null), TypeError);
      assert.throws(() => parse(undefined), TypeError);
    });
  });
});
