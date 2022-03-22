import type { WrappedEvent } from '@bimeister/event-bus.internal';
import type { Observable, OperatorFunction } from 'rxjs';
import { filter } from 'rxjs/operators';

/**
 * @description
 * Passes only events that are direct children to initial event.
 * Initial event is excluded.
 */
export function filterDirectChildrenOf<T>(
  initialEvent: WrappedEvent<T>
): OperatorFunction<WrappedEvent<T>, WrappedEvent<T>> {
  return (source: Observable<WrappedEvent<T>>): Observable<WrappedEvent<T>> =>
    source.pipe(filter((wrappedEvent: WrappedEvent<T>) => wrappedEvent.isChildOf(initialEvent)));
}
