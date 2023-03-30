import { Component, Inject, Optional, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploaderComponent } from '@components/file-uploader/file-uploader.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatTabsModule } from '@angular/material/tabs';

import { Location } from '@models/location.model';
import { LocationFormLightComponent } from '@components/location/location-form-light/location-form-light.component';
import { LocationFormNameComponent } from '@components/location/location-form-name/location-form-name.component';
import { LocationFormPrivacyComponent } from '@components/location/location-form-privacy/location-form-privacy.component';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { ApiService } from '@services/api.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { LocationService } from '@services/location.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, EMPTY, finalize } from 'rxjs';

@Component({
  selector: 'location-edit',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatTabsModule,
    FileUploaderComponent,

    LocationFormNameComponent,
    LocationFormLightComponent,
    LocationFormPrivacyComponent
  ],
  templateUrl: './location-edit.component.html',
  styleUrls: ['./location-edit.component.scss']
})
export class LocationEditComponent {
  @ViewChild(LocationFormNameComponent) nameComponent!: LocationFormNameComponent;
  @ViewChild(LocationFormLightComponent) lightComponent!: LocationFormLightComponent;
  @ViewChild(LocationFormPrivacyComponent) privacyComponent!: LocationFormPrivacyComponent;

  picture?: File;
  removePicture: boolean = false;

  location?: Location;
  returnedLocation?: Location;

  constructor(
    private translate: TranslateService,
    private api: ApiService,
    public locationService: LocationService,
    private errorHandler: ErrorHandlerService,
    @Optional() private bottomSheetRef: MatBottomSheetRef,
    @Optional() @Inject(MAT_BOTTOM_SHEET_DATA) public editLocation: { id: number }
  ) { }

  ngOnInit(): void {
    if (this.editLocation && this.editLocation.id) {
      this.api.getLocation(this.editLocation.id).subscribe((location: Location) => {
        this.location = location;
      });
    }
  }

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

    if (this.editLocation.id) {
      data.id = this.editLocation.id;

    // this.disableNavigation = true;

      this.api.updateLocation(data, this.removePicture).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.error?.msg === 'IMG_NOT_VALID') this.errorHandler.push(this.translate.instant('errors.invalidImg'));

          return EMPTY;
        }),
        finalize(() => {
          // this.disableNavigation = false;
          if (this.editLocation && this.bottomSheetRef) this.bottomSheetRef.dismiss(this.returnedLocation);
        })
      ).subscribe((res: any) => {
        if ((res.msg === 'LOCATION_UPDATED') && this.editLocation && this.bottomSheetRef) {
            this.returnedLocation = res.data.location;
        }
      });
    }
  }
}
