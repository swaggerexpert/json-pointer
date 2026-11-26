import JSONPointerError from './JSONPointerError.js';

class JSONPointerEvaluateError extends JSONPointerError {}

Object.defineProperty(JSONPointerEvaluateError, 'name', { value: 'JSONPointerEvaluateError' });

export default JSONPointerEvaluateError;
