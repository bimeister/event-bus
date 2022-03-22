import { WrappedEvent } from '@bimeister/event-bus.internal';
import { VOID } from '@bimeister/utilities';
import { from } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { filterDescendantsOf } from './filter-descendants-of.operator';
import { mapToEventPayload } from './map-to-event-payload.operator';

describe('filter-descendants-of.operator.ts', () => {
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
  });

  it('should pass only data that is descendant to event', (doneCallback: jest.DoneCallback) => {
    const rootEvent: WrappedEvent = inputEvents[0];
    from(trashedInputEvents)
      .pipe(filterDescendantsOf(rootEvent), mapToEventPayload(), toArray())
      .subscribe((response: unknown[]) => {
        expect(response).toEqual(inputPayloads.filter((_: unknown, index: number) => index !== 0));
        expect(response).toHaveLength(inputEvents.length - 1);
        doneCallback();
      });
  });

  it('should not pass anything if there is no relative events', (doneCallback: jest.DoneCallback) => {
    const rootEvent: WrappedEvent = new WrappedEvent(0x000000);
    from(trashedInputEvents)
      .pipe(filterDescendantsOf(rootEvent), mapToEventPayload(), toArray())
      .subscribe((response: unknown[]) => {
        expect(response).toEqual([]);
        doneCallback();
      });
  });

  it('should not pass initial event', (doneCallback: jest.DoneCallback) => {
    const rootEvent: WrappedEvent = inputEvents[0];
    from(inputEvents)
      .pipe(filterDescendantsOf(rootEvent), mapToEventPayload(), toArray())
      .subscribe((response: unknown) => {
        expect(response).toEqual(inputPayloads.filter((_: unknown, index: number) => index !== 0));
        expect(response).toHaveLength(inputEvents.length - 1);
        doneCallback();
      });
  });
});
