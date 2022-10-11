import { isNil, Nullable } from '@bimeister/utilities';
import { PayloadType } from '../enums/payload-type.enum';
import type { Options } from '../interfaces/options.interface';

export function isPayloadNative(options: Nullable<Options.Unified>): boolean {
  return isNil(options) || options.payloadType === PayloadType.Native;
}
