import JSONPointerEvaluateError from './JSONPointerEvaluateError.js';

class JSONPointerKeyError extends JSONPointerEvaluateError {
  constructor(referenceToken, options) {
    super(`Invalid object key: '${referenceToken}' not found`, options);
  }
}

export default JSONPointerKeyError;
