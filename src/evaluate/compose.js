import EvaluationRealm from './EvaluationRealm.js';
import JSONPointerEvaluateError from '../errors/JSONPointerEvaluateError.js';

class CompositeEvaluationRealm extends EvaluationRealm {
  name = 'composite';

  realms = [];

  constructor(realms) {
    super();
    this.realms = realms;
  }

  isArray(node) {
    return this.#findRealm(node).isArray(node);
  }

  isObject(node) {
    return this.#findRealm(node).isObject(node);
  }

  sizeOf(node) {
    return this.#findRealm(node).sizeOf(node);
  }

  has(node, referenceToken) {
    return this.#findRealm(node).has(node, referenceToken);
  }

  evaluate(node, referenceToken) {
    return this.#findRealm(node).evaluate(node, referenceToken);
  }

  #findRealm(node) {
    for (const realm of this.realms) {
      if (realm.isArray(node) || realm.isObject(node)) {
        return realm;
      }
    }
    throw new JSONPointerEvaluateError('No suitable evaluation realm found for value', {
      currentValue: node,
    });
  }
}

const compose = (...realms) => new CompositeEvaluationRealm(realms);

export default compose;
