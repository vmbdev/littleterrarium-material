import {
  ChangeDetectionStrategy,
  Component,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';
import { catchError, EMPTY, finalize } from 'rxjs';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

import { FileUploaderComponent } from '@components/file-uploader/file-uploader.component';
import { LocationFormLightComponent } from '@components/location/forms/location-form-light/location-form-light.component';
import { LocationFormNameComponent } from '@components/location/forms/location-form-name/location-form-name.component';
import { EditPageComponent } from '@components/edit-page/edit-page.component';
import { FormPrivacyComponent } from '@components/form-privacy/form-privacy.component';
import { SettingsCardComponent } from '@components/settings-card/settings-card.component';
import { CurrentPicComponent } from '@components/current-pic/current-pic.component';
import { ErrorHandlerService } from '@services/error-handler.service';
import { LocationService } from '@services/location.service';
import { Location } from '@models/location.model';
import { ImagePathPipe } from '@pipes/image-path/image-path.pipe';

@Component({
  selector: 'ltm-location-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslocoModule,
    FileUploaderComponent,
    LocationFormNameComponent,
    LocationFormLightComponent,
    FormPrivacyComponent,
    EditPageComponent,
    CurrentPicComponent,
    SettingsCardComponent,
    ImagePathPipe,
  ],
  templateUrl: './location-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationEditComponent {
  protected readonly fb = inject(FormBuilder);
  protected readonly translate = inject(TranslocoService);
  protected readonly locationService = inject(LocationService);
  protected readonly errorHandler = inject(ErrorHandlerService);
  private readonly bottomSheetRef = inject(MatBottomSheetRef, {
    optional: true,
  });
  protected readonly location: Location = inject(MAT_BOTTOM_SHEET_DATA, {
    optional: true,
  });

  protected readonly form = this.fb.group({
    name: new FormControl<string>('', Validators.required),
    light: new FormControl<string>('FULLSUN', Validators.required),
    public: new FormControl<boolean>(true),
    pictureFile: new FormControl<File | null>(null)
  });

  protected $location: WritableSignal<Location | null> = signal(null);
  protected removePicture: boolean = false;

  ngOnInit(): void {
    if (this.location) {
      this.$location.set(this.location);

      this.form.patchValue({
        name: this.location.name,
        light: this.location.light,
        public: this.location.public,
      });
    }
  }

  setRemovePicture() {
    this.removePicture = true;
  }

  submit(): void {
    if (!this.form.valid) {
      this.errorHandler.push(this.translate.translate('general.formErrors'));
      return;
    }

    if (this.location) {
      const data = {
        ...this.form.value,
        id: this.location.id,
      } as Location;
      const ud = this.locationService.openUploadDialog();

      this.locationService
        .update(data, { removePicture: this.removePicture })
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
