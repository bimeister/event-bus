import type { Nullable } from '@bimeister/utilities';
import { applyRecipientCallbackKey } from '../constants/apply-recipient-callback.key';
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
  }

  public stop(): void {
    this.#isActive = false;

    if (typeof this.#recipientCallback !== 'function') {
      throw new Error('[EventBus] cannot unsubscribe from invalid listener.');
    }

    this.eventStream.unsubscribe(this.#recipientCallback);
  }
}
