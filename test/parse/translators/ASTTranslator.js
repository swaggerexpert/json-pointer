import { assert } from 'chai';

import { parse, ASTTranslator } from '../../../src/index.js';

describe('parse', function () {
  context('translators', function () {
    context('ASTTranslator', function () {
      specify('should translate a JSON Pointer to a AST', function () {
        const parseResult = parse('/a/b', { translator: new ASTTranslator() });

        assert.isTrue(parseResult.result.success);
        assert.deepEqual(parseResult.tree, ['a', 'b']);
      });
    });
  });
});
