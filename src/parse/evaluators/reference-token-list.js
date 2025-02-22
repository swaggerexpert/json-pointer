import unescape from '../../unescape.js';

const referenceTokenListEvaluator = (ast) => {
  const parts = [];

  ast.translate(parts);

  return parts.filter(([type]) => type === 'reference-token').map(([, value]) => unescape(value));
};

export default referenceTokenListEvaluator;
