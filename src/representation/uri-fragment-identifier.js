export const to = (jsonPointer) => {
  return encodeURI(jsonPointer);
};

export const from = (fragment) => {
  try {
    return decodeURI(fragment);
  } catch {
    return fragment;
  }
};
