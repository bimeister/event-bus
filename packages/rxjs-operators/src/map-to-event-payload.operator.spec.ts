import { from } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { VOID, WrappedEvent } from './../../../packages/internal';
import { mapToEventPayload } from './map-to-event-payload.operator';

describe('map-to-event-payload.operator.ts', () => {
  let inputPayloads: number[];
  let inputEvents: WrappedEvent[];

  beforeAll(() => {
    inputPayloads = new Array(100).fill(VOID).map((_input: void, index: number) => index);

    inputEvents = inputPayloads
      .map((payload: number) => new WrappedEvent(payload))
      .reduce((linkedEvents: WrappedEvent[], currentEvent: WrappedEvent, currentIndex: number) => {
        if (currentIndex !== 0) {
          const parent: WrappedEvent = linkedEvents[currentIndex - 1];
          currentEvent.setParent(parent);
        }
        linkedEvents.push(currentEvent);
        return linkedEvents;
      }, []);
  });

  it('should take data from payload', (doneCallback: jest.DoneCallback) => {
    from(inputEvents)
      .pipe(mapToEventPayload(), toArray())
      .subscribe((response: unknown[]) => {
        expect(response).toEqual(inputPayloads);
        doneCallback();
      });
  });
});
