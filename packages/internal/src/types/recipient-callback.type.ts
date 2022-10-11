import type { WrappedEvent } from '../classes/wrapped-event.class';

/**
 * @internal
 */
export type RecipientCallback<T = unknown> = (emittedData: WrappedEvent<T>) => void;
