import { MockBuilder } from 'ng-mocks';

import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  beforeEach(() => {
    return MockBuilder(RegisterComponent);
  });

  it('should create', () => {
    const component = RegisterComponent;
    expect(component).toBeTruthy();
  });
});
