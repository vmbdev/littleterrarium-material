import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { TranslocoService, TranslocoModule } from '@ngneat/transloco';
import { catchError, EMPTY, finalize, Observable, switchMap } from 'rxjs';

import { FileUploaderComponent } from '@components/file-uploader/file-uploader.component';
import { StepperNavigationComponent } from '@components/stepper-navigation/stepper-navigation.component';
import { PlantFormNameComponent } from '@components/plant/forms/plant-form-name/plant-form-name.component';
import { PlantFormSpecieComponent } from '@components/plant/forms/plant-form-specie/plant-form-specie.component';
import { WaitDialogComponent } from '@components/dialogs/wait-dialog/wait-dialog.component';
import { FormPrivacyComponent } from '@components/form-privacy/form-privacy.component';
import { LocationService } from '@services/location.service';
import { PlantService } from '@services/plant.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { PhotoService } from '@services/photo.service';
import { Plant } from '@models/plant.model';
import { Photo } from '@models/photo.model';
import { Location } from '@models/location.model';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'ltm-plant-add',
  standalone: true,
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
    PlantFormNameComponent,
    PlantFormSpecieComponent,
    FormPrivacyComponent,
  ],
  templateUrl: './plant-add.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlantAddComponent {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly translate = inject(TranslocoService);
  private readonly locationService = inject(LocationService);
  private readonly plantService = inject(PlantService);
  private readonly photoService = inject(PhotoService);
  private readonly errorHandler = inject(ErrorHandlerService);

  protected readonly customNameForm = this.fb.group({ customName: [''] });
  protected readonly specieIdForm = this.fb.group({
    specieId: new FormControl<number | null>(null),
  });
  protected readonly privacyForm = this.fb.group({
    public: new FormControl<boolean>(true, Validators.required),
  });
  protected readonly photoForm = this.fb.group({
    photos: new FormControl<File[]>([]),
  });

  private readonly form = this.fb.group({
    customName: this.customNameForm,
    specieId: this.specieIdForm,
    public: this.privacyForm,
  });

  private locationId?: number;
  protected location$?: Observable<Location>;

  ngOnInit(): void {
    this.locationId = +this.route.snapshot.params['locationId'];

    if (this.locationId) {
      this.location$ = this.locationService.get(this.locationId).pipe(
        catchError(() => {
          this.errorHandler.push(
            this.translate.translate('plant-add.location'),
          );
          this.router.navigateByUrl('/');

          return EMPTY;
        }),
      );
    }
  }

  openUploadDialog(
    progressVal: Signal<number> = signal(0),
  ): MatDialogRef<WaitDialogComponent, any> {
    return this.dialog.open(WaitDialogComponent, {
      disableClose: true,
      data: {
        message: this.translate.translate('progress-bar.uploading'),
        progressBar: true,
        progressValue: progressVal,
        finalMessage: this.translate.translate('general.afterUpload'),
      },
    });
  }

  getPlantFromForm(): Plant {
    return {
      ...this.customNameForm.value,
      ...this.specieIdForm.value,
      ...this.privacyForm.value,
      locationId: this.locationId,
    } as Plant;
  }

  submit(): void {
    if (!this.form.valid) {
      this.errorHandler.push(this.translate.translate('general.formErrors'));
      return;
    }

    const plant: Plant = this.getPlantFromForm();
    const photos = this.photoForm.value.photos;
    const progressVal = signal<number>(0);
    const ud = this.openUploadDialog(progressVal);
    const obs = this.plantService.create(plant);

    if (photos && photos.length > 0) {
      obs
        .pipe(
          switchMap((plant: Plant) => {
            const photoData = {
              plantId: plant.id,
              public: plant.public,
              pictureFiles: photos,
            } as Photo;

            return this.photoService.create(photoData, true).pipe(
              catchError(() => {
                // Plant is created even though photo upload may have failed
                // we redirect to Plant
                this.router.navigate(['/plant', plant.id]);

                return EMPTY;
              }),
            );
          }),
          finalize(() => {
            ud.close();
          }),
        )
        .subscribe((event) => {
          switch (event.type) {
            case HttpEventType.UploadProgress: {
              const eventTotal = event.total ? event.total : 0;
              progressVal.set(Math.round((event.loaded / eventTotal) * 100));

              break;
            }
            case HttpEventType.Response: {
              if (event.body?.data?.plantId) {
                this.router.navigate(['/plant', event.body.data.plantId], {
                  replaceUrl: true,
                });
              }

              break;
            }
          }
        });
    } else {
      obs
        .pipe(
          finalize(() => {
            ud.close();
          }),
          catchError(() => {
            this.errorHandler.push(
              this.translate.translate('plant-add.create'),
            );

            return EMPTY;
          }),
        )
        .subscribe((plant: Plant) => {
          this.router.navigate(['/plant', plant.id], { replaceUrl: true });
        });
    }
  }
}
