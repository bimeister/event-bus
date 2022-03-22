import type { WrappedEvent } from '@bimeister/event-bus.internal';
import type { Observable, OperatorFunction } from 'rxjs';
import { filter } from 'rxjs/operators';

/**
 * @description
 * Passes only events that are relative to initial event.
 * Initial event is included.
 * All children from all generations are included.
 */
export function filterRelativeTo(initialEvent: WrappedEvent): OperatorFunction<WrappedEvent, WrappedEvent> {
  return (source: Observable<WrappedEvent>): Observable<WrappedEvent> =>
    source.pipe(
      filter((wrappedEvent: WrappedEvent) => wrappedEvent === initialEvent || wrappedEvent.isDescendantOf(initialEvent))
    );
}
