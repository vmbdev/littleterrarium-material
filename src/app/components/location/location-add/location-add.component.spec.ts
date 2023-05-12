import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { MockComponents, MockProvider, MockProviders } from 'ng-mocks';
import { ApiService } from '@services/api.service';

import { LocationAddComponent } from './location-add.component';
import { LocationFormNameComponent } from '../forms/location-form-name/location-form-name.component';
import { FileUploaderComponent } from '@components/file-uploader/file-uploader.component';
import { LocationFormLightComponent } from '../forms/location-form-light/location-form-light.component';
import { LocationFormPrivacyComponent } from '../forms/location-form-privacy/location-form-privacy.component';
import { StepperNavigationComponent } from '@components/stepper-navigation/stepper-navigation.component';
import { AuthService } from '@services/auth.service';
import { LocationService } from '@services/location.service';
import { ErrorHandlerService } from '@services/error-handler.service';

describe('LocationAddComponent', () => {
  let component: LocationAddComponent;
  let fixture: ComponentFixture<LocationAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LocationAddComponent,
        RouterTestingModule,
        ...MockComponents(
          FileUploaderComponent,
          LocationFormNameComponent,
          LocationFormLightComponent,
          LocationFormPrivacyComponent,
          StepperNavigationComponent
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
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
