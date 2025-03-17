import type { EvaluationRealm } from '../../index';

declare class MapSetEvaluationRealm extends EvaluationRealm {
  public readonly name: 'map-set';

  public override isArray(node: unknown): node is Set<unknown>;
  public override isObject(node: unknown): node is Map<unknown, unknown>;
  public override sizeOf(node: unknown): number;
  public override has(node: unknown, referenceToken: string): boolean;
  public override evaluate<T = unknown>(node: unknown, referenceToken: string): T;
}

export default MapSetEvaluationRealm;
