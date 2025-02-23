import escape from './escape.js';
import JSONPointerCompileError from './errors/JSONPointerCompileError.js';

const compile = (tokens) => {
  try {
    if (tokens.length === 0) {
      return '';
    }

    return `/${tokens.map(escape).join('/')}`;
  } catch (error) {
    throw new JSONPointerCompileError('Unknown error during JSON Pointer compilation', {
      cause: error,
    });
  }
};

export default compile;
