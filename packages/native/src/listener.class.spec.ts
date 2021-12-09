import { applyRecipientCallbackKey, RecipientCallback, VOID } from 'packages/common';
import { any } from 'packages/testing';
import { EventStream } from './event-stream.class';
import { Listener } from './listener.class';

describe('listener.class.ts', () => {
  let listener: Listener;
  const recipientCallbackMock: RecipientCallback = () => VOID;

  beforeEach(() => {
    const eventStream: EventStream = new EventStream();
    listener = new Listener(eventStream);
  });

  it('should be deactivated by default', (doneCallback: jest.DoneCallback) => {
    expect(listener.isActive).toBeFalsy();
    doneCallback();
  }, 10_000);

  it('should be activated after subscription', (doneCallback: jest.DoneCallback) => {
    listener[applyRecipientCallbackKey](recipientCallbackMock);
    expect(listener.isActive).toBeTruthy();
    doneCallback();
  }, 10_000);

  it('should be deactivated after stop', (doneCallback: jest.DoneCallback) => {
    expect(listener.isActive).toBeFalsy();
    doneCallback();
  }, 10_000);

  it('should not be stopped twice', (doneCallback: jest.DoneCallback) => {
    listener[applyRecipientCallbackKey](recipientCallbackMock);
    listener.stop();
    expect(() => listener.stop()).toThrowError();
    doneCallback();
  }, 10_000);

  it('should not try to unsubscribe from invalid subscription', (doneCallback: jest.DoneCallback) => {
    listener[applyRecipientCallbackKey](any({}));
    listener.stop();
    doneCallback();
  }, 10_000);

  it('should not allow subscriptions while deactivated', (doneCallback: jest.DoneCallback) => {
    listener[applyRecipientCallbackKey](recipientCallbackMock);

    expect(() => listener[applyRecipientCallbackKey](recipientCallbackMock)).toThrowError();

    doneCallback();
  }, 10_000);
});
