import CSTTranslator from './CSTTranslator.js';
import unescape from '../../unescape.js';

class ASTTranslator extends CSTTranslator {
  getTree() {
    const { root } = super.getTree();

    return root.children
      .filter(({ type }) => type === 'reference-token')
      .map(({ text }) => unescape(text));
  }
}

export default ASTTranslator;
