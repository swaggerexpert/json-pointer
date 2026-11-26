import JSONPointerEvaluateError from './JSONPointerEvaluateError.js';

class JSONPointerTypeError extends JSONPointerEvaluateError {}

Object.defineProperty(JSONPointerTypeError, 'name', { value: 'JSONPointerTypeError' });

export default JSONPointerTypeError;
