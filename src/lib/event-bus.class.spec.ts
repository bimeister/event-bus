import { getShuffledArray } from '@bimeister/utilities';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { isSameEventsSequence } from '../internal/functions/is-same-events-sequence.function';
import { mapToEventsSlice } from '../internal/functions/rxjs-operators/map-to-events-slice.operator';
import { DispatchInputBase } from './../internal/classes/dispatch-input-base.abstract';
import { VOID } from './../internal/constants/void.const';
import { AuthEventType } from './../mocks/enums/auth-event-type.enum.mock';
import { ProjectEventType } from './../mocks/enums/project-event-type.enum.mock';
import { Scope } from './../mocks/enums/scope.enum.mock';
import { LeadingMarkerErrorEventMock } from './../mocks/events/leading-marker-error.event.mock';
import { LeadingMarkerEventMock } from './../mocks/events/leading-marker.event.mock';
import { ProjectErrorEventMock } from './../mocks/events/project-error.event.mock';
import { TrailingMarkerErrorEventMock } from './../mocks/events/trailing-marker-error.event.mock';
import { TrailingMarkerEventMock } from './../mocks/events/trailing-marker.event.mock';
import { UserLogInErrorEventMock } from './../mocks/events/user-log-error.event.mock';
import { UserLogInFailEventMock } from './../mocks/events/user-log-in-fail.event.mock';
import { UserLogInSuccessEventMock } from './../mocks/events/user-log-in-success.event.mock';
import { UserLogInEventMock } from './../mocks/events/user-log-in.event.mock';
import { UserLogOutSuccessEventMock } from './../mocks/events/user-log-out-success.event.mock';
import { UserLogOutEventMock } from './../mocks/events/user-log-out.event.mock';
import { BusErrorEventBase } from './bus-error-event-base.abstract';
import { BusEventBase } from './bus-event-base.abstract';
import { CatchPredicate } from './catch-predicate.type';
import { EventBus } from './event-bus.class';

describe('event-bus.class.ts', () => {
  let eventBus: EventBus;
  let regularEvents: BusEventBase[];
  let errorEvents: BusErrorEventBase[];
  let invalidInput: DispatchInputBase[];
  let mixedEvents: DispatchInputBase[];
  let filteredErrorEvents: BusErrorEventBase[];
  let filteredRegularEvents: BusEventBase[];

  beforeAll(() => {
    eventBus = new EventBus();

    regularEvents = [];
    new Array(100).fill(VOID).forEach(() => {
      regularEvents.push(
        new UserLogInEventMock(),
        new UserLogInSuccessEventMock(),
        new UserLogOutEventMock(),
        new UserLogOutSuccessEventMock(),
        new UserLogInEventMock(),
        new UserLogInFailEventMock()
      );
    });

    errorEvents = [];
    new Array(100).fill(VOID).forEach(() => {
      errorEvents.push(new UserLogInErrorEventMock(), new ProjectErrorEventMock());
    });

    invalidInput = [
      {},
      null,
      [],
      '123',
      456,
      Object,
      Infinity,
      VOID,
      new Error(),
      NaN,
      0x000000,
      true,
      undefined
    ] as any;

    mixedEvents = getShuffledArray([...regularEvents, ...errorEvents, ...invalidInput]);

    filteredErrorEvents = mixedEvents.filter((event: BusEventBase) => event instanceof BusErrorEventBase);
    filteredRegularEvents = mixedEvents.filter((event: BusEventBase) => event instanceof BusEventBase);
  });

  it('should handle dispatched events in valid sequence', (doneCallback: jest.DoneCallback) => {
    const caughtEvents$: Observable<BusEventBase> = eventBus.catchAll();
    caughtEvents$
      .pipe(
        mapToEventsSlice(),
        map((caughtEvents: BusEventBase[]) => isSameEventsSequence(caughtEvents, regularEvents))
      )
      .subscribe((sequenceIsValid: boolean) => {
        expect(sequenceIsValid).toBeTruthy();
        doneCallback();
      });

    eventBus.dispatch(new LeadingMarkerEventMock());
    eventBus.dispatch(regularEvents);
    eventBus.dispatch(new TrailingMarkerEventMock());
  }, 10_000);

  it('should ignore invalid dispatch input', (doneCallback: jest.DoneCallback) => {
    const validEvents: BusEventBase[] = [new LeadingMarkerEventMock(), new TrailingMarkerEventMock()];

    const caughtEvents$: Observable<BusEventBase> = eventBus.catchAll();
    caughtEvents$
      .pipe(
        mapToEventsSlice(),
        map((caughtEvents: BusEventBase[]) => isSameEventsSequence(caughtEvents, validEvents))
      )
      .subscribe((sequenceIsValid: boolean) => {
        expect(sequenceIsValid).toBeTruthy();
        doneCallback();
      });

    eventBus.dispatch(new LeadingMarkerEventMock());
    eventBus.dispatch(invalidInput);
    eventBus.dispatch(new TrailingMarkerEventMock());
  }, 10_000);

  it('should emit only error events from EventBus.catchErrors', (doneCallback: jest.DoneCallback) => {
    const caughtErrors$: Observable<BusErrorEventBase> = eventBus.catchErrors();
    caughtErrors$
      .pipe(
        mapToEventsSlice(),
        map((caughtErrors: BusErrorEventBase[]) => isSameEventsSequence(caughtErrors, filteredErrorEvents))
      )
      .subscribe((sequenceIsValid: boolean) => {
        expect(sequenceIsValid).toBeTruthy();
        doneCallback();
      });

    eventBus.dispatch(new LeadingMarkerErrorEventMock());
    eventBus.dispatch(mixedEvents);
    eventBus.dispatch(new TrailingMarkerErrorEventMock());
  }, 10_000);

  it('should emit only regular events from EventBus.catchEvents', (doneCallback: jest.DoneCallback) => {
    const caughtEvents$: Observable<BusEventBase> = eventBus.catchEvents();
    caughtEvents$
      .pipe(
        mapToEventsSlice(),
        map((caughtEvents: BusEventBase[]) => isSameEventsSequence(caughtEvents, filteredRegularEvents))
      )
      .subscribe((sequenceIsValid: boolean) => {
        expect(sequenceIsValid).toBeTruthy();
        doneCallback();
      });

    eventBus.dispatch(new LeadingMarkerEventMock());
    eventBus.dispatch(mixedEvents);
    eventBus.dispatch(new TrailingMarkerEventMock());
  }, 10_000);

  it('should emit filtered regular events from EventBus.catchEvents', (doneCallback: jest.DoneCallback) => {
    const predicate: CatchPredicate = (event: DispatchInputBase) => {
      return (
        (event.type === AuthEventType.LogInSuccess && event.scope === Scope.Auth) ||
        event instanceof LeadingMarkerEventMock ||
        event instanceof TrailingMarkerEventMock
      );
    };

    const expectedResult: BusEventBase[] = filteredRegularEvents.filter(predicate);

    const caughtEvents$: Observable<BusEventBase> = eventBus.catchEvents(predicate);
    caughtEvents$
      .pipe(
        mapToEventsSlice(),
        map((caughtEvents: BusEventBase[]) => isSameEventsSequence(caughtEvents, expectedResult))
      )
      .subscribe((sequenceIsValid: boolean) => {
        expect(sequenceIsValid).toBeTruthy();
        doneCallback();
      });

    eventBus.dispatch(new LeadingMarkerEventMock());
    eventBus.dispatch(mixedEvents);
    eventBus.dispatch(new TrailingMarkerEventMock());
  }, 10_000);

  it('should emit filtered error events from EventBus.catchErrors', (doneCallback: jest.DoneCallback) => {
    const errorEventPredicate: CatchPredicate = (event: DispatchInputBase) => {
      return (
        (event.type === ProjectEventType.ProjectError && event.scope === Scope.Project) ||
        event instanceof LeadingMarkerErrorEventMock ||
        event instanceof TrailingMarkerErrorEventMock
      );
    };

    const expectedErrorEvents: BusEventBase[] = filteredErrorEvents.filter(errorEventPredicate);

    const caughtErrors$: Observable<BusEventBase> = eventBus.catchErrors(errorEventPredicate);
    caughtErrors$
      .pipe(
        mapToEventsSlice(),
        map((caughtEvents: BusEventBase[]) => isSameEventsSequence(caughtEvents, expectedErrorEvents))
      )
      .subscribe((sequenceIsValid: boolean) => {
        expect(sequenceIsValid).toBeTruthy();
        doneCallback();
      });

    eventBus.dispatch(new LeadingMarkerErrorEventMock());
    eventBus.dispatch(mixedEvents);
    eventBus.dispatch(new TrailingMarkerErrorEventMock());
  }, 10_000);
});
