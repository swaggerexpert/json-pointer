import escape from './escape/index.js';

const compile = (tokens, { tokenEncoder = null } = {}) => {
  if (tokens.length === 0) {
    return '';
  }

  return `/${tokens.map((token) => escape(token, { encoder: tokenEncoder })).join('/')}`;
};

export default compile;
