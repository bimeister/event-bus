import { getShuffledArray } from '@bimeister/utilities/common/get-shuffled-array.function';
import { performance, PerformanceEntry, PerformanceObserver } from 'perf_hooks';
import { Listener, PayloadType, VOID, WrappedEvent } from './../../../packages/internal';
import { MeasureObserver } from './../../../packages/testing';
import { EventBus } from './event-bus.class';

function getSequence(size: number): number[] {
  return new Array(size).fill(VOID).map((_item: void, index: number) => index);
}

describe('event-bus.class.ts', () => {
  let eventBus: EventBus;

  let shuffledArray1K: number[];
  let shuffledArray1M: number[];

  beforeAll(() => {
    eventBus = new EventBus();
    shuffledArray1K = getShuffledArray(getSequence(1_000));
    shuffledArray1M = getShuffledArray(getSequence(1_000_000));
  });

  beforeEach(() => {
    performance.clearMarks();
  });

  it('should handle dispatched events (PayloadType.Native) in valid sequence', (doneCallback: jest.DoneCallback) => {
    const input: number[] = shuffledArray1K;
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
  });

  it('should handle dispatched events (PayloadType.Wrapped) in valid sequence', (doneCallback: jest.DoneCallback) => {
    const input: number[] = shuffledArray1K;
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
    input
      .map((inputItem: number) => new WrappedEvent(inputItem))
      .forEach((wrappedInputItem: WrappedEvent<number>) =>
        eventBus.dispatch(wrappedInputItem, {
          payloadType: PayloadType.Wrapped
        })
      );
  });

  it('should handle wrapped data (PayloadType.Wrapped)', (doneCallback: jest.DoneCallback) => {
    const payload: number[] = shuffledArray1K;

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
  });

  it('should handle unwrapped data (PayloadType.Native)', (doneCallback: jest.DoneCallback) => {
    const payload: number[] = shuffledArray1K;

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
  });

  it.skip('should dispatch 100 million events faster then 1s (bulk)', (doneCallback: jest.DoneCallback) => {
    const measureName: string = 'Dispatch measure (bulk)';

    new MeasureObserver(measureName).observe((observer: PerformanceObserver, targetEntry: PerformanceEntry) => {
      expect(targetEntry.duration).toBeLessThan(1000);
      observer.disconnect();
      doneCallback();
    });

    const payload: number[] = shuffledArray1M;

    performance.mark(MeasureObserver.defaultMarks.Start);
    eventBus.dispatch(payload);
    performance.mark(MeasureObserver.defaultMarks.End);

    performance.measure(measureName, MeasureObserver.defaultMarks.Start, MeasureObserver.defaultMarks.End);
  });

  it.skip('should dispatch 1 million events faster then 5s (sequence)', (doneCallback: jest.DoneCallback) => {
    const measureName: string = 'Dispatch measure (sequence)';

    new MeasureObserver(measureName).observe((observer: PerformanceObserver, targetEntry: PerformanceEntry) => {
      expect(targetEntry.duration).toBeLessThan(5000);
      observer.disconnect();
      doneCallback();
    });

    const payload: number[] = shuffledArray1M;

    performance.mark(MeasureObserver.defaultMarks.Start);
    payload.forEach((item: number) => eventBus.dispatch(item));
    performance.mark(MeasureObserver.defaultMarks.End);

    performance.measure(measureName, MeasureObserver.defaultMarks.Start, MeasureObserver.defaultMarks.End);
  });

  it.skip('should dispatch 1 event and catch it faster then 3ms', (doneCallback: jest.DoneCallback) => {
    const measureName: string = 'Dispatch+Catch measure';

    new MeasureObserver(measureName).observe((observer: PerformanceObserver, targetEntry: PerformanceEntry) => {
      expect(targetEntry.duration).toBeLessThan(3);
      observer.disconnect();
      doneCallback();
    });

    const payload: number = NaN;

    performance.mark(MeasureObserver.defaultMarks.Start);
    eventBus.listen((_response: unknown, listener: Listener) => listener.stop());
    eventBus.dispatch(payload);
    performance.mark(MeasureObserver.defaultMarks.End);

    performance.measure(measureName, MeasureObserver.defaultMarks.Start, MeasureObserver.defaultMarks.End);
  });
});
