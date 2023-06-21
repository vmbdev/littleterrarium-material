import { MockBuilder } from 'ng-mocks';

import { TaskListComponent } from './task-list.component';

describe('TaskListComponent', () => {
  beforeEach(() => {
    return MockBuilder(TaskListComponent);
  });

  it('should create', () => {
    const component = TaskListComponent;
    expect(component).toBeTruthy();
  });
});
