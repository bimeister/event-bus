import { Observable, OperatorFunction, Subject } from 'rxjs';
import { buffer, filter, map, take, tap } from 'rxjs/operators';
import { LeadingMarkerEventMock } from '../../../mocks/events/leading-marker.event.mock';
import { TrailingMarkerEventMock } from '../../../mocks/events/trailing-marker.event.mock';
import { LeadingMarkerErrorEventMock } from './../../../mocks/events/leading-marker-error.event.mock';
import { TrailingMarkerErrorEventMock } from './../../../mocks/events/trailing-marker-error.event.mock';

export const mapToEventsSlice = <T>(): OperatorFunction<T, T[]> => (source: Observable<T>): Observable<T[]> => {
  type Marker = 'leading' | 'trailing' | null;

  let isLeadingMarkerTriggered: boolean = false;
  let isTrailingMarkerTriggered: boolean = false;

  const onSliceReady$: Subject<void> = new Subject<void>();

  return source.pipe(
    map((input: T): [Marker, T] => {
      if (input instanceof LeadingMarkerEventMock || input instanceof LeadingMarkerErrorEventMock) {
        return ['leading', input];
      }

      if (input instanceof TrailingMarkerEventMock || input instanceof TrailingMarkerErrorEventMock) {
        return ['trailing', input];
      }

      return [null, input];
    }),
    tap(([marker, _input]: [Marker, T]) => {
      if (marker === 'leading') {
        isLeadingMarkerTriggered = true;
      }

      if (marker === 'trailing') {
        isTrailingMarkerTriggered = true;
      }

      if (isLeadingMarkerTriggered && isTrailingMarkerTriggered) {
        onSliceReady$.next();
      }
    }),
    filter(([marker, _input]: [Marker, T]) => {
      return marker === null && isLeadingMarkerTriggered && !isTrailingMarkerTriggered;
    }),
    map(([_marker, input]: [Marker, T]) => input),
    buffer(onSliceReady$),
    take(1)
  );
};
