import parse from './parse/index.js';
import testArrayDash from './test/array-dash.js';
import testArrayIndex from './test/array-index.js';
import JSONPointerEvaluateError from './errors/JSONPointerEvaluateError.js';
import JSONPointerTypeError from './errors/JSONPointerTypeError.js';
import JSONPointerIndexError from './errors/JSONPointerIndexError.js';
import JSONPointerKeyError from './errors/JSONPointerKeyError.js';

const evaluate = (value, jsonPointer, { strictArrays = true, evaluator = null } = {}) => {
  const parseOptions = typeof evaluator === 'function' ? { evaluator } : undefined;
  const { result, computed: referenceTokens } = parse(jsonPointer, parseOptions);

  if (!result.success) {
    throw new JSONPointerEvaluateError(`Invalid JSON Pointer: ${jsonPointer}`);
  }

  return referenceTokens.reduce((current, referenceToken) => {
    if (typeof current !== 'object' || current === null) {
      throw new JSONPointerTypeError(referenceToken);
    }

    if (Array.isArray(current)) {
      if (testArrayDash(referenceToken)) {
        if (strictArrays) {
          throw new JSONPointerIndexError(
            'Invalid array index: "-" always refers to a nonexistent element during evaluation',
          );
        } else {
          return current[current.length];
        }
      }

      if (!testArrayIndex(referenceToken)) {
        throw new JSONPointerIndexError(
          `Invalid array index: '${referenceToken}' (MUST be "0", or digits without a leading "0")`,
        );
      }

      const index = Number(referenceToken);
      if (index >= current.length && strictArrays) {
        throw new JSONPointerIndexError(`Invalid array index: '${index}' out of bounds`);
      }
      return current[index];
    }

    if (!Object.prototype.hasOwnProperty.call(current, referenceToken)) {
      throw new JSONPointerKeyError(referenceToken);
    }

    return current[referenceToken];
  }, value);
};

export default evaluate;
