import { isNil } from '@bimeister/utilities';
import { merge, Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import type { DispatchInputBase } from './../internal/classes/dispatch-input-base.abstract';
import { BusErrorEventBase } from './bus-error-event-base.abstract';
import { BusEventBase } from './bus-event-base.abstract';
import type { CatchPredicate } from './catch-predicate.type';

export class EventBus {
  private readonly currentEvent$: Subject<BusEventBase> = new Subject<BusEventBase>();
  private readonly currentError$: Subject<BusErrorEventBase> = new Subject<BusErrorEventBase>();

  public catchEvents<T>(): Observable<BusEventBase<T>>;
  public catchEvents(): Observable<BusEventBase>;
  public catchEvents(predicate: CatchPredicate<BusEventBase>): Observable<BusEventBase>;
  public catchEvents(predicate?: CatchPredicate<BusEventBase>): Observable<BusEventBase> {
    if (isNil(predicate) || typeof predicate !== 'function') {
      return this.currentEvent$;
    }
    return this.currentEvent$.pipe(filter((event: BusEventBase) => predicate(event)));
  }

  public catchErrors<T>(): Observable<BusErrorEventBase<T>>;
  public catchErrors(): Observable<BusErrorEventBase>;
  public catchErrors(predicate: CatchPredicate<BusErrorEventBase>): Observable<BusErrorEventBase>;
  public catchErrors(predicate?: CatchPredicate<BusErrorEventBase>): Observable<BusErrorEventBase> {
    if (isNil(predicate) || typeof predicate !== 'function') {
      return this.currentError$;
    }
    return this.currentError$.pipe(filter((event: BusErrorEventBase) => predicate(event)));
  }

  public catchAll<T>(): Observable<DispatchInputBase<T>>;
  public catchAll(): Observable<DispatchInputBase> {
    return merge(this.currentEvent$, this.currentError$);
  }

  public dispatch<T>(event: BusEventBase<T>): void;
  public dispatch(event: BusEventBase): void;
  public dispatch(events: BusEventBase[]): void;
  public dispatch<T>(error: BusErrorEventBase<T>): void;
  public dispatch(error: BusErrorEventBase): void;
  public dispatch(errors: BusErrorEventBase[]): void;
  public dispatch(input: DispatchInputBase | DispatchInputBase[]): void {
    if (Array.isArray(input)) {
      this.dispatchEachItem(input);
      return;
    }

    if (EventBus.isError(input)) {
      this.currentError$.next(input);
    }

    if (EventBus.isEvent(input)) {
      this.currentEvent$.next(input);
      return;
    }
  }

  private dispatchEachItem(input: DispatchInputBase[]): void {
    input.forEach((inputItem: DispatchInputBase) => {
      if (!EventBus.isDispatchInput(inputItem)) {
        return;
      }
      this.dispatch(inputItem);
    });
  }

  private static isDispatchInput(input: unknown): input is DispatchInputBase {
    return EventBus.isEvent(input) || EventBus.isError(input);
  }

  private static isEvent(input: unknown): input is BusEventBase {
    return input instanceof BusEventBase;
  }

  private static isError(input: unknown): input is BusErrorEventBase {
    return input instanceof BusErrorEventBase;
  }
}
