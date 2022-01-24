import type { Nullable } from '@bimeister/utilities/types';
import { applyRecipientCallbackKey } from '../constants/apply-recipient-callback-key.const';
import type { RecipientCallback } from '../types/recipient-callback.type';
import type { EventStream } from './event-stream.class';

/**
 * @internal
 *
 * @description
 * Is used for subscription management
 */
export class Listener {
  public get isActive(): boolean {
    return this.#isActive;
  }

  /* eslint-disable @typescript-eslint/explicit-member-accessibility */
  #isActive: boolean = false;
  #recipientCallback: Nullable<RecipientCallback> = undefined;
  /* eslint-enable @typescript-eslint/explicit-member-accessibility */

  constructor(private readonly eventStream: EventStream) {}

  public [applyRecipientCallbackKey](recipientCallback: RecipientCallback): void {
    if (typeof this.#recipientCallback === 'function') {
      throw new Error('[EventBus] callback already exists.');
    }

    this.#recipientCallback = recipientCallback;
    this.#isActive = true;
  }

  public stop(): void {
    if (!this.#isActive) {
      return;
    }

    this.#isActive = false;

    if (typeof this.#recipientCallback !== 'function') {
      return;
    }

    this.eventStream.unsubscribe(this.#recipientCallback);
  }
}
