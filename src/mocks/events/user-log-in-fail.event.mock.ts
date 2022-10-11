import { BusEventBase } from '../../lib/bus-event-base.abstract';
import { AuthEventType } from '../enums/auth-event-type.enum.mock';
import { Scope } from '../enums/scope.enum.mock';

export class UserLogInFailEventMock extends BusEventBase<void> {
  public type: string = AuthEventType.LogInFail;
  public scope: string = Scope.Auth;
  public id: string = 'UserLogInFailEventMock_id';
  public fromId: string = 'UserLogInEventMock_id';
}
