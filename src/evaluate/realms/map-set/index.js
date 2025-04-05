import EvaluationRealm from '../EvaluationRealm.js';

class MapSetEvaluationRealm extends EvaluationRealm {
  name = 'map-set';

  isArray(node) {
    return node instanceof Set || Object.prototype.toString.call(node) === '[object Set]';
  }

  isObject(node) {
    return node instanceof Map || Object.prototype.toString.call(node) === '[object Map]';
  }

  sizeOf(node) {
    if (this.isArray(node) || this.isObject(node)) {
      return node.size;
    }
    return 0;
  }

  has(node, referenceToken) {
    if (this.isArray(node)) {
      return Number(referenceToken) < this.sizeOf(node);
    }
    if (this.isObject(node)) {
      return node.has(referenceToken);
    }
    return false;
  }

  evaluate(node, referenceToken) {
    if (this.isArray(node)) {
      return [...node][Number(referenceToken)];
    }
    return node.get(referenceToken);
  }
}

export default MapSetEvaluationRealm;
