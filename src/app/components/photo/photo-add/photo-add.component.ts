import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpEventType } from '@angular/common/http';
import { EMPTY, Observable, catchError, finalize } from 'rxjs';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatStepperModule } from '@angular/material/stepper';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TranslocoService, TranslocoModule } from '@ngneat/transloco';

import { StepperNavigationComponent } from '@components/stepper-navigation/stepper-navigation.component';
import { FileUploaderComponent } from '@components/file-uploader/file-uploader.component';
import { WaitDialogComponent } from '@components/dialogs/wait-dialog/wait-dialog.component';
import { FormPrivacyComponent } from '@components/form-privacy/form-privacy.component';
import { PlantService } from '@services/plant.service';
import { PhotoService } from '@services/photo.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { Photo } from '@models/photo.model';
import { Plant } from '@models/plant.model';

@Component({
  selector: 'ltm-photo-add',
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
    MatCheckboxModule,
    MatDialogModule,
    ReactiveFormsModule,
    TranslocoModule,
    StepperNavigationComponent,
    FileUploaderComponent,
    FormPrivacyComponent,
  ],
  templateUrl: './photo-add.component.html',
})
export class PhotoAddComponent {
  @ViewChild(FormPrivacyComponent) privacyComponent!: FormPrivacyComponent;
  private plantId?: number;
  protected plant$?: Observable<Plant>;
  private pictures: File[] = [];

  constructor(
    private readonly plantService: PlantService,
    private readonly photoService: PhotoService,
    private readonly translate: TranslocoService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly errorHandler: ErrorHandlerService,
    private readonly dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.plantId = +this.route.snapshot.params['plantId'];

    if (this.plantId) {
      this.plant$ = this.plantService.get(this.plantId).pipe(
        catchError(() => {
          this.errorHandler.push(this.translate.translate('plant.invalid'));
          this.router.navigateByUrl('/');

          return EMPTY;
        }),
      );
    }
  }

  fileChange(files: File[]) {
    this.pictures = files;
  }

  checkFormValidity(): boolean {
    const forms = [this.privacyComponent.form];

    return forms.every((form) => form.valid) && this.pictures.length > 0;
  }

  getPhotoFromForm(): Photo {
    return {
      ...this.privacyComponent.form.value,
      pictureFiles: this.pictures,
      plantId: this.plantId,
    } as Photo;
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

  submit(): void {
    if (!this.plantId) return;

    if (!this.checkFormValidity()) {
      this.errorHandler.push(this.translate.translate('general.formErrors'));
      return;
    }

    const newPhoto = this.getPhotoFromForm();
    const ud = this.openUploadDialog();

    newPhoto.plantId = this.plantId;

    this.photoService
      .create(newPhoto)
      .pipe(
        finalize(() => {
          ud.close();
        }),
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
            this.router.navigate(['plant', this.plantId], { replaceUrl: true });
            break;
          }
        }
      });
  }
}
