import { VOID, WrappedEvent } from 'packages/internal';
import { from } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { mapToEventPayload } from './../operators/map-to-event-payload.operator';
import { filterRelativeTo } from './filter-relative-to.operator';

describe('filter-relative-to.operator.ts', () => {
  let inputPayloads: number[];
  let inputEvents: WrappedEvent[];
  let trashedInputEvents: WrappedEvent[];

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

    trashedInputEvents = inputEvents.map((inputEvent: WrappedEvent) => [inputEvent, new WrappedEvent(NaN)]).flat(1);
  }, 30_000);

  it('should pass only data relative to event', (doneCallback: jest.DoneCallback) => {
    const rootEvent: WrappedEvent = inputEvents[0];
    from(trashedInputEvents)
      .pipe(filterRelativeTo(rootEvent), mapToEventPayload(), toArray())
      .subscribe((response: unknown[]) => {
        expect(response).toEqual(inputPayloads);
        doneCallback();
      });
  });

  it('should not pass anything if there is no relative events', (doneCallback: jest.DoneCallback) => {
    const rootEvent: WrappedEvent = new WrappedEvent(0x000000);
    from(trashedInputEvents)
      .pipe(filterRelativeTo(rootEvent), mapToEventPayload(), toArray())
      .subscribe((response: unknown[]) => {
        expect(response).toEqual([]);
        doneCallback();
      });
  });

  it('should pass initial event too', (doneCallback: jest.DoneCallback) => {
    const rootEvent: WrappedEvent = new WrappedEvent(1);
    from([rootEvent])
      .pipe(filterRelativeTo(rootEvent))
      .subscribe((response: unknown) => {
        expect(response).toBe(rootEvent);
        doneCallback();
      });
  });
});
