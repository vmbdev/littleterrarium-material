import { MockBuilder } from 'ng-mocks';

import { UserFormEmailComponent } from './user-form-email.component';

describe('UserFormEmailComponent', () => {
  beforeEach(() => {
    return MockBuilder(UserFormEmailComponent);
  });

  it('should create', () => {
    const component = UserFormEmailComponent;
    expect(component).toBeTruthy();
  });
});
