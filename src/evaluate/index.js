import parse from '../parse/index.js';
import testArrayDash from '../test/array-dash.js';
import testArrayIndex from '../test/array-index.js';
import TraceBuilder from './trace/TraceBuilder.js';
import JSONRealm from './realms/json/index.js';
import JSONPointerEvaluateError from '../errors/JSONPointerEvaluateError.js';
import JSONPointerTypeError from '../errors/JSONPointerTypeError.js';
import JSONPointerIndexError from '../errors/JSONPointerIndexError.js';
import JSONPointerKeyError from '../errors/JSONPointerKeyError.js';

const evaluate = (
  value,
  jsonPointer,
  { strictArrays = true, strictObjects = true, realm = new JSONRealm(), trace = true } = {},
) => {
  const {
    result: parseResult,
    tree: referenceTokens,
    trace: parseTrace,
  } = parse(jsonPointer, { trace: !!trace });

  const tracer =
    typeof trace === 'object' && trace !== null
      ? new TraceBuilder(trace, {
          jsonPointer,
          referenceTokens,
          strictArrays,
          strictObjects,
          realm,
          value,
        })
      : null;

  try {
    let output;

    if (!parseResult.success) {
      let message = `Invalid JSON Pointer: "${jsonPointer}". Syntax error at position ${parseResult.maxMatched}`;
      message += parseTrace ? `, expected ${parseTrace.inferExpectations()}` : '';

      throw new JSONPointerEvaluateError(message, {
        jsonPointer,
        currentValue: value,
        realm: realm.name,
      });
    }

    return referenceTokens.reduce((current, referenceToken, referenceTokenPosition) => {
      if (realm.isArray(current)) {
        if (testArrayDash(referenceToken)) {
          if (strictArrays) {
            throw new JSONPointerIndexError(
              `Invalid array index "-" at position ${referenceTokenPosition} in "${jsonPointer}". The "-" token always refers to a nonexistent element during evaluation`,
              {
                jsonPointer,
                referenceTokens,
                referenceToken,
                referenceTokenPosition,
                currentValue: current,
                realm: realm.name,
              },
            );
          } else {
            output = realm.evaluate(current, String(realm.sizeOf(current)));

            tracer?.step({
              referenceToken,
              input: current,
              output,
            });

            return output;
          }
        }

        if (!testArrayIndex(referenceToken)) {
          throw new JSONPointerIndexError(
            `Invalid array index "${referenceToken}" at position ${referenceTokenPosition} in "${jsonPointer}": index MUST be "0", or digits without a leading "0"`,
            {
              jsonPointer,
              referenceTokens,
              referenceToken,
              referenceTokenPosition,
              currentValue: current,
              realm: realm.name,
            },
          );
        }

        const index = Number(referenceToken);

        if (!Number.isSafeInteger(index)) {
          throw new JSONPointerIndexError(
            `Invalid array index "${referenceToken}" at position ${referenceTokenPosition} in "${jsonPointer}": index must be a safe integer`,
            {
              jsonPointer,
              referenceTokens,
              referenceToken,
              referenceTokenPosition,
              currentValue: current,
              realm: realm.name,
            },
          );
        }

        if (!realm.has(current, referenceToken) && strictArrays) {
          throw new JSONPointerIndexError(
            `Invalid array index "${referenceToken}" at position ${referenceTokenPosition} in "${jsonPointer}": out of bounds`,
            {
              jsonPointer,
              referenceTokens,
              referenceToken,
              referenceTokenPosition,
              currentValue: current,
              realm: realm.name,
            },
          );
        }

        output = realm.evaluate(current, referenceToken);

        tracer?.step({
          referenceToken,
          input: current,
          output,
        });

        return output;
      }

      if (realm.isObject(current)) {
        if (!realm.has(current, referenceToken) && strictObjects) {
          throw new JSONPointerKeyError(
            `Invalid object key "${referenceToken}" at position ${referenceTokenPosition} in "${jsonPointer}": key not found in object`,
            {
              jsonPointer,
              referenceTokens,
              referenceToken,
              referenceTokenPosition,
              currentValue: current,
              realm: realm.name,
            },
          );
        }

        output = realm.evaluate(current, referenceToken);

        tracer?.step({
          referenceToken,
          input: current,
          output,
        });

        return output;
      }

      throw new JSONPointerTypeError(
        `Invalid reference token "${referenceToken}" at position ${referenceTokenPosition} in "${jsonPointer}": cannot be applied to a non-object/non-array value`,
        {
          jsonPointer,
          referenceTokens,
          referenceToken,
          referenceTokenPosition,
          currentValue: current,
          realm: realm.name,
        },
      );
    }, value);
  } catch (error) {
    tracer?.step({
      referenceToken: error.referenceToken,
      input: error.currentValue,
      success: false,
      reason: error.message,
    });

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
