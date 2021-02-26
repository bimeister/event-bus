import { DispatchInputBase } from '../internal/classes/dispatch-input-base.abstract';
import type { BusErrorEventBase } from './bus-error-event-base.abstract';

export abstract class BusEventBase<T = any> extends DispatchInputBase<T> {
  public getError?(): BusErrorEventBase<T>;
}
