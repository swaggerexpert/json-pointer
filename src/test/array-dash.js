import { Parser } from 'apg-lite';

import Grammar from '../grammar.js';

const grammar = new Grammar();
const parser = new Parser();

const testArrayDash = (referenceToken) => {
  try {
    return parser.parse(grammar, 'array-dash', referenceToken).success;
  } catch {
    return false;
  }
};

export default testArrayDash;
