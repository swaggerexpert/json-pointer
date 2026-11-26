/**
 * Smoke test of the built artifacts, as consumers load them: CommonJS, ES module, UMD (require and browser global).
 * Resolves the package by its name, so it runs both inside this repository (self-reference)
 * and in a project the packed tarball is installed into.
 * Written in syntax supported by the oldest supported Node.js version (see engines in package.json).
 */
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const vm = require('vm');

const name = '@swaggerexpert/json-pointer';
const root = path.dirname(require.resolve(`${name}/package.json`));

// values created in a different realm (vm context) have different prototypes, so compare their JSON
const assertJSONEqual = (actual, expected) =>
  assert.strictEqual(JSON.stringify(actual), JSON.stringify(expected));

const errorNames = [
  'JSONPointerError',
  'JSONPointerParseError',
  'JSONPointerCompileError',
  'JSONPointerEvaluateError',
  'JSONPointerTypeError',
  'JSONPointerKeyError',
  'JSONPointerIndexError',
];

const check = (label, JSONPointer) => {
  assertJSONEqual(JSONPointer.parse('/a~1b/c~0d').tree, ['a/b', 'c~d']);
  assert.strictEqual(JSONPointer.testJSONPointer('/a'), true);
  assert.strictEqual(JSONPointer.testJSONPointer('a'), false);
  assert.strictEqual(JSONPointer.compile(['a/b', 'c~d']), '/a~1b/c~0d');
  assert.strictEqual(JSONPointer.evaluate({ a: [1, 2] }, '/a/1'), 2);

  errorNames.forEach((errorName) => {
    assert.strictEqual(JSONPointer[errorName].name, errorName);
    assert.strictEqual(new JSONPointer[errorName]('message').name, errorName);
  });

  assert.throws(
    () => JSONPointer.evaluate({}, '/a'),
    (error) => error.name === 'JSONPointerKeyError',
  );
  assert.throws(
    () => JSONPointer.evaluate({}, '/a~'),
    (error) => error.name === 'JSONPointerParseError',
  );

  assert.strictEqual(typeof new JSONPointer.Grammar().toString(), 'string');

  console.log(`ok ${label}`);
};

const checkRealms = (label, JSONRealm, MapSetRealm) => {
  assert.strictEqual(new JSONRealm().name, 'json');
  assert.strictEqual(new MapSetRealm().name, 'map-set');

  console.log(`ok ${label}`);
};

const main = async () => {
  check('CommonJS', require(name));
  check('ES module', await import(name));

  checkRealms(
    'CommonJS realms',
    require(`${name}/evaluate/realms/json`).default,
    require(`${name}/evaluate/realms/map-set`).default,
  );
  checkRealms(
    'ES module realms',
    (await import(`${name}/evaluate/realms/json`)).default,
    (await import(`${name}/evaluate/realms/map-set`)).default,
  );

  // UMD bundles target browsers (browser-production in .browserslistrc) and use private class
  // methods, so Node.js >= 14.6 can require them
  const [major, minor] = process.versions.node.split('.').map(Number);
  if (major < 14 || (major === 14 && minor < 6)) {
    console.log('skip UMD bundles on Node.js < 14.6');
  } else {
    // dist/ is not exported, so the bundles are required as consumers vendoring them do:
    // copied into a CommonJS context (the package itself is "type": "module")
    const vendorDir = fs.mkdtempSync(path.join(os.tmpdir(), 'json-pointer-'));

    ['json-pointer.browser.js', 'json-pointer.browser.min.js'].forEach((file) => {
      const bundlePath = path.join(root, 'dist', file);
      const vendoredPath = path.join(vendorDir, file.replace(/\.js$/, '.cjs'));

      fs.copyFileSync(bundlePath, vendoredPath);
      check(`UMD require ${file}`, require(vendoredPath));

      const context = {};
      context.self = context;
      vm.createContext(context);
      vm.runInContext(fs.readFileSync(bundlePath, 'utf8'), context);
      check(`UMD browser global ${file}`, context.JSONPointer);
    });
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
