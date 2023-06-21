import { MockBuilder } from 'ng-mocks';

import { UserMainComponent } from './user-main.component';

describe('UserMainComponent', () => {
  beforeEach(() => {
    return MockBuilder(UserMainComponent);
  });

  it('should create', () => {
    const component = UserMainComponent;
    expect(component).toBeTruthy();
  });
});
