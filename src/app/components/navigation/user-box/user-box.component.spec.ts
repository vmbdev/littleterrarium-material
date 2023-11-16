import { MockBuilder } from 'ng-mocks';

import { UserBoxComponent } from './user-box.component';

describe('UserBoxComponent', () => {
  beforeEach(() => {
    return MockBuilder(UserBoxComponent);
  });

  it('should create', () => {
    const component = UserBoxComponent;
    expect(component).toBeTruthy();
  });
});
