import { Trace as BaseTrace, identifiers } from 'apg-lite';

import Expectations from './Expectations.js';

const terminalOperators = [identifiers.TLS, identifiers.TBS, identifiers.TRG];

const failures = new WeakMap();

/**
 * Printable ASCII characters are shown as they are, except for `"` and `\`, which would be
 * ambiguous in quoted expectations (see Expectations.toString). Other characters are shown
 * as `\xHH` (up to 0xFF) or `\u{H...}`.
 */
const describeCharacter = (code) => {
  if (code >= 0x21 && code <= 0x7e && code !== 0x22 && code !== 0x5c) {
    return String.fromCharCode(code);
  }
  if (code <= 0xff) return `\\x${code.toString(16).toUpperCase().padStart(2, '0')}`;
  return `\\u{${code.toString(16).toUpperCase()}}`;
};

const describeTerminal = (operator) => {
  if (operator.type === identifiers.TRG) {
    return `${describeCharacter(operator.min)}-${describeCharacter(operator.max)}`;
  }

  return operator.string.map(describeCharacter).join('');
};

class Trace extends BaseTrace {
  constructor() {
    super();

    const state = { terminals: [], furthestMatchEnd: 0 };
    const { up } = this;

    failures.set(this, state);

    /**
     * Records terminals (literal strings, binary strings, ranges) that failed to match
     * with their offsets, and the furthest offset any operator matched up to.
     */
    this.up = (operator, operatorState, offset, phraseLength) => {
      if (operatorState === identifiers.NOMATCH && terminalOperators.includes(operator.type)) {
        state.terminals.push({ operator, offset });
      } else if (operatorState === identifiers.MATCH) {
        state.furthestMatchEnd = Math.max(state.furthestMatchEnd, offset + phraseLength);
      }
      up(operator, operatorState, offset, phraseLength);
    };
  }

  /**
   * Infers what the parser expected at the furthest offset it reached:
   * terminals that failed to match at that offset.
   *
   * Unlike grammars where repetitions stop at the end of the source without trying their children,
   * every failing JSON Pointer ends with a failed terminal at the furthest offset
   * ("/" at the start, or "0" / "1" after "~"), so re-parsing with a sentinel is not needed.
   *
   * Terminals failing before the furthest matched offset did not stop the parser
   * (e.g. alternatives tried during a successful parse), so nothing is expected then.
   */
  inferExpectations() {
    const { terminals, furthestMatchEnd } = failures.get(this);
    const furthestOffset = terminals.reduce((max, { offset }) => Math.max(max, offset), -1);

    if (furthestOffset < furthestMatchEnd) return new Expectations();

    const expectations = new Set(
      terminals
        .filter(({ offset }) => offset === furthestOffset)
        .map(({ operator }) => describeTerminal(operator)),
    );

    return Expectations.from(expectations);
  }
}

export default Trace;
