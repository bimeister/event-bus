import { Scope } from '../enums/scope.enum.mock';
import { BusEventBase } from './../../lib/bus-event-base.abstract';

export class LeadingMarkerEventMock extends BusEventBase<void> {
  public type: string = 'leading marker';
  public scope: string = Scope.Testing;
  public id: string = 'LeadingMarkerEventMock_id';
  public fromId: string = '';
}
