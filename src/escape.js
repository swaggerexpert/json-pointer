const escape = (referenceToken) => {
  return referenceToken.replace(/~/g, '~0').replace(/\//g, '~1');
};

export default escape;
