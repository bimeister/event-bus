import type { Nullable } from '@bimeister/utilities';
import type { EventStream, RecipientCallback } from 'packages/internal';
/**
 * Have no idea, why this import works and `packages/internal` – doesn't
 */
import { applyRecipientCallbackKey } from 'packages/internal/src/constants/apply-recipient-callback-key.const';

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
      throw new Error('[EventBus] listener is already stopped.');
    }

    this.#isActive = false;

    if (typeof this.#recipientCallback !== 'function') {
      return;
    }

    this.eventStream.unsubscribe(this.#recipientCallback);
  }
}
