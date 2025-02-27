import escape from './escape.js';
import JSONPointerCompileError from './errors/JSONPointerCompileError.js';

const compile = (referenceTokens) => {
  try {
    if (referenceTokens.length === 0) {
      return '';
    }

    return `/${referenceTokens.map(escape).join('/')}`;
  } catch (error) {
    throw new JSONPointerCompileError('Unknown error during JSON Pointer compilation', {
      cause: error,
    });
  }
};

export default compile;
