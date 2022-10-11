import type { PayloadType } from '../enums/payload-type.enum';

export namespace Options {
  export interface Native {
    payloadType: PayloadType.Native;
  }

  export interface Wrapped {
    payloadType: PayloadType.Wrapped;
  }

  export type Unified = Native | Wrapped;
}
