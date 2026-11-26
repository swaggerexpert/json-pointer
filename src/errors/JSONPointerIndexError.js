import JSONPointerEvaluateError from './JSONPointerEvaluateError.js';

class JSONPointerIndexError extends JSONPointerEvaluateError {}

Object.defineProperty(JSONPointerIndexError, 'name', { value: 'JSONPointerIndexError' });

export default JSONPointerIndexError;
