import EvaluationRealm from './EvaluationRealm.js';

class CompositeEvaluationRealm extends EvaluationRealm {
  name = 'composite';

  realms = [];

  constructor(realms) {
    super();
    this.realms = realms;
  }

  isArray(node) {
    return this.#findRealm(node)?.isArray(node) ?? false;
  }

  isObject(node) {
    return this.#findRealm(node)?.isObject(node) ?? false;
  }

  sizeOf(node) {
    return this.#findRealm(node)?.sizeOf(node) ?? 0;
  }

  has(node, referenceToken) {
    return this.#findRealm(node)?.has(node, referenceToken) ?? false;
  }

  evaluate(node, referenceToken) {
    return this.#findRealm(node)?.evaluate(node, referenceToken);
  }

  #findRealm(node) {
    for (const realm of this.realms) {
      if (realm.isArray(node) || realm.isObject(node)) {
        return realm;
      }
    }
    return undefined;
  }
}

const compose = (...realms) => new CompositeEvaluationRealm(realms);

export default compose;
