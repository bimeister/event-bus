import { isNil } from '@bimeister/utilities/common/is-nil.function';
import { PayloadType } from '../enums/payload-type.enum';
import type { Options } from '../interfaces/options.interface';

export function isOptionsNative(options: Options.Unified | undefined): options is Options.Native {
  return isNil(options) || options.payloadType === PayloadType.Native;
}
