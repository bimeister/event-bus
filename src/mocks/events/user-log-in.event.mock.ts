import { AuthEventType } from '../enums/auth-event-type.enum.mock';
import { Scope } from '../enums/scope.enum.mock';
import type { UserModel } from '../models/user.model.mock';
import { BusEventBase } from './../../lib/bus-event-base.abstract';

export class UserLogInEventMock extends BusEventBase<UserModel> {
  public type: string = AuthEventType.LogIn;
  public scope: string = Scope.Auth;
  public id: string = 'UserLogInEventMock_id';
  public fromId: string = '';

  public payload: UserModel = {
    id: 'userId',
    name: 'User Name'
  };
}
