const escape = (referenceToken, { encoder = null } = {}) => {
  const encodedReferenceToken = referenceToken.replace(/~/g, '~0').replace(/\//g, '~1');
  return typeof encoder === 'function' ? encoder(encodedReferenceToken) : encodedReferenceToken;
};

export default escape;
