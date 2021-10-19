import { getUuid } from '@bimeister/utilities';
import type { Uuid } from '../types/uuid.type';

/**
 * @internal
 */
export class WrappedEvent<T = unknown> {
  public readonly id: Uuid = getUuid();

  private readonly pedigree: Uuid[] = [];

  constructor(public readonly payload: T) {}

  public setDescendantOf(ancestor: WrappedEvent<T>): void {
    this.pedigree.push(ancestor.id);
  }

  public isDescendantOf(ancestor: WrappedEvent<T>): boolean {
    return this.pedigree.includes(ancestor.id);
  }
}
