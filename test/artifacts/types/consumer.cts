// CommonJS consumer: resolved through the "require" export conditions
import { parse, evaluate, compile, JSONPointerError } from '@swaggerexpert/json-pointer';
import JSONEvaluationRealm = require('@swaggerexpert/json-pointer/evaluate/realms/json');
import MapSetEvaluationRealm = require('@swaggerexpert/json-pointer/evaluate/realms/map-set');

const { tree } = parse('/a/b');
const pointer: string = compile(tree ?? []);
const value = evaluate<number>({ a: { b: 1 } }, pointer, { realm: new JSONEvaluationRealm.default() });
const realm = new MapSetEvaluationRealm.default();
const error: Error = new JSONPointerError('message');

export { value, realm, error };
