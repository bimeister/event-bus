import type { WrappedEvent } from '@bimeister/event-bus.internal';
import type { Observable, OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';

export function mapToEventPayload<T>(): OperatorFunction<WrappedEvent<T>, T> {
  return (source: Observable<WrappedEvent<T>>): Observable<T> =>
    source.pipe(map((wrappedEvent: WrappedEvent<T>) => wrappedEvent.payload));
}
