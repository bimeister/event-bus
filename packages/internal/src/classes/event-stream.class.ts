import type { RecipientCallback, WrappedEvent } from 'packages/internal';

/**
 * @internal
 */
export class EventStream {
  private readonly recipients: Set<RecipientCallback> = new Set<RecipientCallback>();

  public emit<T>(data: WrappedEvent<T>): void {
    if (this.recipients.size === 0) {
      return;
    }

    queueMicrotask(() => {
      this.recipients.forEach((callback: RecipientCallback) => callback(data));
    });
  }

  public subscribe(callback: RecipientCallback): void {
    this.recipients.add(callback);
  }

  public unsubscribe(callback: RecipientCallback): void {
    this.recipients.delete(callback);
  }
}
