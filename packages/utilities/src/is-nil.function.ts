import type { Nullable } from './nullable.type';

/**
 * @packageDocumentation
 * @module Common
 */
export function isNil<T>(entity: Nullable<T>): entity is null | undefined {
  return entity === undefined || entity === null;
}
