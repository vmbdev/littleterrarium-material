import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { MockBuilder, MockRender } from 'ng-mocks';

import { WaitDialogComponent } from './wait-dialog.component';

describe('WaitDialogComponent', () => {
  beforeEach(() => {
    return MockBuilder(WaitDialogComponent)
    .provide({
      provide: MAT_DIALOG_DATA,
      useValue: {
        data: {
          message: 'Test',
          progressBar: true,
          progressValue: 0,
          finalMessage: 'Finished',
        }
      }
    })
    .mock(TranslateService)
  });

  it('should create', () => {
    const component = WaitDialogComponent;
    expect(component).toBeTruthy();
  });
});
