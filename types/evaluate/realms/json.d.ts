import type { EvaluationRealm, JSONArray, JSONObject } from '../../index';

declare class JSONEvaluationRealm extends EvaluationRealm {
  public readonly name: 'json';

  public override isArray(node: unknown): node is JSONArray;
  public override isObject(node: unknown): node is JSONObject;
  public override sizeOf(node: unknown): number;
  public override has(node: unknown, referenceToken: string): boolean;
  public override evaluate<T = unknown>(node: unknown, referenceToken: string): T;
}

export default JSONEvaluationRealm;
