import { getUuid } from '@bimeister/utilities';
import type { Uuid } from '../types/uuid.type';
import { Lineage } from './lineage.class';

/**
 * @internal
 */
export class WrappedEvent<T = unknown> {
  public readonly id: Uuid = getUuid();

  public readonly lineage: Lineage = new Lineage();

  constructor(public readonly payload: T) {}

  public setParent(parentEvent: WrappedEvent): void {
    this.lineage.setParent(parentEvent.lineage);
  }

  public setChild(childEvent: WrappedEvent): void {
    this.lineage.setChild(childEvent.lineage);
  }

  public isChildOf(targetEvent: WrappedEvent): boolean {
    return targetEvent.lineage.getAllChildren().includes(this.lineage);
  }

  public createChild<K>(payload: K): WrappedEvent<K> {
    const child: WrappedEvent<K> = new WrappedEvent(payload);
    this.setChild(child);
    return child;
  }
}
