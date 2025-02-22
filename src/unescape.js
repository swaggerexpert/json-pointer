const unescape = (referenceToken) => {
  return referenceToken.replace(/~1/g, '/').replace(/~0/g, '~');
};

export default unescape;
