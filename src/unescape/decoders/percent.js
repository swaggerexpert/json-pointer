const percentDecoder = (referenceToken) => {
  try {
    return decodeURIComponent(referenceToken);
  } catch {
    return referenceToken;
  }
};

export default percentDecoder;
