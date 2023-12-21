import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { TranslocoService, TranslocoModule } from '@ngneat/transloco';
import { catchError, EMPTY, finalize, switchMap } from 'rxjs';

import {
  FileUploaderComponent
} from '@components/file-uploader/file-uploader.component';
import {
  StepperNavigationComponent
} from '@components/stepper-navigation/stepper-navigation.component';
import {
  PlantFormNameComponent
} from '@components/plant/forms/plant-form-name/plant-form-name.component';
import {
  PlantFormSpecieComponent
} from '@components/plant/forms/plant-form-specie/plant-form-specie.component';
import {
  WaitDialogComponent
} from '@components/dialogs/wait-dialog/wait-dialog.component';
import {
  FormPrivacyComponent
} from '@components/form-privacy/form-privacy.component';
import { LocationService } from '@services/location.service';
import { PlantService } from '@services/plant.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { PhotoService } from '@services/photo.service';
import { Plant } from '@models/plant.model';
import { Photo } from '@models/photo.model';

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
})
export class PlantAddComponent {
  @ViewChild(PlantFormNameComponent) nameComponent!: PlantFormNameComponent;
  @ViewChild(PlantFormSpecieComponent)
  specieComponent!: PlantFormSpecieComponent;
  @ViewChild(FormPrivacyComponent) privacyComponent!: FormPrivacyComponent;

  locationId?: number;
  photos: File[] = [];

  constructor(
    private locationService: LocationService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private translate: TranslocoService,
    private router: Router,
    private plantService: PlantService,
    private photoService: PhotoService,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.locationId = +this.route.snapshot.params['locationId'];

    if (this.locationId) {
      this.locationService.get(this.locationId).subscribe({
        error: () => {
          this.errorHandler.push(this.translate.translate('plant-add.location'));
          this.router.navigateByUrl('/');
        },
      });
    }
  }

  fileChange(files: File[]) {
    this.photos = files;
  }

  checkFormValidity(): boolean {
    const forms = [
      this.nameComponent.form,
      this.specieComponent.form,
      this.privacyComponent.form,
    ];

    return forms.every((form) => form.valid);
  }

  openUploadDialog(): MatDialogRef<WaitDialogComponent, any> {
    return this.dialog.open(WaitDialogComponent, {
      disableClose: true,
      data: {
        message: this.translate.translate('progress-bar.uploading'),
        progressBar: true,
        progressValue: 0,
        finalMessage: this.translate.translate('general.afterUpload'),
      },
    });
  }

  getPlantFromForm(): Plant {
    return {
      ...this.nameComponent.form.value,
      ...this.specieComponent.form.value,
      ...this.privacyComponent.form.value,
      locationId: this.locationId,
    } as Plant;
  }

  submit(): void {
    if (!this.checkFormValidity()) {
      this.errorHandler.push(this.translate.translate('general.formErrors'));
      return;
    }

    const plant: Plant = this.getPlantFromForm();
    const ud = this.openUploadDialog();
    const obs = this.plantService.create(plant);

    if (this.photos.length > 0) {
      obs
        .pipe(
          switchMap((plant: Plant) => {
            const photos = {
              plantId: plant.id,
              public: plant.public,
              pictureFiles: this.photos,
            } as Photo;

            return this.photoService.create(photos, true).pipe(
              catchError(() => {
                // Plant is created even though photo upload may have failed
                // we redirect to Plant
                this.router.navigate(['/plant', plant.id]);

                return EMPTY;
              })
            );
          }),
          finalize(() => {
            ud.close();
          })
        )
        .subscribe((event) => {
          switch (event.type) {
            case HttpEventType.UploadProgress: {
              const eventTotal = event.total ? event.total : 0;
              const progressVal = Math.round((event.loaded / eventTotal) * 100);
              ud.componentInstance.data.progressValue = progressVal;

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
          })
        )
        .subscribe({
          next: (plant: Plant) => {
            this.router.navigate(['/plant', plant.id], { replaceUrl: true });
          },
          error: () => {
            this.errorHandler.push(this.translate.translate('plant-add.create'));
          },
        });
    }
  }
}
