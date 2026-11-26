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
            '<!--\n' +
            '  Caveat: AST node phrases may not be faithfully represented.\n' +
            '          Invalid XML characters are replaced with 0xFFFD.\n' +
            '          Special characters &<>"\' are escaped with XML entities.\n' +
            '-->\n' +
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

      specify('should escape XML special characters', function () {
        const parseResult = parse('/</node><x>&"\'', { translator: new XMLTranslator() });

        assert.isTrue(parseResult.result.success);
        assert.include(parseResult.tree, '&lt;/node&gt;&lt;x&gt;&amp;&quot;&apos;');
        assert.notInclude(parseResult.tree, '</node><x>');
        // & is allowed in XML comments, e.g. in the caveat comment of apg-lite
        const withoutComments = parseResult.tree.replace(/<!--[\s\S]*?-->/g, '');
        assert.notMatch(withoutComments, /&(?!amp;|lt;|gt;|quot;|apos;)/);
      });
    });
  });
});
