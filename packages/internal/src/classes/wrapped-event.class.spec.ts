import { VOID } from '../constants/void.const';
import { WrappedEvent } from './wrapped-event.class';

describe('wrapped-event.class.ts', () => {
  let targetEvent: WrappedEvent;

  beforeEach(() => {
    targetEvent = new WrappedEvent(NaN);
  });

  it('should correctly set parent event', () => {
    const parentEvent: WrappedEvent = new WrappedEvent(null);
    targetEvent.setParent(parentEvent);
    expect(parentEvent.lineage.getDirectChild()).toBe(targetEvent.lineage);
  });

  it('should correctly set child event', () => {
    const childEvent: WrappedEvent = new WrappedEvent(null);
    targetEvent.setChild(childEvent);
    expect(childEvent.lineage.getDirectParent()).toBe(targetEvent.lineage);
  });

  it('should correctly detect children', () => {
    const greatGreatGrandEvent: WrappedEvent = new Array(100).fill(VOID).reduce((childEvent: WrappedEvent) => {
      const parentEvent: WrappedEvent = new WrappedEvent(null);
      childEvent.setParent(parentEvent);

      return parentEvent;
    }, targetEvent);

    expect(targetEvent.isChildOf(greatGreatGrandEvent)).toBe(true);
  });

  it('should correctly create child events', () => {
    const parentEvent: WrappedEvent = new WrappedEvent(null);
    const childEvent: WrappedEvent = parentEvent.createChild(undefined);

    expect(childEvent.isChildOf(parentEvent)).toBe(true);
  });
});
