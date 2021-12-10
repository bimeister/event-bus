import { VOID } from 'packages/internal';
import { any } from 'packages/testing';

describe('any.utility.ts', () => {
  it('should pass data as is', (doneCallback: jest.DoneCallback) => {
    ['string', NaN, {}, () => VOID].forEach((input: unknown) => expect(any(input)).toBe(input));
    doneCallback();
  }, 10_000);
});
