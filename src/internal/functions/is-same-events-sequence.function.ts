import type { BusEventBase } from '../../lib/bus-event-base.abstract';
import { VOID } from '../constants/void.const';
export function isSameEventsSequence(caughtEvents: BusEventBase[], initialEvents: BusEventBase[]): boolean {
  const caughtEventsIds: string[] = caughtEvents.map((event: BusEventBase, index: number) => `${event.id}-${index}`);
  const initialEventsIds: string[] = initialEvents.map((event: BusEventBase, index: number) => `${event.id}-${index}`);

  let sequenceIsValid: boolean = true;
  new Array(caughtEventsIds.length).fill(VOID).forEach((_, index: number) => {
    if (!sequenceIsValid) {
      return;
    }
    sequenceIsValid = caughtEventsIds[index] === initialEventsIds[index];
  });
  return sequenceIsValid;
}
