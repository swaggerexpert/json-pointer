import { Parser } from 'apg-lite';

import Grammar from '../grammar.js';

const grammar = new Grammar();
const parser = new Parser();

const testArrayLocation = (referenceToken) => {
  try {
    return parser.parse(grammar, 'array-location', referenceToken).success;
  } catch {
    return false;
  }
};

export default testArrayLocation;
