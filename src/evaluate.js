import parse from './parse/index.js';
import testArrayDash from './test/array-dash.js';
import testArrayIndex from './test/array-index.js';
import JSONPointerEvaluateError from './errors/JSONPointerEvaluateError.js';
import JSONPointerTypeError from './errors/JSONPointerTypeError.js';
import JSONPointerIndexError from './errors/JSONPointerIndexError.js';
import JSONPointerKeyError from './errors/JSONPointerKeyError.js';

const evaluate = (
  value,
  jsonPointer,
  { strictArrays = true, strictObjects = true, evaluator = null } = {},
) => {
  const parseOptions = typeof evaluator === 'function' ? { evaluator } : undefined;
  const { result, computed: referenceTokens } = parse(jsonPointer, parseOptions);

  if (!result.success) {
    throw new JSONPointerEvaluateError(`Invalid JSON Pointer: ${jsonPointer}`, {
      jsonPointer,
    });
  }

  return referenceTokens.reduce((current, referenceToken, referenceTokenPosition) => {
    if (Array.isArray(current)) {
      if (testArrayDash(referenceToken)) {
        if (strictArrays) {
          throw new JSONPointerIndexError(
            'Invalid array index: "-" always refers to a nonexistent element during evaluation',
            {
              jsonPointer,
              referenceToken,
              referenceTokenPosition,
            },
          );
        } else {
          return current[current.length];
        }
      }

      if (!testArrayIndex(referenceToken) && strictArrays) {
        throw new JSONPointerIndexError(
          `Invalid array index: '${referenceToken}' (MUST be "0", or digits without a leading "0")`,
          {
            jsonPointer,
            referenceToken,
            referenceTokenPosition,
          },
        );
      }

      const index = Number(referenceToken);
      if (index >= current.length && strictArrays) {
        throw new JSONPointerIndexError(`Invalid array index: '${index}' out of bounds`, {
          jsonPointer,
          referenceToken: index,
          referenceTokenPosition,
        });
      }
      return current[index];
    }

    if (typeof current === 'object' && current !== null) {
      if (!Object.prototype.hasOwnProperty.call(current, referenceToken) && strictObjects) {
        throw new JSONPointerKeyError(undefined, referenceToken, {
          jsonPointer,
          referenceToken,
          referenceTokenPosition,
        });
      }

      return current[referenceToken];
    }

    throw new JSONPointerTypeError(undefined, referenceToken, {
      jsonPointer,
      referenceToken,
      referenceTokenPosition,
      currentValue: current,
    });
  }, value);
};

export default evaluate;
