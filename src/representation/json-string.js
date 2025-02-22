const to = (jsonPointer) => {
  return JSON.stringify(jsonPointer);
};

const from = (jsonString) => {
  try {
    return JSON.parse(jsonString);
  } catch {
    return jsonString;
  }
};
