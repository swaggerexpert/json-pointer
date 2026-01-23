// Custom loader hooks to remap @swaggerexpert/json-pointer to source during tests
export async function resolve(specifier, context, nextResolve) {
  if (specifier === '@swaggerexpert/json-pointer') {
    return {
      shortCircuit: true,
      url: new URL('../src/index.js', import.meta.url).href,
    };
  }
  return nextResolve(specifier, context);
}
