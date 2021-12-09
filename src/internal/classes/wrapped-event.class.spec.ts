import { VOID } from '../constants/void.const';
import { WrappedEvent } from './wrapped-event.class';

describe('wrapped-event.class.ts', () => {
  let targetEvent: WrappedEvent;

  beforeEach(() => {
    targetEvent = new WrappedEvent(NaN);
  });

  it('should correctly set parent event', (doneCallback: jest.DoneCallback) => {
    const parentEvent: WrappedEvent = new WrappedEvent(null);
    targetEvent.setParent(parentEvent);
    expect(parentEvent.lineage.getDirectChild()).toBe(targetEvent.lineage);
    doneCallback();
  }, 10_000);

  it('should correctly set descendant event', (doneCallback: jest.DoneCallback) => {
    const childEvent: WrappedEvent = new WrappedEvent(null);
    targetEvent.setDescendant(childEvent);
    expect(childEvent.lineage.getDirectParent()).toBe(targetEvent.lineage);
    doneCallback();
  }, 10_000);

  it('should correctly detect descendants', (doneCallback: jest.DoneCallback) => {
    const greatGreatGrandEvent: WrappedEvent = new Array(100).fill(VOID).reduce((childEvent: WrappedEvent) => {
      const parentEvent: WrappedEvent = new WrappedEvent(null);
      childEvent.setParent(parentEvent);

      return parentEvent;
    }, targetEvent);

    expect(targetEvent.isDescendantOf(greatGreatGrandEvent)).toBeTruthy();

    doneCallback();
  }, 10_000);
});
