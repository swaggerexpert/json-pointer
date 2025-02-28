import JSONPointerEvaluateError from './JSONPointerEvaluateError.js';

class JSONPointerTypeError extends JSONPointerEvaluateError {
  constructor(referenceToken, options) {
    super(
      `Reference token '${referenceToken}' cannot be applied to non object/array value)`,
      options,
    );
  }
}

export default JSONPointerTypeError;
