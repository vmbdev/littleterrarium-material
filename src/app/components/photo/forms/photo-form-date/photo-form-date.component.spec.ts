import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MockBuilder, MockRender } from 'ng-mocks';

import { PhotoFormDateComponent } from './photo-form-date.component';

describe('PhotoFormDateComponent', () => {
  beforeEach(() => {
    return MockBuilder(PhotoFormDateComponent)
      .mock(TranslateService)
      .keep(FormBuilder)
  });

  it('should create', () => {
    const component = PhotoFormDateComponent;
    expect(component).toBeTruthy();
  });
});
