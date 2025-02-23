import { assert } from 'chai';

import { parse, JSONPointerParseError } from '../src/index.js';

describe('parse', function () {
  context('given valid source string', function () {
    context('""', function () {
      specify('should parse and translate', function () {
        const parseResult = parse('');

        const parts = [];
        parseResult.ast.translate(parts);

        assert.isTrue(parseResult.result.success);
        assert.deepEqual(parts, [['json-pointer', '']]);
      });
    });

    context('/foo', function () {
      specify('should parse and translate', function () {
        const parseResult = parse('/foo');

        const parts = [];
        parseResult.ast.translate(parts);

        assert.isTrue(parseResult.result.success);
        assert.deepEqual(parts, [
          ['json-pointer', '/foo'],
          ['reference-token', 'foo'],
        ]);
      });
    });

    context('/foo/bar/baz', function () {
      specify('should parse and translate', function () {
        const parseResult = parse('/foo/bar/baz');

        const parts = [];
        parseResult.ast.translate(parts);

        assert.isTrue(parseResult.result.success);
        assert.deepEqual(parts, [
          ['json-pointer', '/foo/bar/baz'],
          ['reference-token', 'foo'],
          ['reference-token', 'bar'],
          ['reference-token', 'baz'],
        ]);
      });
    });

    context('/foo//bar', function () {
      specify('should parse and translate correctly', function () {
        const parseResult = parse('/foo//bar');

        const parts = [];
        parseResult.ast.translate(parts);

        assert.isTrue(parseResult.result.success);
        assert.deepEqual(parts, [
          ['json-pointer', '/foo//bar'],
          ['reference-token', 'foo'],
          ['reference-token', ''],
          ['reference-token', 'bar'],
        ]);
      });
    });

    context('/a~0b~1c', function () {
      specify('should parse and translate correctly', function () {
        const parseResult = parse('/a~0b~1c');

        assert.isTrue(parseResult.result.success);
        assert.deepEqual(parseResult.computed, ['a~b/c']);
      });
    });

    context('empty string', function () {
      specify('should parse and translate', function () {
        const parseResult = parse('');

        const parts = [];
        parseResult.ast.translate(parts);

        assert.isTrue(parseResult.result.success);
        assert.deepEqual(parseResult.computed, []);
      });
    });

    context('//foo/bar', function () {
      specify('should parse correctly', function () {
        const parseResult = parse('//foo/bar');

        const parts = [];
        parseResult.ast.translate(parts);

        assert.isTrue(parseResult.result.success);
        assert.deepEqual(parts, [
          ['json-pointer', '//foo/bar'],
          ['reference-token', ''],
          ['reference-token', 'foo'],
          ['reference-token', 'bar'],
        ]);
      });
    });

    context('/', function () {
      specify('should parse and translate correctly', function () {
        const parseResult = parse('/');

        const parts = [];
        parseResult.ast.translate(parts);

        assert.isTrue(parseResult.result.success);
        assert.deepEqual(parts, [
          ['json-pointer', '/'],
          ['reference-token', ''],
        ]);
      });
    });

    context('/foo~~~bar', function () {
      specify('should fail parsing', function () {
        const parseResult = parse('/foo~~~bar');

        assert.isFalse(parseResult.result.success);
        assert.isNull(parseResult.computed);
      });
    });

    context('/𝛑/测试', function () {
      specify('should parse correctly', function () {
        const parseResult = parse('/𝛑/测试');

        const parts = [];
        parseResult.ast.translate(parts);

        assert.isTrue(parseResult.result.success);
        assert.deepEqual(parts, [
          ['json-pointer', '/𝛑/测试'],
          ['reference-token', '𝛑'],
          ['reference-token', '测试'],
        ]);
      });
    });

    context('/foo/-/bar', function () {
      specify('should parse correctly', function () {
        const parseResult = parse('/foo/-/bar');

        assert.isTrue(parseResult.result.success);
        assert.deepEqual(parseResult.computed, ['foo', '-', 'bar']);
      });
    });

    context('/foo/bar/', function () {
      specify('should parse correctly', function () {
        const parseResult = parse('/foo/bar/');

        assert.isTrue(parseResult.result.success);
        assert.deepEqual(parseResult.computed, ['foo', 'bar', '']);
      });
    });

    context('/foo?bar', function () {
      specify('should parse correctly', function () {
        const parseResult = parse('/foo?bar');

        assert.isTrue(parseResult.result.success);
        assert.deepEqual(parseResult.computed, ['foo?bar']);
      });
    });

    context('/foo#bar', function () {
      specify('should parse correctly', function () {
        const parseResult = parse('/foo#bar');

        assert.isTrue(parseResult.result.success);
        assert.deepEqual(parseResult.computed, ['foo#bar']);
      });
    });
  });

  context('given invalid source string', function () {
    context('1', function () {
      specify('should fail parsing', function () {
        const parseResult = parse('1');

        assert.isFalse(parseResult.result.success);
        assert.isNull(parseResult.computed);
      });
    });

    context('nonsensical string', function () {
      specify('should fail parsing', function () {
        const parseResult = parse('nonsensical string');

        assert.isFalse(parseResult.result.success);
        assert.isNull(parseResult.computed);
      });
    });

    context('/foo~2bar', function () {
      specify('should fail parsing', function () {
        const parseResult = parse('/foo~2bar');

        assert.isFalse(parseResult.result.success);
        assert.isNull(parseResult.computed);
      });
    });

    context('/foo~xbar', function () {
      specify('should fail parsing', function () {
        const parseResult = parse('/foo~xbar');

        assert.isFalse(parseResult.result.success);
        assert.isNull(parseResult.computed);
      });
    });

    context('foo/bar', function () {
      specify('should fail parsing', function () {
        const parseResult = parse('foo/bar');

        assert.isFalse(parseResult.result.success);
        assert.isNull(parseResult.computed);
      });
    });
  });

  context('given non-string input', function () {
    specify('should throw error', function () {
      assert.throws(() => parse([]), JSONPointerParseError);
      assert.throws(() => parse(1), JSONPointerParseError);
      assert.throws(() => parse(null), JSONPointerParseError);
      assert.throws(() => parse(undefined), JSONPointerParseError);
    });
  });
});
