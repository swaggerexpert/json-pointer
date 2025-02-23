import JSONPointerEvaluateError from './JSONPointerEvaluateError.js';

class JSONPointerIndexError extends JSONPointerEvaluateError {
  constructor(message, options) {
    super(message, options);
  }
}

export default JSONPointerIndexError;
