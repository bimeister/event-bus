import type { WrappedEvent } from '@bimeister/event-bus.internal';
import type { Observable, OperatorFunction } from 'rxjs';
import { filter } from 'rxjs/operators';

/**
 * @description
 * Passes only events that are descendant to initial event.
 * All children from all generations are included.
 * Initial event is excluded.
 */
export function filterDescendantsOf<T>(
  initialEvent: WrappedEvent<T>
): OperatorFunction<WrappedEvent<T>, WrappedEvent<T>> {
  return (source: Observable<WrappedEvent<T>>): Observable<WrappedEvent<T>> =>
    source.pipe(filter((wrappedEvent: WrappedEvent<T>) => wrappedEvent.isDescendantOf(initialEvent)));
}
