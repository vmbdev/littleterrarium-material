import { Component, Inject, Injector, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploaderComponent } from '@components/file-uploader/file-uploader.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatTabsModule } from '@angular/material/tabs';

import { Location } from '@models/location.model';
import { LocationFormLightComponent } from '@components/location/forms/location-form-light/location-form-light.component';
import { LocationFormNameComponent } from '@components/location/forms/location-form-name/location-form-name.component';
import { LocationFormPrivacyComponent } from '@components/location/forms/location-form-privacy/location-form-privacy.component';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, EMPTY, finalize } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { LocationUpsertBaseComponent } from '../location-upsert-base/location-upsert-base.component';

@Component({
  selector: 'location-edit',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatTabsModule,
    MatButtonModule,
    FileUploaderComponent,

    LocationFormNameComponent,
    LocationFormLightComponent,
    LocationFormPrivacyComponent
  ],
  templateUrl: './location-edit.component.html',
  styleUrls: ['./location-edit.component.scss']
})
export class LocationEditComponent extends LocationUpsertBaseComponent {
  removePicture: boolean = false;

  location?: Location;
  returnedLocation?: Location;

  constructor(
    private injector: Injector,
    @Optional() private bottomSheetRef: MatBottomSheetRef,
    @Optional() @Inject(MAT_BOTTOM_SHEET_DATA) public editLocation: { id: number }
  ) {
    super(injector);
  }

  ngAfterViewInit(): void {
    if (this.editLocation && this.editLocation.id) {
      this.api.getLocation(this.editLocation.id).subscribe((location: Location) => {
        this.location = location;

        this.nameComponent.form.patchValue({ name: location.name });
        this.lightComponent.form.patchValue({ light: location.light });
        this.privacyComponent.form.patchValue({ public: location.public });
      });
    }
  }

  submit(): void {
    if (!this.checkFormValidity()) {
      this.errorHandler.push(this.translate.instant('general.formErrors'));
      return;
    }

    const data: Location = this.getLocationFromForm();
    const ud = this.openUploadDialog();

    if (this.editLocation.id) {
      data.id = this.editLocation.id;

      this.api.updateLocation(data, this.removePicture).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.error?.msg === 'IMG_NOT_VALID') this.errorHandler.push(this.translate.instant('errors.invalidImg'));

          return EMPTY;
        }),
        finalize(() => {
          ud.close();

          if (this.editLocation && this.bottomSheetRef) this.bottomSheetRef.dismiss(this.returnedLocation);
        })
      ).subscribe((location: Location) => {
        if (this.editLocation && this.bottomSheetRef) {
          this.returnedLocation = location;
        }
      });
    }
  }
}
