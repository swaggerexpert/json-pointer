import { assert } from 'chai';

import { parse, XMLTranslator } from '../../../src/index.js';

describe('parse', function () {
  context('translators', function () {
    context('XMLTranslator', function () {
      specify('should translate a JSON Pointer to a XML', function () {
        const parseResult = parse('/', { translator: new XMLTranslator() });

        assert.isTrue(parseResult.result.success);
        assert.strictEqual(
          parseResult.tree,
          '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<root nodes="3" characters="1">\n' +
            '<!-- input string -->\n' +
            '  /\n' +
            ' <node name="json-pointer" index="0" length="1">\n' +
            '   /\n' +
            '  <node name="slash" index="0" length="1">\n' +
            '    /\n' +
            '  </node><!-- name="slash" -->\n' +
            '  <node name="reference-token" index="1" length="0">\n' +
            '    \n' +
            '  </node><!-- name="reference-token" -->\n' +
            ' </node><!-- name="json-pointer" -->\n' +
            '</root>\n',
        );
      });
    });
  });
});
