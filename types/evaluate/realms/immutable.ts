import type { EvaluationRealm } from '../../index';

declare class ImmutableEvaluationRealm extends EvaluationRealm {
  public readonly name: 'immutable';

  public override isArray(node: unknown): boolean;
  public override isObject(node: unknown): boolean;
  public override sizeOf(node: unknown): number;
  public override has(node: unknown, referenceToken: string): boolean;
  public override evaluate<T = unknown>(node: unknown, referenceToken: string): T;
}

export default ImmutableEvaluationRealm;
