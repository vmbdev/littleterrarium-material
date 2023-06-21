import { MockBuilder } from 'ng-mocks';

import { UserEditComponent } from './user-edit.component';

describe('UserEditComponent', () => {
  beforeEach(() => {
    return MockBuilder(UserEditComponent);
  });

  it('should create', () => {
    const component = UserEditComponent;
    expect(component).toBeTruthy();
  });
});
