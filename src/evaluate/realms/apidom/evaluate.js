import baseEvaluate from '../../../evaluate/index.js';
import ApiDOMEvaluationRealm from './realm.js';

const evaluate = (value, jsonPointer, options = {}) => {
  return baseEvaluate(value, jsonPointer, { ...options, realm: new ApiDOMEvaluationRealm() });
};

export default evaluate;
