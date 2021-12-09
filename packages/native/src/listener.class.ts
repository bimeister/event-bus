import type { Nullable } from '@bimeister/utilities';
import { applyRecipientCallbackKey, RecipientCallback } from 'packages/common';
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

  // tslint:disable: member-access
  #isActive: boolean = false;
  #recipientCallback: Nullable<RecipientCallback> = undefined;
  // tslint:enable: member-access

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
