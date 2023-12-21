import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslocoService } from '@ngneat/transloco';
import { MockBuilder } from 'ng-mocks';

import { PhotoEditComponent } from './photo-edit.component';

describe('PhotoEditComponent', () => {
  beforeEach(() => {
    return MockBuilder(PhotoEditComponent)
      .mock(TranslocoService)
      .mock(MAT_DIALOG_DATA, { id: 100 })

  });

  it('should create', () => {
    const component = PhotoEditComponent;
    expect(component).toBeTruthy();
  });
});
