import type { WrappedEvent } from '../classes/wrapped-event.class';

export type RecipientCallback<T = unknown> = (emittedData: WrappedEvent<T>) => void;
