import type { DispatchInputBase } from './../internal/classes/dispatch-input-base.abstract';

export type CatchPredicate<T = any> = (event: DispatchInputBase<T>) => boolean;
