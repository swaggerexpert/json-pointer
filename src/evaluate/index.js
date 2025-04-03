import parse from '../parse/index.js';
import testArrayDash from '../test/array-dash.js';
import testArrayIndex from '../test/array-index.js';
import JSONRealm from './realms/json.js';
import JSONPointerEvaluateError from '../errors/JSONPointerEvaluateError.js';
import JSONPointerTypeError from '../errors/JSONPointerTypeError.js';
import JSONPointerIndexError from '../errors/JSONPointerIndexError.js';
import JSONPointerKeyError from '../errors/JSONPointerKeyError.js';

const evaluate = (
  value,
  jsonPointer,
  { strictArrays = true, strictObjects = true, realm = new JSONRealm() } = {},
) => {
  const { result, tree: referenceTokens } = parse(jsonPointer);

  if (!result.success) {
    throw new JSONPointerEvaluateError(`Invalid JSON Pointer: ${jsonPointer}`, {
      jsonPointer,
    });
  }

  try {
    return referenceTokens.reduce((current, referenceToken, referenceTokenPosition) => {
      if (realm.isArray(current)) {
        if (testArrayDash(referenceToken)) {
          if (strictArrays) {
            throw new JSONPointerIndexError(
              'Invalid array index: "-" always refers to a nonexistent element during evaluation',
              {
                jsonPointer,
                referenceTokens,
                referenceToken,
                referenceTokenPosition,
              },
            );
          } else {
            return realm.evaluate(current, String(realm.sizeOf(current)));
          }
        }

        if (!testArrayIndex(referenceToken) && strictArrays) {
          throw new JSONPointerIndexError(
            `Invalid array index: '${referenceToken}' (MUST be "0", or digits without a leading "0")`,
            {
              jsonPointer,
              referenceTokens,
              referenceToken,
              referenceTokenPosition,
            },
          );
        }

        const index = Number(referenceToken);
        if (index >= realm.sizeOf(current) && strictArrays) {
          throw new JSONPointerIndexError(`Invalid array index: '${index}' out of bounds`, {
            jsonPointer,
            referenceTokens,
            referenceToken: index,
            referenceTokenPosition,
          });
        }
        return realm.evaluate(current, referenceToken);
      }

      if (realm.isObject(current)) {
        if (!realm.has(current, referenceToken) && strictObjects) {
          throw new JSONPointerKeyError(`Invalid object key: '${referenceToken}' not found`, {
            jsonPointer,
            referenceTokens,
            referenceToken,
            referenceTokenPosition,
          });
        }

        return realm.evaluate(current, referenceToken);
      }

      throw new JSONPointerTypeError(undefined, {
        jsonPointer,
        referenceTokens,
        referenceToken,
        referenceTokenPosition,
        currentValue: current,
      });
    }, value);
  } catch (error) {
    if (error instanceof JSONPointerEvaluateError) {
      throw error;
    }

    throw new JSONPointerEvaluateError('Unexpected error during JSON Pointer evaluation', {
      cause: error,
      jsonPointer,
      referenceTokens,
    });
  }
};

export default evaluate;
