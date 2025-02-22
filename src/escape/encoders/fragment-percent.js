export const fragmentPercentEncoder = (referenceToken) => {
  const url = new URL(`#${referenceToken}`, 'https://swaggerexpert.com');
  return url.hash.slice(1);
};

export default fragmentPercentEncoder;
