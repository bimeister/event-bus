import { VOID } from '@bimeister/utilities';
import type { Lineage } from './lineage.class';
import { WrappedEvent } from './wrapped-event.class';

describe('wrapped-event.class.ts', () => {
  let targetEvent: WrappedEvent;

  beforeEach(() => {
    targetEvent = new WrappedEvent(NaN);
  });

  it('should correctly set parent event', () => {
    const parentEvent: WrappedEvent = new WrappedEvent(null);
    targetEvent.setParent(parentEvent);

    const directChildren: Lineage[] = parentEvent.lineage.getDirectChildren();
    expect(directChildren[0]).toBe(targetEvent.lineage);
    expect(directChildren).toHaveLength(1);
  });

  it('should correctly set child event', () => {
    const childEvent: WrappedEvent = new WrappedEvent(null);
    targetEvent.setChild(childEvent);
    expect(childEvent.lineage.getDirectParent()).toBe(targetEvent.lineage);
  });

  it('should correctly detect descendants', () => {
    const greatGreatGrandEvent: WrappedEvent = new Array(100).fill(VOID).reduce((childEvent: WrappedEvent) => {
      const parentEvent: WrappedEvent = new WrappedEvent(null);
      childEvent.setParent(parentEvent);

      return parentEvent;
    }, targetEvent);

    expect(targetEvent.isDescendantOf(greatGreatGrandEvent)).toBe(true);
  });

  it('should correctly create descendants events', () => {
    const parentEvent: WrappedEvent = new WrappedEvent(null);
    const childEvent: WrappedEvent = parentEvent.createChild(undefined);

    expect(childEvent.isDescendantOf(parentEvent)).toBe(true);
  });
});
