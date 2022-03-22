import { PayloadType, WrappedEvent } from '@bimeister/event-bus.internal';
import { EventBus as NativeEventBus } from '@bimeister/event-bus.native';
import { combineLatest, Observable } from 'rxjs';
import { take, toArray } from 'rxjs/operators';
import { EventBus } from './event-bus.class';

describe('event-bus.class.ts', () => {
  let eventBus: EventBus;

  beforeEach(() => {
    eventBus = new EventBus();
  });

  it('should return observable of same option on dispatch', (doneCallback: jest.DoneCallback) => {
    const nativeDispatcher$: Observable<unknown> = eventBus.dispatch(null, { payloadType: PayloadType.Native });
    const wrappedDispatcher$: Observable<WrappedEvent<unknown>> = eventBus.dispatch(new WrappedEvent(null), {
      payloadType: PayloadType.Wrapped
    });

    combineLatest([nativeDispatcher$, wrappedDispatcher$])
      .pipe(take(1))
      .subscribe(([native, wrapped]: [unknown, WrappedEvent<unknown>]) => {
        expect(native).not.toBeInstanceOf(WrappedEvent);
        expect(wrapped).toBeInstanceOf(WrappedEvent);
        doneCallback();
      });

    eventBus.dispatch('sample');
  });

  it('should emit WrappedEvent (PayloadType.Wrapped)', (doneCallback: jest.DoneCallback) => {
    eventBus
      .listen({ payloadType: PayloadType.Wrapped })
      .pipe(take(1))
      .subscribe((response: unknown) => {
        expect(response).toBeInstanceOf(WrappedEvent);
        doneCallback();
      });

    eventBus.dispatch('sample');
  });

  it('should emit data as is (PayloadType.Native)', (doneCallback: jest.DoneCallback) => {
    eventBus
      .listen({ payloadType: PayloadType.Native })
      .pipe(take(2), toArray())
      .subscribe(([stringDispatchData, eventDispatchData]: unknown[]) => {
        expect(stringDispatchData).not.toBeInstanceOf(WrappedEvent);
        expect(eventDispatchData).toBeInstanceOf(WrappedEvent);
        doneCallback();
      });

    eventBus.dispatch('sample');
    eventBus.dispatch(new WrappedEvent(null));
  });

  it('should emit data as is (no arguments)', (doneCallback: jest.DoneCallback) => {
    eventBus
      .listen()
      .pipe(take(2), toArray())
      .subscribe(([stringDispatchData, eventDispatchData]: unknown[]) => {
        expect(stringDispatchData).not.toBeInstanceOf(WrappedEvent);
        expect(eventDispatchData).toBeInstanceOf(WrappedEvent);
        doneCallback();
      });

    eventBus.dispatch('sample');
    eventBus.dispatch(new WrappedEvent(null));
  });

  it('should throw error if dispatch arguments are invalid', () => {
    expect(() => eventBus.dispatch({ payloadType: PayloadType.Native }, 'sample' as any)).toThrowError();
  });

  it('should use native EventBus under the hood', () => {
    const nativeEventBus: NativeEventBus = eventBus['nativeEventBus'];
    expect(nativeEventBus).toBeInstanceOf(NativeEventBus);
    const nativeDispatch: jest.SpyInstance = jest.spyOn(nativeEventBus, 'dispatch');
    eventBus.dispatch(null);
    expect(nativeDispatch).toBeCalled();
  });
});
