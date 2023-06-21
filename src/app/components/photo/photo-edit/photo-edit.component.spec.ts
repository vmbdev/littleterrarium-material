import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { MockBuilder } from 'ng-mocks';

import { PhotoEditComponent } from './photo-edit.component';

describe('PhotoEditComponent', () => {
  beforeEach(() => {
    return MockBuilder(PhotoEditComponent)
      .mock(TranslateService)
      .mock(MAT_DIALOG_DATA, { id: 100 })

  });

  it('should create', () => {
    const component = PhotoEditComponent;
    expect(component).toBeTruthy();
  });
});
