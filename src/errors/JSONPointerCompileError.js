import JSONPointerError from './JSONPointerError.js';

class JSONPointerCompileError extends JSONPointerError {}

Object.defineProperty(JSONPointerCompileError, 'name', { value: 'JSONPointerCompileError' });

export default JSONPointerCompileError;
