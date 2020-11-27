import { Observable } from 'rxjs';
import { bufferCount, map, take } from 'rxjs/operators';
import { UserLogInFailEventMock } from './../mocks/events/user-log-in-fail.event.mock';
import { UserLogInSuccessEventMock } from './../mocks/events/user-log-in-success.event.mock';
import { UserLogInEventMock } from './../mocks/events/user-log-in.event.mock';
import { UserLogOutSuccessEventMock } from './../mocks/events/user-log-out-success.event.mock';
import { UserLogOutEventMock } from './../mocks/events/user-log-out.event.mock';
import { BusEventBase } from './bus-event-base.abstract';
import { EventBus } from './event-bus.class';

describe('event-bus.class.ts', () => {
  let eventBus: EventBus = new EventBus();

  beforeEach(() => {
    eventBus = new EventBus();
  });

  it('should handle dispatched events in valid sequence', (doneCallback: jest.DoneCallback) => {
    const initialEvents: BusEventBase[] = new Array(100000)
      .fill([
        new UserLogInEventMock(),
        new UserLogInSuccessEventMock(),
        new UserLogOutEventMock(),
        new UserLogOutSuccessEventMock(),
        new UserLogInEventMock(),
        new UserLogInFailEventMock()
      ])
      .flat(1);

    const catchedEvents$: Observable<BusEventBase> = eventBus.catchAll();
    catchedEvents$
      .pipe(
        bufferCount(initialEvents.length),
        take(1),
        map((catchedEvents: BusEventBase[]) => {
          const catchedEventsIds: string = catchedEvents.map((event: BusEventBase) => event.id).join('|');
          const initialEventsIds: string = initialEvents.map((event: BusEventBase) => event.id).join('|');

          return catchedEventsIds === initialEventsIds;
        })
      )
      .subscribe((sequenceIsValid: boolean) => {
        expect(sequenceIsValid).toBeTruthy();
        doneCallback();
      });

    eventBus.dispatch(initialEvents);
  }, 10000);
});
