import { MockBuilder } from 'ng-mocks';

import { UserFormBioComponent } from './user-form-bio.component';

describe('UserFormBioComponent', () => {
  beforeEach(() => {
    return MockBuilder(UserFormBioComponent);
  });

  it('should create', () => {
    const component = UserFormBioComponent;
    expect(component).toBeTruthy();
  });
});
