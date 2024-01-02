import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslocoModule } from '@ngneat/transloco';
import {
  MockBuilder,
  MockRender,
  MockedComponentFixture,
  ngMocks,
} from 'ng-mocks';

import { WaitDialogComponent } from './wait-dialog.component';
import { getTranslocoModule } from 'src/app/tests/transloco.module';

describe('WaitDialogComponent', () => {
  let component: WaitDialogComponent;
  let fixture: MockedComponentFixture<WaitDialogComponent>;

  beforeEach(() =>
    MockBuilder([WaitDialogComponent, TranslocoModule])
      .provide({
        provide: MAT_DIALOG_DATA,
        useValue: {
          message: 'Test message',
          progressBar: true,
          progressValue: 50,
          finalMessage: 'Test ended',
        },
      })
      .provide(getTranslocoModule().providers ?? [])
  );

  beforeEach(() => {
    fixture = MockRender(WaitDialogComponent);
    component = fixture.point.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should receive MAT_DIALOG_DATA', () => {
    const data = ngMocks.get(fixture.debugElement, MAT_DIALOG_DATA);

    expect(data.message).toBe('Test message');
    expect(data.progressBar).toBeTrue();
    expect(data.progressValue).toBe(50);
    expect(data.finalMessage).toBe('Test ended');
  });

  it('should render spinner when there is no progress bar', () => {
    fixture.componentInstance.data.progressBar = false;
    fixture.detectChanges();

    const spinner = ngMocks.find(
      fixture.debugElement,
      'mat-spinner.wait-dialog__spinner'
    );

    expect(spinner).toBeTruthy();
  });

  it('should render a final message on completion', () => {
    fixture.componentInstance.data.progressValue = 100;
    fixture.detectChanges();

    const msg = ngMocks.find(
      fixture.debugElement,
      'div.wait-dialog__finalmsg'
    );

    expect(msg.nativeNode.innerText).toBe('Test ended');
  });
});
