import type { WrappedEvent } from '@bimeister/event-bus.internal';
import type { Observable, OperatorFunction } from 'rxjs';
import { filter } from 'rxjs/operators';

export function filterRelativeTo<T>(initialEvent: WrappedEvent<T>): OperatorFunction<WrappedEvent<T>, WrappedEvent<T>> {
  return (source: Observable<WrappedEvent<T>>): Observable<WrappedEvent<T>> =>
    source.pipe(
      filter((wrappedEvent: WrappedEvent<T>) => wrappedEvent === initialEvent || wrappedEvent.isChildOf(initialEvent))
    );
}
