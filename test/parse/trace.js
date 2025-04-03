import { assert } from 'chai';
import { Trace } from 'apg-lite';

import { parse } from '../../src/index.js';

describe('parse', function () {
  context('trace', function () {
    specify('should not produce trace by default', function () {
      const parseResult = parse('/a/b');

      assert.isUndefined(parseResult.trace);
    });

    specify('should produce stats when requested', function () {
      const parseResult = parse('/a/b', { trace: true });

      assert.instanceOf(parseResult.trace, Trace);
    });

    specify('should provide trace', function () {
      const parseResult = parse('/a', { trace: true });
      const expected =
        '|-|[RNM(json-pointer)]/a\n' +
        '.|-|[REP(0,inf)]/a\n' +
        '..|-|[CAT]/a\n' +
        '...|-|[RNM(slash)]/a\n' +
        '....|-|[TLS(/)]/a\n' +
        "....|M|[TLS(/)]'/'\n" +
        "...|M|[RNM(slash)]'/'\n" +
        '...|-|[RNM(reference-token)]a\n' +
        '....|-|[REP(0,inf)]a\n' +
        '....||-|[ALT]a\n' +
        '....|.|-|[RNM(unescaped)]a\n' +
        '....|..|-|[ALT]a\n' +
        '....|...|-|[TRG(0,46)]a\n' +
        '....|...|N|[TRG(0,46)]\n' +
        '....|...|-|[TRG(48,125)]a\n' +
        "....|...|M|[TRG(48,125)]'a'\n" +
        "....|..|M|[ALT]'a'\n" +
        "....|.|M|[RNM(unescaped)]'a'\n" +
        "....||M|[ALT]'a'\n" +
        "....|M|[REP(0,inf)]'a'\n" +
        "...|M|[RNM(reference-token)]'a'\n" +
        "..|M|[CAT]'/a'\n" +
        ".|M|[REP(0,inf)]'/a'\n" +
        "|M|[RNM(json-pointer)]'/a'\n";

      assert.strictEqual(parseResult.trace.displayTrace(), expected);
    });

    specify('should be able to create human-readable trace message', function () {
      function inferExpectations(traceText) {
        const lines = traceText.split('\n');
        const expectations = new Set();
        let collecting = false;
        let lastMatchedIndex = -1;

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];

          // capture the max match line (first one that ends in a single character match)
          if (!collecting && line.includes('M|')) {
            const textMatch = line.match(/]'(.*)'$/);
            if (textMatch && textMatch[1]) {
              lastMatchedIndex = i;
            }
          }

          // begin collecting after the deepest successful match
          if (i > lastMatchedIndex) {
            const terminalFailMatch = line.match(/N\|\[TLS\(([^)]+)\)\]/);
            if (terminalFailMatch) {
              expectations.add(terminalFailMatch[1]);
            }
          }
        }

        return Array.from(expectations);
      }

      const { result, trace } = parse('1', { trace: true });
      const expectations = inferExpectations(trace.displayTrace())
        .map((c) => `"${c}"`)
        .join(', ');
      const errorMessage = `Syntax error at position ${result.maxMatched}, expected ${expectations}`;

      assert.isFalse(result.success);
      assert.strictEqual(errorMessage, 'Syntax error at position 0, expected "/"');
    });
  });
});
