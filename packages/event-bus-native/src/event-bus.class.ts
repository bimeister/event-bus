import {
  applyRecipientCallbackKey,
  EventCallback,
  EventStream,
  isNativeDataCallback,
  isNativeInputPayload,
  Listener,
  Options,
  PayloadType,
  RecipientCallback,
  WrappedEvent
} from '@bimeister/event-bus.internal';

export class EventBus {
  private readonly eventStream: EventStream = new EventStream();

  public dispatch<T>(input: T, options?: Options.Native): void;
  public dispatch<T>(input: WrappedEvent<T>, options: Options.Wrapped): void;
  public dispatch<T>(
    input: T | WrappedEvent<T>,
    options: Options.Unified = {
      payloadType: PayloadType.Native
    }
  ): void {
    if (!isNativeInputPayload(input, options)) {
      this.eventStream.emit(input);
      return;
    }

    const wrappedEvent: WrappedEvent = new WrappedEvent(input);
    this.eventStream.emit(wrappedEvent);
  }

  public listen(callback: EventCallback.Native, options?: Options.Native): Listener;
  public listen(callback: EventCallback.Wrapped, options: Options.Wrapped): Listener;
  public listen(
    callback: EventCallback.Unified,
    options: Options.Unified = {
      payloadType: PayloadType.Native
    }
  ): Listener {
    const listener: Listener = new Listener(this.eventStream);
    const onWrappedEventCallback: RecipientCallback = isNativeDataCallback(callback, options)
      ? (event: WrappedEvent) => callback(event.payload, listener)
      : (event: WrappedEvent) => callback(event, listener);

    listener[applyRecipientCallbackKey](onWrappedEventCallback);

    this.eventStream.subscribe(onWrappedEventCallback);

    return listener;
  }
}
