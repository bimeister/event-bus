import { isNil } from '@bimeister/utilities';
import { asyncScheduler, merge, Observable, of, Subject, timer } from 'rxjs';
import { filter, observeOn, subscribeOn, take } from 'rxjs/operators';
import type { DispatchInputBase } from './../internal/classes/dispatch-input-base.abstract';
import { BusErrorEventBase } from './bus-error-event-base.abstract';
import { BusEventBase } from './bus-event-base.abstract';
import type { CatchPredicate } from './catch-predicate.type';

export class EventBus {
  private readonly currentEvent$: Subject<BusEventBase> = new Subject<BusEventBase>();
  private readonly currentError$: Subject<BusErrorEventBase> = new Subject<BusErrorEventBase>();

  public catchEvents<T>(predicate?: CatchPredicate<BusEventBase<T>>): Observable<BusEventBase<T>> {
    if (isNil(predicate) || typeof predicate !== 'function') {
      return this.currentEvent$.pipe(observeOn(asyncScheduler), subscribeOn(asyncScheduler));
    }

    return this.currentEvent$.pipe(
      observeOn(asyncScheduler),
      subscribeOn(asyncScheduler),
      filter((event: BusEventBase) => predicate(event))
    );
  }

  public catchErrors<T>(predicate?: CatchPredicate<BusErrorEventBase<T>>): Observable<BusErrorEventBase<T>> {
    if (isNil(predicate) || typeof predicate !== 'function') {
      return this.currentError$.pipe(observeOn(asyncScheduler), subscribeOn(asyncScheduler));
    }
    return this.currentError$.pipe(
      observeOn(asyncScheduler),
      subscribeOn(asyncScheduler),
      filter((event: BusErrorEventBase) => predicate(event))
    );
  }

  public catchAll<T>(): Observable<DispatchInputBase<T>>;
  public catchAll(): Observable<DispatchInputBase> {
    return merge(this.currentEvent$, this.currentError$).pipe(observeOn(asyncScheduler), subscribeOn(asyncScheduler));
  }

  public dispatch<T>(event: BusEventBase<T> | BusErrorEventBase<T>): void;
  public dispatch(event: BusEventBase | BusEventBase[] | BusErrorEventBase | BusErrorEventBase[]): void;
  public dispatch(input: DispatchInputBase | DispatchInputBase[]): void {
    timer(0, asyncScheduler)
      .pipe(observeOn(asyncScheduler), subscribeOn(asyncScheduler), take(1))
      .subscribe(() => {
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
      });
  }

  private dispatchEachItem(input: DispatchInputBase[]): void {
    of(...input)
      .pipe(observeOn(asyncScheduler), subscribeOn(asyncScheduler), take(1))
      .subscribe((inputItem: DispatchInputBase) => {
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
