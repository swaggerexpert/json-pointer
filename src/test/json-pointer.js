import parse from '../parse/index.js';

const testJSONPointer = (jsonPointer) => {
  if (typeof jsonPointer !== 'string') return false;

  try {
    const parseResult = parse(jsonPointer);
    return parseResult.result.success;
  } catch {
    return false;
  }
};

export default testJSONPointer;
