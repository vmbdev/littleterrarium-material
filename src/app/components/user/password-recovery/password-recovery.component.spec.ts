import { PasswordRecoveryComponent } from './password-recovery.component';
import { MockBuilder } from 'ng-mocks';
import { getTranslocoModule } from 'src/app/tests/transloco.module';
import { AuthService } from '@services/auth/auth.service';

describe('PasswordRecoveryComponent', () => {
  beforeEach(async () => {
    return MockBuilder(PasswordRecoveryComponent)
      .keep(getTranslocoModule())
      .mock(AuthService)
  });

  it('should create', () => {
    const component = PasswordRecoveryComponent;
    expect(component).toBeTruthy();
  });
});
