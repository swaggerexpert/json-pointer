import type { EvaluationRealm, JSONArray, JSONObject } from '../../index';

declare class JSONEvaluationRealm extends EvaluationRealm {
  public readonly name: 'json';

  public isArray(node: unknown): node is JSONArray;
  public isObject(node: unknown): node is JSONObject;
  public sizeOf(node: unknown): number;
  public has(node: unknown, referenceToken: string): boolean;
  public evaluate<T = unknown>(node: unknown, referenceToken: string): T;
}

export default JSONEvaluationRealm;
