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
import { LocationFormNameComponent } from '@components/location/forms/location-form-name/location-form-name.component';
import { LocationFormLightComponent } from '@components/location/forms/location-form-light/location-form-light.component';
import { FormPrivacyComponent } from '@components/form-privacy/form-privacy.component';
import { Location } from '@models/location.model';
import { ErrorHandlerService } from '@services/error-handler/error-handler.service';
import { LocationService } from '@services/location/location.service';
import { LimitLargeScreenDirective } from '@directives/limit-large-screen/limit-large-screen.directive';
import { ImageSelectorComponent } from '@components/image-selector/image-selector.component';

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
    LocationFormNameComponent,
    LocationFormLightComponent,
    FormPrivacyComponent,
    ImageSelectorComponent,
    LimitLargeScreenDirective,
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
  protected newPicture: string | null = null;

  selectImage(file: File | null) {
    if (file) {
      this.photoForm.patchValue({
        pictureFile: file,
      });

      this.newPicture = URL.createObjectURL(file);
    } else {
      this.photoForm.patchValue({
        pictureFile: null,
      });

      if (this.newPicture) {
        URL.revokeObjectURL(this.newPicture);
        this.newPicture = null;
      }
    }
  }

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
