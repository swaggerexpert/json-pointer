import unescape from '../../unescape/index.js';

const referenceTokenListEvaluator = (ast, { tokenDecoder = null } = {}) => {
  const parts = [];

  ast.translate(parts);

  return parts
    .filter(([type]) => type === 'reference-token')
    .map(([, value]) => unescape(value, { decoder: tokenDecoder }));
};

export default referenceTokenListEvaluator;
