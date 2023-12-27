import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TranslocoModule } from '@ngneat/transloco';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';

import { ConfirmDialogComponent } from './confirm-dialog.component';
import { getTranslocoModule } from 'src/app/tests/transloco.module';

fdescribe('ConfirmDialogComponent', () => {
  beforeEach(() => {
    return MockBuilder([
      ConfirmDialogComponent,
      TranslocoModule,
      MatDialogModule
    ])
      .provide({
        provide: MAT_DIALOG_DATA,
        useValue: {
          title: 'Test title',
          question: ['text1', 'text2'],
          accept: () => true,
        },
      })
      .provide(getTranslocoModule().providers ?? []);
  });

  it('should create', () => {
    const component = MockRender(ConfirmDialogComponent);
    expect(component).toBeTruthy();
  });

  it('should receive MAT_DIALOG_DATA', () => {
    const component = MockRender(ConfirmDialogComponent);
    const data = ngMocks.get(component.debugElement, MAT_DIALOG_DATA);
    
    expect(data.title).toBe('Test title');
    expect(data.question[0]).toBe('text1');
    expect(data.question[1]).toBe('text2');
  });
  
  it('should do the same when clicked and when accepted', () => {
    const component = MockRender(ConfirmDialogComponent);
    const data = ngMocks.get(component.debugElement, MAT_DIALOG_DATA);
    const dataAccept = spyOn(data, 'accept');

    component.componentInstance.accept();
    expect(dataAccept).toHaveBeenCalled();
  })

  it('should render the HTML', () => {
    const component = MockRender(ConfirmDialogComponent);
    const h1 = ngMocks.find(component.debugElement, 'h1');
    const questions = ngMocks.reveal(component, ['mat-dialog-content']);
    const questionsHTML = ngMocks.formatHtml(questions.nativeNode);
    // const buttonAccept = ngMocks.reveal(component, ['#buttonAccept']);
    
    
    expect(questionsHTML).toBe('<p>text1</p><p>text2</p>');
    expect(h1.nativeElement.innerHTML).toBe('Test title');
  })
});
