import { MockBuilder } from 'ng-mocks';

import { LogoutComponent } from './logout.component';

describe('LogoutComponent', () => {
  beforeEach(() => {
    return MockBuilder(LogoutComponent);
  });

  it('should create', () => {
    const component = LogoutComponent;
    expect(component).toBeTruthy();
  });
});
