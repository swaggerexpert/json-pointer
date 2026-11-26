// ES module consumer: resolved through the "import" export conditions
import { parse, evaluate, compile, JSONPointerError } from '@swaggerexpert/json-pointer';
import JSONEvaluationRealm from '@swaggerexpert/json-pointer/evaluate/realms/json';
import MapSetEvaluationRealm from '@swaggerexpert/json-pointer/evaluate/realms/map-set';

const { tree } = parse('/a/b');
const pointer: string = compile(tree ?? []);
const value = evaluate<number>({ a: { b: 1 } }, pointer, { realm: new JSONEvaluationRealm() });
const realm = new MapSetEvaluationRealm();
const error: Error = new JSONPointerError('message');

export { value, realm, error };
