import parse from './parse/index.js';
import referenceTokenListEvaluator from './parse/evaluators/reference-token-list.js';
import testArrayDash from './test/array-dash.js';
import testArrayIndex from './test/array-index.js';

const evaluate = (
  value,
  jsonPointer,
  { strictArrays = true, evaluator = referenceTokenListEvaluator, tokenDecoder = null } = {},
) => {
  const { result, computed: referenceTokens } = parse(jsonPointer, { evaluator, tokenDecoder });

  if (!result.success) {
    throw new Error(`Invalid JSON Pointer: ${jsonPointer}`);
  }

  return referenceTokens.reduce((current, referenceToken) => {
    if (typeof current !== 'object' || current === null) {
      throw new Error(`Invalid reference token: '${referenceToken}' (not an object/array)`);
    }

    if (Array.isArray(current)) {
      if (testArrayDash(referenceToken)) {
        if (strictArrays) {
          throw new Error(
            'Invalid array index: "-" always refers to a nonexistent element during evaluation',
          );
        } else {
          return current[current.length];
        }
      }

      if (!testArrayIndex(referenceToken)) {
        throw new Error(
          `Invalid array index: '${referenceToken}' (MUST be "0", or digits without a leading "0")`,
        );
      }

      const index = Number(referenceToken);
      if (index >= current.length && strictArrays) {
        throw new Error(`Invalid array index: '${index}' out of bounds`);
      }
      return current[index];
    }

    if (!Object.prototype.hasOwnProperty.call(current, referenceToken)) {
      throw new Error(`Invalid object key: '${referenceToken}' not found`);
    }

    return current[referenceToken];
  }, value);
};

export default evaluate;
