import parse from '../parse/index.js';
import testArrayDash from '../test/array-dash.js';
import testArrayIndex from '../test/array-index.js';
import TraceBuilder from './trace/TraceBuilder.js';
import JSONRealm from './realms/json/index.js';
import JSONPointerEvaluateError from '../errors/JSONPointerEvaluateError.js';
import JSONPointerTypeError from '../errors/JSONPointerTypeError.js';
import JSONPointerIndexError from '../errors/JSONPointerIndexError.js';
import JSONPointerKeyError from '../errors/JSONPointerKeyError.js';

const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER.toString();

const evaluate = (
  value,
  jsonPointer,
  { strictArrays = true, strictObjects = true, realm = new JSONRealm(), trace = false } = {},
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

  if (!parseResult.success) {
    let message = `Invalid JSON Pointer: "${jsonPointer}". Syntax error at position ${parseResult.maxMatched}`;
    message += parseTrace ? `, expected ${parseTrace.inferExpectations()}` : '';

    tracer?.step({
      referenceToken: undefined,
      input: value,
      success: false,
      reason: message,
    });

    throw new JSONPointerEvaluateError(message, {
      jsonPointer,
    });
  }

  try {
    let output;

    return referenceTokens.reduce((current, referenceToken, referenceTokenPosition) => {
      if (realm.isArray(current)) {
        if (testArrayDash(referenceToken)) {
          if (strictArrays) {
            const message = `Invalid array index "-" at position ${referenceTokenPosition} in "${jsonPointer}". The "-" token always refers to a nonexistent element during evaluation`;

            tracer?.step({
              referenceToken,
              input: current,
              success: false,
              reason: message,
            });

            throw new JSONPointerIndexError(message, {
              jsonPointer,
              referenceTokens,
              referenceToken,
              referenceTokenPosition,
              currentValue: current,
              realm: realm.name,
            });
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

        if (!testArrayIndex(referenceToken) && strictArrays) {
          const message = `Invalid array index "${referenceToken}" at position ${referenceTokenPosition} in "${jsonPointer}": index MUST be "0", or digits without a leading "0"`;

          tracer?.step({
            referenceToken,
            input: current,
            success: false,
            reason: message,
          });

          throw new JSONPointerIndexError(message, {
            jsonPointer,
            referenceTokens,
            referenceToken,
            referenceTokenPosition,
            currentValue: current,
            realm: realm.name,
          });
        }

        const index = Number(referenceToken);
        const indexUint32 = index >>> 0;

        if (strictArrays && index !== indexUint32) {
          const message = `Invalid array index "${referenceToken}" at position ${referenceTokenPosition} in "${jsonPointer}": index must be an unsigned 32-bit integer`;

          tracer?.step({
            referenceToken,
            input: current,
            success: false,
            reason: message,
          });

          throw new JSONPointerIndexError(message, {
            jsonPointer,
            referenceTokens,
            referenceToken,
            referenceTokenPosition,
            currentValue: current,
            realm: realm.name,
          });
        }

        if (strictArrays && index >= realm.sizeOf(current)) {
          const message = `Invalid array index "${index}" at position ${referenceTokenPosition} in "${jsonPointer}": out of bounds`;

          tracer?.step({
            referenceToken,
            input: current,
            success: false,
            reason: message,
          });

          throw new JSONPointerIndexError(message, {
            jsonPointer,
            referenceTokens,
            referenceToken,
            referenceTokenPosition,
            currentValue: current,
            realm: realm.name,
          });
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
          const message = `Invalid object key "${referenceToken}" at position ${referenceTokenPosition} in "${jsonPointer}": key not found in object`;

          tracer?.step({
            referenceToken,
            input: current,
            success: false,
            reason: message,
          });

          throw new JSONPointerKeyError(message, {
            jsonPointer,
            referenceTokens,
            referenceToken,
            referenceTokenPosition,
            currentValue: current,
            realm: realm.name,
          });
        }

        output = realm.evaluate(current, referenceToken);

        tracer?.step({
          referenceToken,
          input: current,
          output,
        });

        return output;
      }

      const message = `Invalid reference token "${referenceToken}" at position ${referenceTokenPosition} in "${jsonPointer}": cannot be applied to a non-object/non-array value`;

      tracer?.step({
        referenceToken,
        input: current,
        success: false,
        reason: message,
      });

      throw new JSONPointerTypeError(message, {
        jsonPointer,
        referenceTokens,
        referenceToken,
        referenceTokenPosition,
        currentValue: current,
        realm: realm.name,
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
