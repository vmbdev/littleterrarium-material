import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
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
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
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
import { WaitDialogComponent } from '@components/dialogs/wait-dialog/wait-dialog.component';
import { Location } from '@models/location.model';
import { ErrorHandlerService } from '@services/error-handler.service';
import { LocationService } from '@services/location.service';

@Component({
  selector: 'ltm-location-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
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
export class LocationEditComponent {
  @ViewChild(FileUploaderComponent)
  fileUploaderComponent!: FileUploaderComponent;

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
    pictureFile: new FormControl<File | null>(null),
  });

  protected $location: WritableSignal<Location | null> = signal(null);

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

  fileChange(files: File[]) {
    if (files.length > 0) {
      this.form.patchValue({ pictureFile: files[0] });
    }
  }

  submit(): void {
    if (!this.form.valid) {
      this.errorHandler.push(this.translate.translate('general.formErrors'));
      return;
    }

    if (this.location) {
      const data: Location = this.form.value as Location;
      const ud = this.locationService.openUploadDialog();
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
