import { Scope } from '../enums/scope.enum.mock';
import { BusErrorEventBase } from './../../lib/bus-error-event-base.abstract';

export class TrailingMarkerErrorEventMock extends BusErrorEventBase<void> {
  public type: string = 'trailing marker';
  public scope: string = Scope.Testing;
  public id: string = 'TrailingMarkerErrorEventMock_id';
  public fromId: string = '';
}
