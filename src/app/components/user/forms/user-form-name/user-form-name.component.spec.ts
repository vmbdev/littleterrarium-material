import { MockBuilder } from 'ng-mocks';

import { UserFormNameComponent } from './user-form-name.component';

describe('UserFormNameComponent', () => {
  beforeEach(async () => {
    return MockBuilder(UserFormNameComponent);
  });

  it('should create', () => {
    const component = UserFormNameComponent;
    expect(component).toBeTruthy();
  });
});
