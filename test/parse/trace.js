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
      const { result, trace } = parse('1', { trace: true });
      const expectations = trace.inferExpectations();
      const errorMessage = `Invalid JSON Pointer: "1". Syntax error at position ${result.maxMatched}, expected ${expectations}`;

      assert.isFalse(result.success);
      assert.strictEqual(
        errorMessage,
        'Invalid JSON Pointer: "1". Syntax error at position 0, expected "/"',
      );
    });
  });
});
