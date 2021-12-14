import { applyRecipientCallbackKey, RecipientCallback, VOID } from 'packages/internal';
import { EventStream } from './event-stream.class';
import { Listener } from './listener.class';

describe('listener.class.ts', () => {
  let listener: Listener;
  const recipientCallbackMock: RecipientCallback = () => VOID;

  beforeEach(() => {
    const eventStream: EventStream = new EventStream();
    listener = new Listener(eventStream);
  });

  it('should be deactivated by default', () => {
    expect(listener.isActive).toBe(false);
  });

  it('should be activated after subscription', () => {
    listener[applyRecipientCallbackKey](recipientCallbackMock);
    expect(listener.isActive).toBe(true);
  });

  it('should be deactivated after stop', () => {
    expect(listener.isActive).toBe(false);
  });

  it('should ignore future stops', () => {
    listener.stop();
    expect(listener.isActive).toBe(false);
    listener.stop();
    expect(listener.isActive).toBe(false);
  });

  it('should not try to unsubscribe from invalid subscription', () => {
    listener[applyRecipientCallbackKey]({} as any);
    listener.stop();
  });

  it('should not allow subscriptions while deactivated', () => {
    listener[applyRecipientCallbackKey](recipientCallbackMock);

    expect(() => listener[applyRecipientCallbackKey](recipientCallbackMock)).toThrowError();
  });
});
