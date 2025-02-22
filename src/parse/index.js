import { Ast as AST, Parser } from 'apg-lite';

import Grammar from '../grammar.js';
import jsonPointerCallback from './callbacks/json-pointer.js';
import referenceTokenCallback from './callbacks/reference-token.js';
import referenceTokenListEvaluator from './evaluators/reference-token-list.js';

const grammar = new Grammar();

const parse = (
  jsonPointer,
  { evaluator = referenceTokenListEvaluator, tokenDecoder = null } = {},
) => {
  const parser = new Parser();

  parser.ast = new AST();
  parser.ast.callbacks['json-pointer'] = jsonPointerCallback;
  parser.ast.callbacks['reference-token'] = referenceTokenCallback;

  const { ast } = parser;
  const result = parser.parse(grammar, 'json-pointer', jsonPointer);

  if (!result.success) {
    return { result, ast, computed: null };
  }

  const computed = evaluator(ast, { result, tokenDecoder });

  return { result, ast, computed };
};

export default parse;
