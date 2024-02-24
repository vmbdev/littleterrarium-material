import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Injector,
  Optional,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, EMPTY, finalize } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';
import { TranslocoModule } from '@ngneat/transloco';

import { FileUploaderComponent } from '@components/file-uploader/file-uploader.component';
import { LocationFormLightComponent } from '@components/location/forms/location-form-light/location-form-light.component';
import { LocationFormNameComponent } from '@components/location/forms/location-form-name/location-form-name.component';
import { LocationUpsertBaseComponent } from '@components/location/location-upsert-base/location-upsert-base.component';
import { EditPageComponent } from '@components/edit-page/edit-page.component';
import { FormPrivacyComponent } from '@components/form-privacy/form-privacy.component';
import { Location } from '@models/location.model';

@Component({
  selector: 'ltm-location-edit',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoModule,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationEditComponent extends LocationUpsertBaseComponent {
  protected $location: WritableSignal<Location | null> = signal(null);
  
  constructor(
    @Optional() private readonly bottomSheetRef: MatBottomSheetRef,
    @Optional()
    @Inject(MAT_BOTTOM_SHEET_DATA)
    protected readonly location: Location,
    ) {
      const injector = inject(Injector);
      super(injector);
  }

  ngOnInit(): void {
    if (this.location) this.$location.set(this.location);
  }

  submit(): void {
    if (!this.checkFormValidity()) {
      this.errorHandler.push(this.translate.translate('general.formErrors'));
      return;
    }

    if (this.location) {
      const data: Location = this.getLocationFromForm();
      const ud = this.openUploadDialog();
      const removePicture =
        !!this.fileUploaderComponent.form.get('remove')?.value;

      data.id = this.location.id;

      this.locationService
        .update(data, { removePicture })
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
          if (this.bottomSheetRef) this.bottomSheetRef.dismiss(location);
        });
    }
  }
}
