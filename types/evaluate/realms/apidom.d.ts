import type { EvaluationRealm } from '../../index';

declare class ApiDOMEvaluationRealm extends EvaluationRealm {
  public readonly name: 'apidom';

  public isArray(node: unknown): boolean;
  public isObject(node: unknown): boolean;
  public sizeOf(node: unknown): number;
  public has(node: unknown, referenceToken: string): boolean;
  public evaluate<T = unknown>(node: unknown, referenceToken: string): T;
}

export default ApiDOMEvaluationRealm;
