import { BusErrorEventBase } from '../../lib/bus-error-event-base.abstract';
import { ProjectEventType } from '../enums/project-event-type.enum.mock';
import { Scope } from '../enums/scope.enum.mock';

export class ProjectErrorEventMock extends BusErrorEventBase<void> {
  public type: string = ProjectEventType.ProjectError;
  public scope: string = Scope.Project;
  public id: string = 'ProjectErrorEventMock_id';
  public fromId: string = '';
}
