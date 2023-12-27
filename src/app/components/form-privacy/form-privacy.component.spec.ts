import { MockBuilder } from 'ng-mocks';
import { FormPrivacyComponent } from './form-privacy.component';
import { TranslocoTestingModule } from '@ngneat/transloco';

describe('FormPrivacyComponent', () => {

  beforeEach(() => {
    return MockBuilder(FormPrivacyComponent)
    .keep(TranslocoTestingModule)

  });

  it('should create', () => {
    const component = FormPrivacyComponent;
    expect(component).toBeTruthy();
  });
});
