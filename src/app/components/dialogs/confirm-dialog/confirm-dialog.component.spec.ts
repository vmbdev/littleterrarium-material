import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslocoModule } from '@ngneat/transloco';
import {
  MockBuilder,
  MockRender,
  MockedComponentFixture,
  ngMocks,
} from 'ng-mocks';

import { ConfirmDialogComponent } from './confirm-dialog.component';
import { getTranslocoModule } from 'src/app/tests/transloco.module';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: MockedComponentFixture<ConfirmDialogComponent>;

  beforeEach(() =>
    MockBuilder([ConfirmDialogComponent, TranslocoModule])
      .provide({
        provide: MAT_DIALOG_DATA,
        useValue: {
          title: 'Test title',
          question: ['text1', 'text2'],
          accept: () => true,
        },
      })
      .provide(getTranslocoModule().providers ?? [])
  );

  beforeEach(() => {
    fixture = MockRender(ConfirmDialogComponent);
    component = fixture.point.componentInstance;
  });

  it('should create', () => {
    // const component = MockRender(ConfirmDialogComponent);
    expect(component).toBeTruthy();
  });

  it('should receive MAT_DIALOG_DATA', () => {
    const data = ngMocks.get(fixture.debugElement, MAT_DIALOG_DATA);

    expect(data.title).toBe('Test title');
    expect(data.question[0]).toBe('text1');
    expect(data.question[1]).toBe('text2');
  });

  it('should do the same when clicked and when accepted', () => {
    const data = ngMocks.get(fixture.debugElement, MAT_DIALOG_DATA);
    const dataAccept = spyOn(data, 'accept');

    fixture.componentInstance.accept();
    expect(dataAccept).toHaveBeenCalled();
  });

  it('should render the HTML', () => {
    const questions = ngMocks.find(['data-testid', 'questions']);

    expect(ngMocks.formatText(questions)).toBe('text1text2');
  });
});
