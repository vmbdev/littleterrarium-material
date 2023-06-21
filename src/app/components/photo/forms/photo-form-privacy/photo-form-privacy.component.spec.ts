import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MockBuilder, MockRender } from 'ng-mocks';

import { PhotoFormPrivacyComponent } from './photo-form-privacy.component';

describe('PhotoFormPrivacyComponent', () => {
  beforeEach(() => {
    return MockBuilder(PhotoFormPrivacyComponent)
      .keep(FormBuilder)
      .mock(TranslateService)
  });

  it('should create', () => {
    const component = PhotoFormPrivacyComponent
    expect(component).toBeTruthy();
  });
});
