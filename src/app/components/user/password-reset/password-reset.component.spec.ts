import { MockBuilder } from 'ng-mocks';
import { PasswordResetComponent } from './password-reset.component';

describe('PasswordResetComponent', () => {
  beforeEach(async () => {
    return MockBuilder(PasswordResetComponent)
  });

  it('should create', () => {
    const component = PasswordResetComponent;
    expect(component).toBeTruthy();
  });
});
