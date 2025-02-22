import escape from './escape.js';

const compile = (tokens) => {
  if (tokens.length === 0) {
    return '';
  }

  return `/${tokens.map(escape).join('/')}`;
};

export default compile;
