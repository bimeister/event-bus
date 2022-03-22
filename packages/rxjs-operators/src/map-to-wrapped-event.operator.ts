import { WrappedEvent } from '@bimeister/event-bus.internal';
import type { Observable, OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';

export function mapToWrappedEvent<T>(): OperatorFunction<T, WrappedEvent<T>> {
  return (source: Observable<T>): Observable<WrappedEvent<T>> =>
    source.pipe(map((payload: T) => new WrappedEvent<T>(payload)));
}
