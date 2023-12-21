import { FormBuilder } from '@angular/forms';
import { TranslocoService } from '@ngneat/transloco';
import { MockBuilder, MockRender } from 'ng-mocks';

import { PhotoFormDescriptionComponent } from './photo-form-description.component';

describe('PhotoFormDescriptionComponent', () => {
  beforeEach(() => {
    return MockBuilder(PhotoFormDescriptionComponent)
      .keep(FormBuilder)
      .mock(TranslocoService)
  });

  it('should create', () => {
    const component = PhotoFormDescriptionComponent
    expect(component).toBeTruthy();
  });
});
