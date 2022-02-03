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
    return this.shouldEmitValues;
  }

  private shouldEmitValues: boolean = false;
  private recipientCallback: Nullable<RecipientCallback> = undefined;

  constructor(private readonly eventStream: EventStream) {}

  public [applyRecipientCallbackKey](recipientCallback: RecipientCallback): void {
    if (typeof this.recipientCallback === 'function') {
      throw new Error('[EventBus] callback already exists.');
    }

    this.recipientCallback = recipientCallback;
    this.shouldEmitValues = true;
  }

  public stop(): void {
    if (!this.shouldEmitValues) {
      return;
    }

    this.shouldEmitValues = false;

    if (typeof this.recipientCallback !== 'function') {
      return;
    }

    this.eventStream.unsubscribe(this.recipientCallback);
  }
}
