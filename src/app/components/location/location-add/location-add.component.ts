import { Component, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatDialogModule } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { catchError, EMPTY, finalize } from 'rxjs';
import { TranslocoModule } from '@ngneat/transloco';

import { StepperNavigationComponent } from '@components/stepper-navigation/stepper-navigation.component';
import { FileUploaderComponent } from '@components/file-uploader/file-uploader.component';
import { LocationFormNameComponent } from '@components/location/forms/location-form-name/location-form-name.component';
import { LocationFormLightComponent } from '@components/location/forms/location-form-light/location-form-light.component';
import { LocationUpsertBaseComponent } from '@components/location/location-upsert-base/location-upsert-base.component';
import { FormPrivacyComponent } from '@components/form-privacy/form-privacy.component';
import { Location } from '@models/location.model';

@Component({
  selector: 'ltm-location-add',
  standalone: true,
  templateUrl: './location-add.component.html',
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
  imports: [
    CommonModule,
    MatStepperModule,
    MatDialogModule,
    TranslocoModule,
    StepperNavigationComponent,
    FileUploaderComponent,
    LocationFormNameComponent,
    LocationFormLightComponent,
    FormPrivacyComponent,
  ],
})
export class LocationAddComponent extends LocationUpsertBaseComponent {
  constructor(
    private readonly injector: Injector,
    private readonly router: Router,
  ) {
    super(injector);
  }

  submit(): void {
    if (!this.checkFormValidity()) {
      this.errorHandler.push(this.translate.translate('general.formErrors'));
      return;
    }

    const location: Location = this.getLocationFromForm();
    const ud = this.openUploadDialog();

    this.locationService
      .create(location)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.error?.msg === 'IMG_NOT_VALID') {
            this.errorHandler.push(
              this.translate.translate('errors.invalidImg'),
            );
          }

          return EMPTY;
        }),
        finalize(() => {
          ud.close();
        }),
      )
      .subscribe((location: Location) => {
        this.router.navigate([`location/${location.id}`], { replaceUrl: true });
      });
  }
}
