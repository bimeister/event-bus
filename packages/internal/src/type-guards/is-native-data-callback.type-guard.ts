import type { Options } from '../interfaces/options.interface';
import type { EventCallback } from '../types/event-callback.type';
import { isOptionsNative } from './is-options-native.type-guard';

export function isNativeDataCallback<T>(
  _callback: EventCallback.Native<T> | EventCallback.Wrapped<T>,
  options: Options.Unified
): _callback is EventCallback.Native<T> {
  return isOptionsNative(options);
}
