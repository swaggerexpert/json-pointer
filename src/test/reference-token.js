import { Parser } from 'apg-lite';

import Grammar from '../grammar.js';

const grammar = new Grammar();
const parser = new Parser();

const testReferenceToken = (referenceToken) => {
  try {
    return parser.parse(grammar, 'reference-token', referenceToken).success;
  } catch {
    return false;
  }
};

export default testReferenceToken;
