import { isObjectElement, isArrayElement } from '@swagger-api/apidom-core';

import EvaluationRealm from '../EvaluationRealm.js';
import JSONPointerKeyError from '../../errors/JSONPointerKeyError.js';

class ApiDOMEvaluationRealm extends EvaluationRealm {
  name = 'apidom';

  isArray(node) {
    return isArrayElement(node);
  }

  isObject(node) {
    return isObjectElement(node);
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
        throw new JSONPointerKeyError(`Object keys must be unique for '${referenceToken}'`, {
          currentValue: node,
          referenceToken,
        });
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

export default ApiDOMEvaluationRealm;
