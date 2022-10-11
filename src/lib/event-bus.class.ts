import { isNil, Nullable, observeOnOptional, subscribeOnOptional } from '@bimeister/utilities';
import { asyncScheduler, merge, NEVER, Observable, of, SchedulerLike, Subject, timer } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import type { DispatchInputBase } from './../internal/classes/dispatch-input-base.abstract';
import { BusErrorEventBase } from './bus-error-event-base.abstract';
import { BusEventBase } from './bus-event-base.abstract';
import type { CatchPredicate } from './catch-predicate.type';

interface CatcherArguments<T> {
  predicate?: CatchPredicate<BusEventBase<T>>;
  scheduler?: Nullable<SchedulerLike>;
}
type CatcherArgument<T> = Nullable<SchedulerLike> | CatchPredicate<BusEventBase<T>>;

export class EventBus {
  private readonly currentEvent$: Subject<BusEventBase> = new Subject<BusEventBase>();
  private readonly currentError$: Subject<BusErrorEventBase> = new Subject<BusErrorEventBase>();

  public catchEvents<T>(
    predicate?: CatchPredicate<BusEventBase<T>>,
    scheduler?: Nullable<SchedulerLike>
  ): Observable<BusEventBase<T>>;
  public catchEvents<T>(scheduler?: Nullable<SchedulerLike>): Observable<BusEventBase<T>>;
  public catchEvents<T>(...inputArguments: CatcherArgument<T>[]): Observable<BusEventBase<T>> {
    if (!Array.isArray(inputArguments)) {
      return NEVER;
    }

    const { predicate, scheduler }: CatcherArguments<T> = EventBus.getCatcherArguments<T>(inputArguments);

    if (isNil(predicate) || typeof predicate !== 'function') {
      return this.currentEvent$.pipe(observeOnOptional(scheduler), subscribeOnOptional(scheduler));
    }

    return this.currentEvent$.pipe(
      observeOnOptional(scheduler),
      subscribeOnOptional(scheduler),
      filter((event: BusEventBase) => predicate(event))
    );
  }

  public catchErrors<T>(
    predicate?: CatchPredicate<BusErrorEventBase<T>>,
    scheduler?: Nullable<SchedulerLike>
  ): Observable<BusEventBase<T>>;
  public catchErrors<T>(scheduler?: Nullable<SchedulerLike>): Observable<BusEventBase<T>>;
  public catchErrors<T>(...inputArguments: CatcherArgument<T>[]): Observable<BusErrorEventBase<T>> {
    if (!Array.isArray(inputArguments)) {
      return NEVER;
    }

    const { predicate, scheduler }: CatcherArguments<T> = EventBus.getCatcherArguments<T>(inputArguments);

    if (isNil(predicate) || typeof predicate !== 'function') {
      return this.currentError$.pipe(observeOnOptional(scheduler), subscribeOnOptional(scheduler));
    }

    return this.currentError$.pipe(
      observeOnOptional(scheduler),
      subscribeOnOptional(scheduler),
      filter((event: BusErrorEventBase) => predicate(event))
    );
  }

  public catchAll<T>(scheduler?: Nullable<SchedulerLike>): Observable<DispatchInputBase<T>>;
  public catchAll(scheduler: Nullable<SchedulerLike> = asyncScheduler): Observable<DispatchInputBase> {
    return merge(this.currentEvent$, this.currentError$).pipe(
      observeOnOptional(scheduler),
      subscribeOnOptional(scheduler)
    );
  }

  public dispatch<T>(event: BusEventBase<T> | BusErrorEventBase<T>, scheduler?: Nullable<SchedulerLike>): void;
  public dispatch(
    event: BusEventBase | BusEventBase[] | BusErrorEventBase | BusErrorEventBase[],
    scheduler?: Nullable<SchedulerLike>
  ): void;
  public dispatch(
    input: DispatchInputBase | DispatchInputBase[],
    scheduler: Nullable<SchedulerLike> = asyncScheduler
  ): void {
    timer(0, asyncScheduler)
      .pipe(observeOnOptional(scheduler), subscribeOnOptional(scheduler), take(1))
      .subscribe(() => {
        if (Array.isArray(input)) {
          this.dispatchEachItem(input);
          return;
        }

        if (EventBus.isError(input)) {
          this.currentError$.next(input);
          return;
        }

        if (EventBus.isEvent(input)) {
          this.currentEvent$.next(input);
          return;
        }
      });
  }

  private dispatchEachItem(input: DispatchInputBase[], scheduler: Nullable<SchedulerLike> = asyncScheduler): void {
    of(...input)
      .pipe(observeOnOptional(scheduler), subscribeOnOptional(scheduler), take(1))
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

  private static isSchedulerLike(input: unknown): input is SchedulerLike {
    const schedulerKeys: Set<keyof SchedulerLike> = new Set<keyof SchedulerLike>(['schedule', 'now']);

    if (typeof input !== 'object' || isNil(input)) {
      return false;
    }

    return Array.from(schedulerKeys).every((key: string) => key in input);
  }

  private static getCatcherArguments<T>(inputArguments: CatcherArgument<T>[]): CatcherArguments<T> {
    return inputArguments.reduce((accumulatedValue: CatcherArguments<T>, currentArgument: CatcherArgument<T>) => {
      if (EventBus.isSchedulerLike(currentArgument)) {
        return {
          scheduler: currentArgument,
          ...accumulatedValue
        };
      }

      if (typeof currentArgument === 'function') {
        return {
          predicate: currentArgument,
          ...accumulatedValue
        };
      }

      return accumulatedValue;
    }, {});
  }
}
