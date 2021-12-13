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
    expect(listener.isActive).toBeFalsy();
  });

  it('should be activated after subscription', () => {
    listener[applyRecipientCallbackKey](recipientCallbackMock);
    expect(listener.isActive).toBeTruthy();
  });

  it('should be deactivated after stop', () => {
    expect(listener.isActive).toBeFalsy();
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
