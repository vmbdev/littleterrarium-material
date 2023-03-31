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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { WaitDialogComponent } from '@components/dialogs/wait-dialog/wait-dialog.component';
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
export class LocationAddComponent {
  @ViewChild(LocationFormNameComponent) nameComponent!: LocationFormNameComponent;
  @ViewChild(LocationFormLightComponent) lightComponent!: LocationFormLightComponent;
  @ViewChild(LocationFormPrivacyComponent) privacyComponent!: LocationFormPrivacyComponent;

  picture?: File;
  removePicture: boolean = false;
  uploadDialogRef?: any;

  constructor(
    private router: Router,
    private translate: TranslateService,
    private api: ApiService,
    public locationService: LocationService,
    private errorHandler: ErrorHandlerService,
    private dialog: MatDialog
  ) { }

  fileChange(files: File[]) {
    if (files.length > 0) {
      this.picture = files[0]
    }
  }

  // TODO: uploading files progress bar
  openUploadDialog() {
    this.uploadDialogRef = this.dialog.open(WaitDialogComponent, {
      data: {
        message: this.translate.instant('progress-bar.uploading'),
        progressBar: true,
        progressValue: 100,
        finalMessage: this.translate.instant('general.afterUpload')
      },
    });
  }

  // TODO: refactor?
  checkFormValidity(): boolean {
    const forms = [
      this.nameComponent.form,
      this.lightComponent.form,
      this.privacyComponent.form,
    ];

    return forms.every((form) => form.valid);
  }

  submit(): void {
    if (!this.checkFormValidity()) {
      this.errorHandler.push(this.translate.instant('general.formErrors'));
      return;
    }

    const data: Location = {
      ...this.nameComponent.form.value,
      ...this.lightComponent.form.value,
      ...this.privacyComponent.form.value,
      pictureFile: this.picture
    } as Location;

    this.openUploadDialog();

    this.api.createLocation(data).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error?.msg === 'IMG_NOT_VALID') this.errorHandler.push(this.translate.instant('errors.invalidImg'));

        return EMPTY;
      }),
      finalize(() => {
        if (this.uploadDialogRef) this.uploadDialogRef.close();
      })
    ).subscribe((res: any) => {
      if (res.msg === 'LOCATION_CREATED') this.router.navigate([`location/${res.data.location.id}`], { replaceUrl: true });
    });
  }
}
