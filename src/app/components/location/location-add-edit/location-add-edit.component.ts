import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { catchError, EMPTY, finalize } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { MatStepperModule } from '@angular/material/stepper';

import { Location } from '@models/location.model';
import { StepperNavigationComponent } from '@components/stepper-navigation/stepper-navigation.component';
import { FileUploaderComponent } from '@components/file-uploader/file-uploader.component';
import { LocationService } from '@services/location.service';
import { ApiService } from '@services/api.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { LocationFormNameComponent } from '@components/location/location-form-name/location-form-name.component';
import { LocationFormLightComponent } from '@components/location/location-form-light/location-form-light.component';
import { LocationFormPrivacyComponent } from '@components/location/location-form-privacy/location-form-privacy.component';
;

@Component({
  selector: 'location-add-edit',
  standalone: true,
  templateUrl: './location-add-edit.component.html',
  styleUrls: ['./location-add-edit.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
  imports: [
    CommonModule,
    MatStepperModule,
    TranslateModule,
    StepperNavigationComponent,
    FileUploaderComponent,

    LocationFormNameComponent,
    LocationFormLightComponent,
    LocationFormPrivacyComponent
  ]
})
export class LocationAddEditComponent {
  @ViewChild(LocationFormNameComponent) nameComponent!: LocationFormNameComponent;
  @ViewChild(LocationFormLightComponent) lightComponent!: LocationFormLightComponent;
  @ViewChild(LocationFormPrivacyComponent) privacyComponent!: LocationFormPrivacyComponent;

  picture?: File;
  removePicture: boolean = false;

  constructor(
    private router: Router,
    private translate: TranslateService,
    private api: ApiService,
    public locationService: LocationService,
    private errorHandler: ErrorHandlerService,
  ) { }

  fileChange(files: File[]) {
    if (files.length > 0) {
      this.picture = files[0]
    }
  }

  submit(): void {
    const data: Location = {
      ...this.nameComponent.form.value,
      ...this.lightComponent.form.value,
      ...this.privacyComponent.form.value,
      pictureFile: this.picture
    } as Location;

    // this.disableNavigation = true;

    this.api.createLocation(data).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error?.msg === 'IMG_NOT_VALID') this.errorHandler.push(this.translate.instant('errors.invalidImg'));

        return EMPTY;
      }),
      finalize(() => {
        // this.disableNavigation = false;
      })
    ).subscribe((res: any) => {
      if (res.msg === 'LOCATION_CREATED') this.router.navigate([`location/${res.data.location.id}`]);
    });
  }
}
