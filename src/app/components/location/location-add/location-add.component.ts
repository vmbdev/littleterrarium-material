import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatDialogModule } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { catchError, EMPTY, finalize, Observable, tap } from 'rxjs';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

import { StepperNavigationComponent } from '@components/stepper-navigation/stepper-navigation.component';
import { FileUploaderComponent } from '@components/file-uploader/file-uploader.component';
import { LocationFormNameComponent } from '@components/location/forms/location-form-name/location-form-name.component';
import { LocationFormLightComponent } from '@components/location/forms/location-form-light/location-form-light.component';
import { FormPrivacyComponent } from '@components/form-privacy/form-privacy.component';
import { Location } from '@models/location.model';
import { ErrorHandlerService } from '@services/error-handler.service';
import { LocationService } from '@services/location.service';

@Component({
  selector: 'ltm-location-add',
  standalone: true,
  templateUrl: './location-add.component.html',
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatDialogModule,
    TranslocoModule,
    StepperNavigationComponent,
    FileUploaderComponent,
    LocationFormNameComponent,
    LocationFormLightComponent,
    FormPrivacyComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationAddComponent {
  private readonly fb = inject(FormBuilder);
  private readonly translate = inject(TranslocoService);
  private readonly locationService = inject(LocationService);
  private readonly errorHandler = inject(ErrorHandlerService);
  private readonly router = inject(Router);

  protected readonly nameForm = this.fb.group({
    name: new FormControl<string>('', Validators.required),
  });
  protected readonly lightForm = this.fb.group({
    light: new FormControl<string>('FULLSUN', Validators.required),
  });
  protected readonly privacyForm = this.fb.group({
    public: new FormControl<boolean>(true),
  });
  protected readonly photoForm = this.fb.group({
    pictureFile: new FormControl<File | null>(null),
  });

  protected readonly form = this.fb.group({
    name: this.nameForm,
    light: this.lightForm,
    public: this.privacyForm,
    pictureFile: this.photoForm,
  });

  protected createLocation$?: Observable<Location>;

  submit(): void {
    if (!this.form.valid) {
      this.errorHandler.push(this.translate.translate('general.formErrors'));
      return;
    }

    const location = {
      ...this.nameForm.value,
      ...this.lightForm.value,
      ...this.privacyForm.value,
      ...this.photoForm.value,
    } as Location;

    const ud = this.locationService.openUploadDialog();

    this.createLocation$ = this.locationService.create(location).pipe(
      tap((location: Location) => {
        this.router.navigate(['location', location.id], { replaceUrl: true });
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.error?.msg === 'IMG_NOT_VALID') {
          this.errorHandler.push(this.translate.translate('errors.invalidImg'));
        }

        return EMPTY;
      }),
      finalize(() => {
        ud.close();
      }),
    );
  }
}
