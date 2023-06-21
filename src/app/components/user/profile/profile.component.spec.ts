import { MockBuilder } from 'ng-mocks';

import { ProfileComponent } from './profile.component';

describe('ProfileComponent', () => {
  beforeEach(() => {
    return MockBuilder(ProfileComponent);
  });

  it('should create', () => {
    const component = ProfileComponent;
    expect(component).toBeTruthy();
  });
});
