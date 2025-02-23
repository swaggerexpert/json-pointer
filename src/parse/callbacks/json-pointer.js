import { identifiers, utilities } from 'apg-lite';

import JSONPointerParseError from '../../errors/JSONPointerParseError.js';

const jsonPointer = (state, chars, phraseIndex, phraseLength, data) => {
  if (state === identifiers.SEM_PRE) {
    if (Array.isArray(data) === false) {
      throw new JSONPointerParseError("parser's user data must be an array");
    }
    data.push(['json-pointer', utilities.charsToString(chars, phraseIndex, phraseLength)]);
  }

  return identifiers.SEM_OK;
};

export default jsonPointer;
