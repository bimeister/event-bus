import { BusEventBase } from '../../lib/bus-event-base.abstract';
import { AuthEventType } from '../enums/auth-event-type.enum.mock';
import { Scope } from '../enums/scope.enum.mock';

export class UserLogOutSuccessEventMock extends BusEventBase<void> {
  public type: string = AuthEventType.LogOutSuccess;
  public scope: string = Scope.Auth;
  public id: string = 'UserLogOutSuccessEventMock_id';
  public fromId: string = '';
}
