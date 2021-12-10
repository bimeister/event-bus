import type { WrappedEvent } from 'packages/internal';
import type { Observable, OperatorFunction } from 'rxjs';
import { filter } from 'rxjs/operators';

export const filterRelativeTo =
  <T>(initialEvent: WrappedEvent<T>): OperatorFunction<WrappedEvent<T>, WrappedEvent<T>> =>
  (source: Observable<WrappedEvent<T>>): Observable<WrappedEvent<T>> =>
    source.pipe(filter((wrappedEvent: WrappedEvent<T>) => wrappedEvent.isDescendantOf(initialEvent)));
