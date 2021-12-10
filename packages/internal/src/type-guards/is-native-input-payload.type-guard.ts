import type { WrappedEvent } from '../classes/wrapped-event.class';
import type { Options } from '../interfaces/options.interface';
import { isOptionsNative } from './is-options-native.type-guard';

export function isNativeInputPayload<T>(_input: T | WrappedEvent<T>, options: Options.Unified): _input is T {
  return isOptionsNative(options);
}
