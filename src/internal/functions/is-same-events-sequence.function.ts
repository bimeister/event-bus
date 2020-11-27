import { BusEventBase } from '../../lib/bus-event-base.abstract';
import { VOID } from '../constants/void.const';
export function isSameEventsSequence(catchedEvents: BusEventBase[], initialEvents: BusEventBase[]): boolean {
  const catchedEventsIds: string[] = catchedEvents.map((event: BusEventBase, index: number) => `${event.id}-${index}`);
  const initialEventsIds: string[] = initialEvents.map((event: BusEventBase, index: number) => `${event.id}-${index}`);

  let sequenceIsValid: boolean = true;
  new Array(catchedEventsIds.length).fill(VOID).forEach((_, index: number) => {
    if (!sequenceIsValid) {
      return;
    }
    sequenceIsValid = catchedEventsIds[index] === initialEventsIds[index];
  });
  return sequenceIsValid;
}
