import type { WrappedEvent } from '@bimeister/event-bus.internal';
import { VOID } from '@bimeister/utilities';
import { from } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { mapToWrappedEvent } from './map-to-wrapped-event.operator';

describe('map-to-wrapped-event.operator.ts', () => {
  let inputPayloads: number[];

  beforeAll(() => {
    inputPayloads = new Array(100).fill(VOID).map((_input: void, index: number) => index);
  });

  it('should take data from payload', (doneCallback: jest.DoneCallback) => {
    from(inputPayloads)
      .pipe(mapToWrappedEvent(), toArray())
      .subscribe((response: WrappedEvent[]) => {
        expect(response.map(({ payload }: WrappedEvent) => payload)).toEqual(inputPayloads);
        doneCallback();
      });
  });
});
