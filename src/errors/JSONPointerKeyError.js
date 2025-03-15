import JSONPointerEvaluateError from './JSONPointerEvaluateError.js';

class JSONPointerKeyError extends JSONPointerEvaluateError {
  constructor(message, options) {
    if (
      typeof message === 'undefined' &&
      (typeof options?.referenceToken === 'string' || typeof options?.referenceToken === 'number')
    ) {
      message = `Invalid object key: '${options.referenceToken}' not found`;
    }

    super(message, options);
  }
}

export default JSONPointerKeyError;
