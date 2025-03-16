import EvaluationRealm from './realm.js';

class JSONEvaluationRealm extends EvaluationRealm {
  name = 'json';

  isArray(node) {
    return Array.isArray(node);
  }

  isObject(node) {
    return typeof node === 'object' && node !== null && !this.isArray(node);
  }

  sizeOf(node) {
    if (this.isArray(node)) {
      return node.length;
    }
    if (this.isObject(node)) {
      return Object.keys(node).length;
    }
    return 0;
  }

  has(node, referenceToken) {
    if (this.isArray(node)) {
      return Number(referenceToken) < this.sizeOf(node);
    }
    if (this.isObject(node)) {
      return Object.prototype.hasOwnProperty.call(node, referenceToken);
    }
    return false;
  }

  evaluate(node, referenceToken) {
    if (this.isArray(node)) {
      return node[Number(referenceToken)];
    }
    return node[referenceToken];
  }
}

export default JSONEvaluationRealm;
