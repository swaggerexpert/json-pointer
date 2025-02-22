export const to = (jsonPointer) => {
  return `#${encodeURI(jsonPointer)}`;
};

export const from = (fragment) => {
  const rfc3986Fragment = fragment.startsWith('#') ? fragment.slice(1) : fragment;

  try {
    return decodeURI(rfc3986Fragment);
  } catch {
    return fragment;
  }
};
