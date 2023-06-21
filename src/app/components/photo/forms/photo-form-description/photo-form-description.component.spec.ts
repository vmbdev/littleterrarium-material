import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MockBuilder, MockRender } from 'ng-mocks';

import { PhotoFormDescriptionComponent } from './photo-form-description.component';

describe('PhotoFormDescriptionComponent', () => {
  beforeEach(() => {
    return MockBuilder(PhotoFormDescriptionComponent)
      .keep(FormBuilder)
      .mock(TranslateService)
  });

  it('should create', () => {
    const component = PhotoFormDescriptionComponent
    expect(component).toBeTruthy();
  });
});
