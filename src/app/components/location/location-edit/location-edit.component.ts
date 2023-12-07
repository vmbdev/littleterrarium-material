import { CommonModule } from '@angular/common';
import { Component, Inject, Injector, Optional } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, EMPTY, finalize, Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA
} from '@angular/material/bottom-sheet';
import { TranslateModule } from '@ngx-translate/core';

import {
  FileUploaderComponent
} from '@components/file-uploader/file-uploader.component';
import {
  LocationFormLightComponent
} from '@components/location/forms/location-form-light/location-form-light.component';
import {
  LocationFormNameComponent
} from '@components/location/forms/location-form-name/location-form-name.component';
import {
  LocationUpsertBaseComponent
} from '@components/location/location-upsert-base/location-upsert-base.component';
import { EditPageComponent } from '@components/edit-page/edit-page.component';
import {
  FormPrivacyComponent
} from '@components/form-privacy/form-privacy.component';
import { Location } from '@models/location.model';

// TODO: remove location photo
@Component({
  selector: 'ltm-location-edit',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    FileUploaderComponent,
    LocationFormNameComponent,
    LocationFormLightComponent,
    FormPrivacyComponent,
    EditPageComponent,
  ],
  templateUrl: './location-edit.component.html',
})
export class LocationEditComponent extends LocationUpsertBaseComponent {
  removePicture: boolean = false;

  location$?: Observable<Location>;
  returnedLocation?: Location;

  constructor(
    private injector: Injector,
    @Optional() private bottomSheetRef: MatBottomSheetRef,
    @Optional()
    @Inject(MAT_BOTTOM_SHEET_DATA)
    public editLocation: { id: number }
  ) {
    super(injector);
  }

  ngOnInit(): void {
    if (this.editLocation && this.editLocation.id) {
      this.location$ = this.locationService.get(this.editLocation.id);
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

      this.locationService
        .update(data, { removePicture: this.removePicture })
        .pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.error?.msg === 'IMG_NOT_VALID') {
              this.errorHandler.push(
                this.translate.instant('errors.invalidImg')
              );
            }

            return EMPTY;
          }),
          finalize(() => {
            ud.close();
          })
        )
        .subscribe((location: Location) => {
          if (this.bottomSheetRef) this.bottomSheetRef.dismiss(location);
        });
    }
  }
}
