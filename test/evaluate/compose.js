import { assert } from 'chai';

import { evaluate, composeRealms, JSONPointerEvaluateError } from '../../src/index.js';
import JSONEvaluationRealm from '../../src/evaluate/realms/json.js';
import MapSetEvaluationRealm from '../../src/evaluate/realms/map-set.js';

describe('evaluate', function () {
  context('composeRealms', function () {
    specify('should compose realms', function () {
      const compositeRealm = composeRealms(new MapSetEvaluationRealm(), new JSONEvaluationRealm());
      const structure = [
        {
          a: new Map([['b', new Set(['c', 'd'])]]),
        },
      ];
      const actual = evaluate(structure, '/0/a/b/1', { realm: compositeRealm });
      const expected = 'd';

      assert.strictEqual(actual, expected);
    });

    specify('should throw on empty composition', function () {
      const compositeRealm = composeRealms();
      const structure = [
        {
          a: new Map([['b', new Set(['c', 'd'])]]),
        },
      ];

      assert.throws(
        () => evaluate(structure, '/0/a/b/1', { realm: compositeRealm }),
        JSONPointerEvaluateError,
      );
    });

    specify('should throw on invalid realm', function () {
      const compositeRealm = composeRealms({});
      const structure = [
        {
          a: new Map([['b', new Set(['c', 'd'])]]),
        },
      ];

      try {
        evaluate(structure, '/0/a/b/1', { realm: compositeRealm });
        assert.fail('Expected an error to be thrown');
      } catch (error) {
        assert.instanceOf(error, JSONPointerEvaluateError);
        assert.instanceOf(error.cause, TypeError);
      }
    });
  });
});
