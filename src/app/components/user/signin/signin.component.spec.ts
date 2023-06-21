import { MockBuilder } from 'ng-mocks';

import { SigninComponent } from './signin.component';

describe('SigninComponent', () => {
  beforeEach(() => {
    return MockBuilder(SigninComponent);
  });

  it('should create', () => {
    const component = SigninComponent;
    expect(component).toBeTruthy();
  });
});
