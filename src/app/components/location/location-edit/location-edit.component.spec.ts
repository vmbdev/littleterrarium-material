import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FileUploaderComponent } from '@components/file-uploader/file-uploader.component';
import { StepperNavigationComponent } from '@components/stepper-navigation/stepper-navigation.component';
import { TranslateService } from '@ngx-translate/core';
import { MockComponents, MockProviders } from 'ng-mocks';

import { ApiService } from '@services/api.service';
import { AuthService } from '@services/auth.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { LocationService } from '@services/location.service';
import { LocationFormLightComponent } from '../forms/location-form-light/location-form-light.component';
import { LocationFormNameComponent } from '../forms/location-form-name/location-form-name.component';
import { LocationFormPrivacyComponent } from '../forms/location-form-privacy/location-form-privacy.component';
import { LocationUpsertBaseComponent } from '../location-upsert-base/location-upsert-base.component';

import { LocationEditComponent } from './location-edit.component';

describe('LocationEditComponent', () => {
  let component: LocationEditComponent;
  let fixture: ComponentFixture<LocationEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LocationEditComponent,
        MatDialogModule,
        BrowserAnimationsModule,
        ...MockComponents(
          FileUploaderComponent,
          LocationFormNameComponent,
          LocationFormLightComponent,
          LocationFormPrivacyComponent,
          StepperNavigationComponent,
          LocationUpsertBaseComponent
        )
      ],
      providers: [
        ...MockProviders(
          ApiService,
          AuthService,
          LocationService,
          ErrorHandlerService,
          TranslateService
        ),
        { provide: MAT_DIALOG_DATA, useValue: { editLocation: { id: 1 } }},
        { provide: MatDialogRef, useValue: {} },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
