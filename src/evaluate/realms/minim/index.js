import { ObjectElement, ArrayElement } from 'minim';

import EvaluationRealm from '../EvaluationRealm.js';
import JSONPointerKeyError from '../../../errors/JSONPointerKeyError.js';

class MinimEvaluationRealm extends EvaluationRealm {
  name = 'minim';

  isArray(node) {
    return node instanceof ArrayElement && !(node instanceof ObjectElement);
  }

  isObject(node) {
    return node instanceof ObjectElement;
  }

  sizeOf(node) {
    if (this.isArray(node) || this.isObject(node)) {
      return node.length;
    }
    return 0;
  }

  has(node, referenceToken) {
    if (this.isArray(node)) {
      return Number(referenceToken) < this.sizeOf(node);
    }
    if (this.isObject(node)) {
      const keys = node.keys();
      const uniqueKeys = new Set(keys);

      if (keys.length !== uniqueKeys.size) {
        throw new JSONPointerKeyError(
          `Object key "${referenceToken}" is not unique — JSON Pointer requires unique member names`,
          {
            currentValue: node,
            referenceToken,
          },
        );
      }

      return node.hasKey(referenceToken);
    }
    return false;
  }

  evaluate(node, referenceToken) {
    if (this.isArray(node)) {
      return node.get(Number(referenceToken));
    }
    return node.get(referenceToken);
  }
}

export default MinimEvaluationRealm;
