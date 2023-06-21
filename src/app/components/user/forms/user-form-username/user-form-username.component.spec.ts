import { MockBuilder } from 'ng-mocks';

import { UserFormUsernameComponent } from './user-form-username.component';

describe('UserFormUsernameComponent', () => {
  beforeEach(() => {
    return MockBuilder(UserFormUsernameComponent);
  });

  it('should create', () => {
    const component = UserFormUsernameComponent;
    expect(component).toBeTruthy();
  });
});
