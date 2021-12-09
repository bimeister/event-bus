import type { Listener } from '../classes/listener.class';
import type { WrappedEvent } from '../classes/wrapped-event.class';

/**
 * @internal
 */
export namespace EventCallback {
  export type Native<T = unknown> = (payload: T, listener: Listener) => void;
  export type Wrapped<T = unknown> = (wrappedEvent: WrappedEvent<T>, listener: Listener) => void;

  export type Unified = Native | Wrapped;
}
