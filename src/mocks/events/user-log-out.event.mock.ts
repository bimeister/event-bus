import { BusEventBase } from '../../lib/bus-event-base.abstract';
import { AuthEventType } from '../enums/auth-event-type.enum.mock';
import { Scope } from '../enums/scope.enum.mock';

export class UserLogOutEventMock extends BusEventBase<void> {
  public type: string = AuthEventType.LogOut;
  public scope: string = Scope.Auth;
  public id: string = 'UserLogOutEventMock_id';
  public fromId: string = '';
}
