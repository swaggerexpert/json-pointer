import { assert } from 'chai';

import { parse, CSTTranslator } from '../../../src/index.js';

describe('parse', function () {
  context('translators', function () {
    context('CSTTranslator', function () {
      specify('should translate a JSON Pointer to a CST', function () {
        const parseResult = parse('/', { translator: new CSTTranslator() });

        assert.isTrue(parseResult.result.success);
        assert.deepEqual(parseResult.tree, {
          root: {
            type: 'json-pointer',
            text: '/',
            start: 0,
            length: 1,
            children: [
              { type: 'text', text: '/', start: 0, length: 1, children: [] },
              {
                type: 'reference-token',
                text: '',
                start: 1,
                length: 0,
                children: [],
              },
            ],
          },
        });
      });
    });
  });
});
