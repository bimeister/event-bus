import type { WrappedEvent } from 'packages/internal';
import type { Observable, OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';

export const mapToEventPayload =
  <T>(): OperatorFunction<WrappedEvent<T>, T> =>
  (source: Observable<WrappedEvent<T>>): Observable<T> =>
    source.pipe(map((wrappedEvent: WrappedEvent<T>) => wrappedEvent.payload));
