import { PayloadType } from '../enums/payload-type.enum';
import type { Options } from '../interfaces/options.interface';

export function isOptionsWrapped(options: Options.Wrapped): options is Options.Wrapped {
  return options.payloadType === PayloadType.Wrapped;
}
