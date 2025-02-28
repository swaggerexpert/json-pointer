import escape from './escape.js';
import JSONPointerCompileError from './errors/JSONPointerCompileError.js';

const compile = (referenceTokens) => {
  try {
    if (referenceTokens.length === 0) {
      return '';
    }

    return `/${referenceTokens
      .map((referenceToken) => {
        if (typeof referenceToken !== 'string' && typeof referenceToken !== 'number') {
          throw new TypeError('Reference token must be a string or number');
        }
        return escape(String(referenceToken));
      })
      .join('/')}`;
  } catch (error) {
    throw new JSONPointerCompileError('Unknown error during JSON Pointer compilation', {
      cause: error,
    });
  }
};

export default compile;
