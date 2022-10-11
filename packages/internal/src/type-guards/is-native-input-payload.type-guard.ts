import type { WrappedEvent } from '../classes/wrapped-event.class';
import type { Options } from '../interfaces/options.interface';
import { isPayloadNative } from '../utilities/is-payload-native.utility';

export function isNativeInputPayload<T>(_input: T | WrappedEvent<T>, options: Options.Unified): _input is T {
  return isPayloadNative(options);
}
