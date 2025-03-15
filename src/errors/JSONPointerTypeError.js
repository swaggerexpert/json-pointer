import JSONPointerEvaluateError from './JSONPointerEvaluateError.js';

class JSONPointerTypeError extends JSONPointerEvaluateError {
  constructor(message, options) {
    if (
      typeof message === 'undefined' &&
      (typeof options?.referenceToken === 'string' || typeof options?.referenceToken === 'number')
    ) {
      message = `Reference token '${options.referenceToken}' cannot be applied to non object/array value)`;
    }

    super(message, options);
  }
}

export default JSONPointerTypeError;
