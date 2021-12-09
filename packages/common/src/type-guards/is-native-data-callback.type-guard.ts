import type { Options } from '../interfaces/options.interface';
import type { EventCallback } from '../types/event-callback.type';
import { isPayloadNative } from '../utilities/is-payload-native.utility';

export function isNativeDataCallback<T>(
  _callback: EventCallback.Native<T> | EventCallback.Wrapped<T>,
  options: Options.Unified
): _callback is EventCallback.Native<T> {
  return isPayloadNative(options);
}
