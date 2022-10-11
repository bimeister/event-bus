import { Scope } from '../enums/scope.enum.mock';
import { BusErrorEventBase } from './../../lib/bus-error-event-base.abstract';

export class LeadingMarkerErrorEventMock extends BusErrorEventBase<void> {
  public type: string = 'leading marker';
  public scope: string = Scope.Testing;
  public id: string = 'LeadingMarkerErrorEventMock_id';
  public fromId: string = '';
}
