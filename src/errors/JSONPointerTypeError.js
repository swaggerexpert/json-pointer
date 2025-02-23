import JSONPointerEvaluateError from './JSONPointerEvaluateError.js';

class JSONPointerTypeError extends JSONPointerEvaluateError {
  constructor(referenceToken, options) {
    super(`Invalid reference token: '${referenceToken}' (not an object/array)`, options);
  }
}

export default JSONPointerTypeError;
