import { getShuffledArray } from '@bimeister/utilities';
import type { Listener } from '../internal/classes/listener.class';
import { WrappedEvent } from '../internal/classes/wrapped-event.class';
import { VOID } from '../internal/constants/void.const';
import { PayloadType } from '../internal/enums/payload-type.enum';
import { EventBus } from './event-bus.class';

describe('event-bus.class.ts', () => {
  let eventBus: EventBus;
  let shuffledArray: number[];

  beforeAll(() => {
    eventBus = new EventBus();
    shuffledArray = getShuffledArray(new Array(1000).fill(VOID).map((_item: void, index: number) => index));
  });

  it('should handle dispatched events in valid sequence', (doneCallback: jest.DoneCallback) => {
    const input: number[] = shuffledArray;
    const output: unknown[] = [];

    eventBus.listen((event: unknown, listener: Listener) => {
      output.push(event);

      if (output.length !== input.length) {
        return;
      }

      expect(output).toEqual(input);

      listener.stop();
      doneCallback();
    });
    input.forEach((inputItem: number) => eventBus.dispatch(inputItem));
  }, 10_000);

  it('should handle data with EventWrapper if configured', (doneCallback: jest.DoneCallback) => {
    const payload: number[] = shuffledArray;

    eventBus.listen(
      (wrappedEvent: WrappedEvent<unknown>, listener: Listener) => {
        expect(wrappedEvent).toBeInstanceOf(WrappedEvent);
        expect(wrappedEvent.payload).toEqual(payload);

        listener.stop();
        doneCallback();
      },
      {
        payloadType: PayloadType.Wrapped
      }
    );

    eventBus.dispatch(payload);
  }, 10_000);

  it('should handle data without EventWrapper if configured', (doneCallback: jest.DoneCallback) => {
    const payload: number[] = shuffledArray;

    eventBus.listen(
      (unWrappedEvent: unknown, listener: Listener) => {
        expect(unWrappedEvent).toEqual(payload);

        listener.stop();
        doneCallback();
      },
      {
        payloadType: PayloadType.Native
      }
    );

    eventBus.dispatch(payload);
  }, 10_000);
});
