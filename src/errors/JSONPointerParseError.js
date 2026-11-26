import JSONPointerError from './JSONPointerError.js';

class JSONPointerParseError extends JSONPointerError {}

Object.defineProperty(JSONPointerParseError, 'name', { value: 'JSONPointerParseError' });

export default JSONPointerParseError;
