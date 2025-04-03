import { assert } from 'chai';
import { Stats } from 'apg-lite';

import { parse } from '../../src/index.js';

describe('parse', function () {
  context('stats', function () {
    specify('should not produce stats by default', function () {
      const parseResult = parse('/a/b');

      assert.isUndefined(parseResult.stats);
    });

    specify('should produce stats when requested', function () {
      const parseResult = parse('/a/b', { stats: true });

      assert.instanceOf(parseResult.stats, Stats);
    });

    specify('should provide operator stats', function () {
      const parseResult = parse('/a/b', { stats: true });
      const expected =
        '          OPERATOR STATS\n' +
        '      |   MATCH |   EMPTY | NOMATCH |   TOTAL |\n' +
        '  ALT |       4 |       0 |       2 |       6 |\n' +
        '  CAT |       2 |       0 |       1 |       3 |\n' +
        '  REP |       3 |       0 |       0 |       3 |\n' +
        '  RNM |       7 |       0 |       2 |       9 |\n' +
        '  TRG |       2 |       0 |       5 |       7 |\n' +
        '  TBS |       0 |       0 |       0 |       0 |\n' +
        '  TLS |       2 |       0 |       1 |       3 |\n' +
        '  UDT |       0 |       0 |       0 |       0 |\n' +
        '  AND |       0 |       0 |       0 |       0 |\n' +
        '  NOT |       0 |       0 |       0 |       0 |\n' +
        'TOTAL |      20 |       0 |      11 |      31 |\n';

      assert.strictEqual(parseResult.stats.displayStats(), expected);
    });

    specify('should provide rules grouped by hit count', function () {
      const parseResult = parse('/a/b', { stats: true });
      const expected =
        '    RULES/UDTS BY HIT COUNT\n' +
        '|   MATCH |   EMPTY | NOMATCH |   TOTAL | NAME\n' +
        '|       2 |       0 |       1 |       3 | unescaped\n' +
        '|       2 |       0 |       0 |       2 | reference-token\n' +
        '|       2 |       0 |       0 |       2 | slash\n' +
        '|       0 |       0 |       1 |       1 | escaped\n' +
        '|       1 |       0 |       0 |       1 | json-pointer\n';

      assert.strictEqual(parseResult.stats.displayHits(), expected);
    });
  });
});
