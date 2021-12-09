import { EventStream } from '../internal/classes/event-stream.class';
import { Listener } from '../internal/classes/listener.class';
import { WrappedEvent } from '../internal/classes/wrapped-event.class';
import { applyRecipientCallbackKey } from '../internal/constants/apply-recipient-callback.key';
import { PayloadType } from '../internal/enums/payload-type.enum';
import type { Options } from '../internal/interfaces/options.interface';
import { isNativeDataCallback } from '../internal/type-guards/is-native-data-callback.type-guard';
import { isNativeInputPayload } from '../internal/type-guards/is-native-input-payload.type-guard';
import type { EventCallback } from '../internal/types/event-callback.type';
import type { RecipientCallback } from '../internal/types/recipient-callback.type';

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
    if (isNativeInputPayload(input, options)) {
      const wrappedEvent: WrappedEvent = new WrappedEvent(input);
      this.eventStream.emit(wrappedEvent);
      return;
    }

    this.eventStream.emit(input);
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
