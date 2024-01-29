import { Component, Injector, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslocoService } from '@ngneat/transloco';

import {
  LocationFormLightComponent
} from '@components/location/forms/location-form-light/location-form-light.component';
import {
  LocationFormNameComponent
} from '@components/location/forms/location-form-name/location-form-name.component';
import {
  WaitDialogComponent
} from '@components/dialogs/wait-dialog/wait-dialog.component';
import {
  FormPrivacyComponent
} from '@components/form-privacy/form-privacy.component';
import {
  FileUploaderComponent
} from '@components/file-uploader/file-uploader.component';
import { LocationService } from '@services/location.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { Location } from '@models/location.model';

@Component({
  selector: 'ltm-location-upsert-base',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './location-upsert-base.component.html',
})
export class LocationUpsertBaseComponent {
  @ViewChild(LocationFormNameComponent)
  nameComponent!: LocationFormNameComponent;
  @ViewChild(LocationFormLightComponent)
  lightComponent!: LocationFormLightComponent;
  @ViewChild(FormPrivacyComponent)
  privacyComponent!: FormPrivacyComponent;
  @ViewChild(FileUploaderComponent)
  fileUploaderComponent!: FileUploaderComponent;

  private picture?: File;

  protected translate: TranslocoService;
  protected dialog: MatDialog;
  protected locationService: LocationService;
  protected errorHandler: ErrorHandlerService;

  constructor(injector: Injector) {
    this.translate = injector.get(TranslocoService);
    this.dialog = injector.get(MatDialog);
    this.locationService = injector.get(LocationService);
    this.errorHandler = injector.get(ErrorHandlerService);
  }

  fileChange(files: File[]) {
    if (files.length > 0) {
      this.picture = files[0];
    }
  }

  checkFormValidity(): boolean {
    const forms = [
      this.nameComponent.form,
      this.lightComponent.form,
      this.privacyComponent.form,
    ];

    return forms.every((form) => form.valid);
  }

  getLocationFromForm(): Location {
    return {
      ...this.nameComponent.form.value,
      ...this.lightComponent.form.value,
      ...this.privacyComponent.form.value,
      pictureFile: this.picture,
    } as Location;
  }

  // TODO: uploading files progress bar
  openUploadDialog(): MatDialogRef<WaitDialogComponent, any> {
    return this.dialog.open(WaitDialogComponent, {
      data: {
        message: this.translate.translate('progress-bar.uploading'),
        progressBar: true,
        progressValue: 100,
        finalMessage: this.translate.translate('general.afterUpload'),
      },
    });
  }
}
