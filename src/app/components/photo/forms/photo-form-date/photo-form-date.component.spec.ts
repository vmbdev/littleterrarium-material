import { FormBuilder } from '@angular/forms';
import { TranslocoService } from '@ngneat/transloco';
import { MockBuilder, MockRender } from 'ng-mocks';

import { PhotoFormDateComponent } from './photo-form-date.component';

describe('PhotoFormDateComponent', () => {
  beforeEach(() => {
    return MockBuilder(PhotoFormDateComponent)
      .mock(TranslocoService)
      .keep(FormBuilder)
  });

  it('should create', () => {
    const component = PhotoFormDateComponent;
    expect(component).toBeTruthy();
  });
});
