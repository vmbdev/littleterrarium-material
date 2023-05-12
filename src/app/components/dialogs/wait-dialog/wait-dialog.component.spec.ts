import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { MockProvider } from 'ng-mocks';

import { WaitDialogComponent } from './wait-dialog.component';

describe('WaitDialogComponent', () => {
  let component: WaitDialogComponent;
  let fixture: ComponentFixture<WaitDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {
          data: {
            message: 'Test',
            progressBar: true,
            progressValue: 0,
            finalMessage: 'Finished',
          }
        } },
        { provide: MatDialogRef, useValue: {} },
        MockProvider(TranslateService)
      ],
      imports: [
        WaitDialogComponent
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaitDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
