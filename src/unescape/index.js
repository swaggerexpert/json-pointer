const unescape = (referenceToken, { decoder = null } = {}) => {
  const unescapedReferenceToken = referenceToken.replace(/~1/g, '/').replace(/~0/g, '~');
  return typeof decoder === 'function' ? decoder(unescapedReferenceToken) : unescapedReferenceToken;
};

export default unescape;
