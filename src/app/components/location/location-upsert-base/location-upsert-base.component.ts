import { Component, Injector, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { LocationFormLightComponent } from '@components/location/forms/location-form-light/location-form-light.component';
import { LocationFormNameComponent } from '@components/location/forms/location-form-name/location-form-name.component';
import { LocationFormPrivacyComponent } from '@components/location/forms/location-form-privacy/location-form-privacy.component';
import { WaitDialogComponent } from '@components/dialogs/wait-dialog/wait-dialog.component';
import { Location } from '@models/location.model';
import { ApiService } from '@services/api.service';
import { LocationService } from '@services/location.service';
import { ErrorHandlerService } from '@services/error-handler.service';

@Component({
  selector: 'location-upsert-base',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './location-upsert-base.component.html',
  styleUrls: ['./location-upsert-base.component.scss']
})
export class LocationUpsertBaseComponent {
  @ViewChild(LocationFormNameComponent) nameComponent!: LocationFormNameComponent;
  @ViewChild(LocationFormLightComponent) lightComponent!: LocationFormLightComponent;
  @ViewChild(LocationFormPrivacyComponent) privacyComponent!: LocationFormPrivacyComponent;

  picture?: File;
  
  protected translate: TranslateService;
  protected dialog: MatDialog;
  protected api: ApiService;
  protected locationService: LocationService;
  protected errorHandler: ErrorHandlerService;

  constructor(injector: Injector) {
    this.translate = injector.get(TranslateService);
    this.dialog = injector.get(MatDialog);
    this.api = injector.get(ApiService);
    this.locationService = injector.get(LocationService);
    this.errorHandler = injector.get(ErrorHandlerService);
  }

  fileChange(files: File[]) {
    if (files.length > 0) {
      this.picture = files[0]
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
      pictureFile: this.picture
    } as Location;
  }

  // TODO: uploading files progress bar
  openUploadDialog(): MatDialogRef<WaitDialogComponent, any> {
    return this.dialog.open(WaitDialogComponent, {
      data: {
        message: this.translate.instant('progress-bar.uploading'),
        progressBar: true,
        progressValue: 100,
        finalMessage: this.translate.instant('general.afterUpload')
      },
    });
  }
}
