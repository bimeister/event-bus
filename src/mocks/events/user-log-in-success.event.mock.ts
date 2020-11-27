import { AuthEventType } from '../enums/auth-event-type.enum.mock';
import { Scope } from '../enums/scope.enum.mock';
import { BusEventBase } from './../../lib/bus-event-base.abstract';

export class UserLogInSuccessEventMock extends BusEventBase<void> {
  public type: string = AuthEventType.LogInSuccess;
  public scope: string = Scope.Auth;
  public id: string = 'UserLogInSuccessEventMock_id';
  public fromId: string = 'UserLogInEventMock_id';
}
