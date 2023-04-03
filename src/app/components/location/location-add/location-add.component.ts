import { Component, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { catchError, EMPTY, finalize } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

import { MatStepperModule } from '@angular/material/stepper';

import { Location } from '@models/location.model';
import { StepperNavigationComponent } from '@components/stepper-navigation/stepper-navigation.component';
import { FileUploaderComponent } from '@components/file-uploader/file-uploader.component';
import { LocationFormNameComponent } from '@components/location/location-form-name/location-form-name.component';
import { LocationFormLightComponent } from '@components/location/location-form-light/location-form-light.component';
import { LocationFormPrivacyComponent } from '@components/location/location-form-privacy/location-form-privacy.component';
import { MatDialogModule } from '@angular/material/dialog';
import { LocationUpsertBaseComponent } from '../location-upsert-base/location-upsert-base.component';
;

@Component({
  selector: 'location-add',
  standalone: true,
  templateUrl: './location-add.component.html',
  styleUrls: ['./location-add.component.scss'],
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
    TranslateModule,
    StepperNavigationComponent,
    FileUploaderComponent,

    LocationFormNameComponent,
    LocationFormLightComponent,
    LocationFormPrivacyComponent
  ]
})
export class LocationAddComponent extends LocationUpsertBaseComponent {
  removePicture: boolean = false;

  constructor(
    private injector: Injector,
    private router: Router,
  ) {
    super(injector);
   }

  submit(): void {
    if (!this.checkFormValidity()) {
      this.errorHandler.push(this.translate.instant('general.formErrors'));
      return;
    }

    const location: Location = this.getLocationFromForm();
    const ud = this.openUploadDialog();

    this.api.createLocation(location).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error?.msg === 'IMG_NOT_VALID') this.errorHandler.push(this.translate.instant('errors.invalidImg'));

        return EMPTY;
      }),
      finalize(() => { ud.close() })
    ).subscribe((res: any) => {
      if (res.msg === 'LOCATION_CREATED') this.router.navigate([`location/${res.data.location.id}`], { replaceUrl: true });
    });
  }
}
