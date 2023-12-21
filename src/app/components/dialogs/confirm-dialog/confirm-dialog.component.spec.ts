import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslocoService } from '@ngneat/transloco';
import { MockBuilder, MockRender } from 'ng-mocks';

import { ConfirmDialogComponent } from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {

  beforeEach(() => {
    return MockBuilder(ConfirmDialogComponent)
      .provide({
        provide: MAT_DIALOG_DATA,
        useValue: {
          data: {
            title: 'Test',
            question: 'Test question',
            accept: () => true
          }
        }
      })
      .mock(TranslocoService)
  });

  it('should create', () => {
    const component = ConfirmDialogComponent;
    expect(component).toBeTruthy();
  });
});
