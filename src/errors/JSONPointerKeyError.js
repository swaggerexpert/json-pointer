import JSONPointerEvaluateError from './JSONPointerEvaluateError.js';

class JSONPointerKeyError extends JSONPointerEvaluateError {}

Object.defineProperty(JSONPointerKeyError, 'name', { value: 'JSONPointerKeyError' });

export default JSONPointerKeyError;
