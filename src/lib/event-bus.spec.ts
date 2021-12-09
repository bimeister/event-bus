import { getShuffledArray } from '@bimeister/utilities';
import { performance, PerformanceEntry, PerformanceObserver } from 'perf_hooks';
import type { Listener } from '../internal/classes/listener.class';
import { MeasureObserver } from '../internal/classes/measure-observer.class';
import { WrappedEvent } from '../internal/classes/wrapped-event.class';
import { VOID } from '../internal/constants/void.const';
import { PayloadType } from '../internal/enums/payload-type.enum';
import { EventBus } from './event-bus.class';

describe('event-bus.class.ts', () => {
  let eventBus: EventBus;

  let shuffledArray1K: number[];
  let shuffledArray1M: number[];

  beforeAll(() => {
    eventBus = new EventBus();
    shuffledArray1K = getShuffledArray(new Array(1000).fill(VOID).map((_item: void, index: number) => index));
    shuffledArray1M = new Array(1_000_000 / shuffledArray1K.length).fill(VOID).reduce((accumulatedValue: number[]) => {
      accumulatedValue.push(...shuffledArray1K);
      return accumulatedValue;
    }, []);
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
  }, 10_000);

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
  }, 10_000);

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
  }, 10_000);

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
  }, 10_000);

  it('should dispatch 100 million events faster then 1s (bulk)', (doneCallback: jest.DoneCallback) => {
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
  }, 10_000);

  it('should dispatch 1 million events faster then 3s (sequence)', (doneCallback: jest.DoneCallback) => {
    const measureName: string = 'Dispatch measure (sequence)';

    new MeasureObserver(measureName).observe((observer: PerformanceObserver, targetEntry: PerformanceEntry) => {
      expect(targetEntry.duration).toBeLessThan(3000);
      observer.disconnect();
      doneCallback();
    });

    const payload: number[] = shuffledArray1M;

    performance.mark(MeasureObserver.defaultMarks.Start);
    payload.forEach((item: number) => eventBus.dispatch(item));
    performance.mark(MeasureObserver.defaultMarks.End);

    performance.measure(measureName, MeasureObserver.defaultMarks.Start, MeasureObserver.defaultMarks.End);
  }, 10_000);

  it('should dispatch 1 event and catch it faster then 3ms', (doneCallback: jest.DoneCallback) => {
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
  }, 10_000);
});
