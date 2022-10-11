import { VOID } from '@bimeister/utilities';
import { getShuffledArray } from '@bimeister/utilities/common';
import type { RecipientCallback } from '../types';
import { EventStream } from './event-stream.class';
import { WrappedEvent } from './wrapped-event.class';

interface PayloadMock {
  index: number;
  value: string;
}

function isPayloadMock(input: unknown): input is PayloadMock {
  const requiredProperties: Set<keyof PayloadMock> = new Set<keyof PayloadMock>(['index', 'value']);
  if (typeof input !== 'object' || input === null) {
    return false;
  }

  return Array.from(requiredProperties).every((property: keyof PayloadMock) => property in input);
}

function getRandomInteger(min: number, max: number): number {
  const sanitizedMin: number = Math.ceil(min);
  const sanitizedMax: number = Math.floor(max);
  return Math.floor(Math.random() * (sanitizedMax - sanitizedMin + 1)) + sanitizedMin;
}

describe('event-stream.class.ts', () => {
  let eventStream: EventStream;
  let valuesToEmit: WrappedEvent<PayloadMock>[];

  beforeEach(() => {
    eventStream = new EventStream();
    valuesToEmit = getShuffledArray(new Array(1000).fill(VOID).map((_: void, index: number) => String(index))).map(
      (value: string, index: number) =>
        new WrappedEvent<PayloadMock>({
          index,
          value
        })
    );
  });

  it('should emit values to recipient', () => {
    eventStream.subscribe((response: WrappedEvent) => {
      const payload: unknown = response.payload;
      if (!isPayloadMock(payload)) {
        fail();
      }
      expect(response).toBe(valuesToEmit[payload.index]);
    });

    valuesToEmit.forEach((value: WrappedEvent<PayloadMock>) => eventStream.emit(value));
  });

  it('should stop emitting on unsubscribe', () => {
    const targetEmitCount: number = getRandomInteger(0, valuesToEmit.length - 1);
    let resultEmitCount: number = 0;
    let realEmitCount: number = 0;
    const recipientCallback: RecipientCallback = () => {
      resultEmitCount = resultEmitCount + 1;
    };

    eventStream.subscribe(() => {
      if (realEmitCount === targetEmitCount) {
        eventStream.unsubscribe(recipientCallback);
      }

      realEmitCount = realEmitCount + 1;

      if (realEmitCount === valuesToEmit.length - 1) {
        expect(resultEmitCount).toBe(targetEmitCount);
      }
    });

    eventStream.subscribe(recipientCallback);

    valuesToEmit.forEach((value: WrappedEvent<PayloadMock>) => eventStream.emit(value));
  });

  it('should clean up recipients on unsubscribe', () => {
    const onCleanUp: jest.Mock = jest.fn();
    const finalizationRegistry: FinalizationRegistry<number> = new FinalizationRegistry<number>(onCleanUp);

    const recipients: RecipientCallback[] = new Array(100_000)
      .fill(VOID)
      .map((_: void, index: number) => (emittedData: WrappedEvent) => {
        const wrapperDiv: HTMLElement = document.createElement('div');
        const payloadDiv: HTMLElement = document.createElement('div');
        const indexDiv: HTMLElement = document.createElement('div');

        payloadDiv.innerText = JSON.stringify(emittedData.payload);
        indexDiv.innerText = String(index);

        wrapperDiv.appendChild(payloadDiv);
        wrapperDiv.appendChild(indexDiv);

        document.body.appendChild(wrapperDiv);
      });

    recipients.forEach((recipient: RecipientCallback, index: number) => {
      eventStream.subscribe(recipient);
      finalizationRegistry.register(recipient, index);
    });
    recipients.forEach((recipient: RecipientCallback) => eventStream.unsubscribe(recipient));

    setTimeout(() => {
      expect(onCleanUp).toBeCalledTimes(recipients.length);
    }, 0);
  });
});
