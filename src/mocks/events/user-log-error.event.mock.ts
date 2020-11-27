import { AuthEventType } from '../enums/auth-event-type.enum.mock';
import { Scope } from '../enums/scope.enum.mock';
import { BusErrorEventBase } from './../../lib/bus-error-event-base.abstract';

export class UserLogInErrorEventMock extends BusErrorEventBase<void> {
  public type: string = AuthEventType.AuthError;
  public scope: string = Scope.Auth;
  public id: string = 'UserLogInErrorEventMock_id';
  public fromId: string = 'UserLogInEventMock_id';
}
