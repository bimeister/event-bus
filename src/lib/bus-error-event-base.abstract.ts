import { DispatchInputBase } from '../internal/classes/dispatch-input-base.abstract';

export abstract class BusErrorEventBase<T = any> extends DispatchInputBase<T> {
  constructor() {
    super();
  }
}
