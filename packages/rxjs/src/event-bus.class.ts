import { EventCallback, isOptionsNative, Listener, Options, PayloadType, WrappedEvent } from 'packages/internal';
import { EventBus as NativeEventBus } from 'packages/native';
import { Observable, Subscriber, TeardownLogic } from 'rxjs';

export class EventBus {
  private readonly nativeEventBus: NativeEventBus = new NativeEventBus();

  public dispatch<T>(input: T, options?: Options.Native): Observable<unknown>;
  public dispatch<T>(input: WrappedEvent<T>, options: Options.Wrapped): Observable<WrappedEvent<unknown>>;
  public dispatch<T>(input: T | WrappedEvent<T>, options: Options.Unified): Observable<WrappedEvent<unknown> | unknown>;
  public dispatch<T>(
    input: T | WrappedEvent<T>,
    options: Options.Unified = {
      payloadType: PayloadType.Native
    }
  ): Observable<WrappedEvent<unknown> | unknown> {
    this.nativeEventBus.dispatch(input, options);
    return this.listen(options);
  }

  public listen(options?: Options.Native): Observable<unknown>;
  public listen(options: Options.Wrapped): Observable<WrappedEvent<unknown>>;
  public listen(options: Options.Unified): Observable<WrappedEvent<unknown> | unknown>;
  public listen(
    options: Options.Unified = {
      payloadType: PayloadType.Native
    }
  ): Observable<WrappedEvent<unknown> | unknown> {
    if (isOptionsNative(options)) {
      return new Observable<unknown>((subscriber: Subscriber<unknown>): TeardownLogic => {
        const listenerCallback: EventCallback.Native = (response: unknown) => subscriber.next(response);
        const listener: Listener = this.nativeEventBus.listen(listenerCallback, options);
        const unSubscriber: TeardownLogic = () => listener.stop();
        return unSubscriber;
      });
    }

    return new Observable<WrappedEvent<unknown>>((subscriber: Subscriber<WrappedEvent<unknown>>): TeardownLogic => {
      const listenerCallback: EventCallback.Wrapped = (response: WrappedEvent<unknown>) => subscriber.next(response);
      const listener: Listener = this.nativeEventBus.listen(listenerCallback, options);
      const unSubscriber: TeardownLogic = () => listener.stop();
      return unSubscriber;
    });
  }
}
