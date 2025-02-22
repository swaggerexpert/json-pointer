import { Parser } from 'apg-lite';

import Grammar from '../grammar.js';

const grammar = new Grammar();
const parser = new Parser();

const testArrayIndex = (referenceToken) => {
  try {
    return parser.parse(grammar, 'array-index', referenceToken).success;
  } catch {
    return false;
  }
};

export default testArrayIndex;
