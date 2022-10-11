import type { PayloadType } from '../enums/payload-type.enum';

/**
 * @internal
 */
export namespace Options {
  export interface Native {
    payloadType: PayloadType.Native;
  }

  export interface Wrapped {
    payloadType: PayloadType.Wrapped;
  }

  export type Unified = Native | Wrapped;
}
