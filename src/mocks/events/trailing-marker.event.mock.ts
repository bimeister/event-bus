import { Scope } from '../enums/scope.enum.mock';
import { BusEventBase } from './../../lib/bus-event-base.abstract';

export class TrailingMarkerEventMock extends BusEventBase<void> {
  public type: string = 'trailing marker';
  public scope: string = Scope.Testing;
  public id: string = 'TrailingMarkerEventMock_id';
  public fromId: string = '';
}
