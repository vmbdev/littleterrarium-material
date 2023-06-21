import { MockBuilder } from 'ng-mocks';

import { UserFormPasswordComponent } from './user-form-password.component';

describe('UserFormPasswordComponent', () => {
  beforeEach(() => {
    return MockBuilder(UserFormPasswordComponent);
  });

  it('should create', () => {
    const component = UserFormPasswordComponent;
    expect(component).toBeTruthy();
  });
});
