import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpEventType } from '@angular/common/http';
import { finalize } from 'rxjs';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatStepperModule } from '@angular/material/stepper';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import {
  StepperNavigationComponent
} from '@components/stepper-navigation/stepper-navigation.component';
import {
  FileUploaderComponent
} from '@components/file-uploader/file-uploader.component';
import {
  WaitDialogComponent
} from '@components/dialogs/wait-dialog/wait-dialog.component';
import {
  FormPrivacyComponent
} from '@components/form-privacy/form-privacy.component';
import { PlantService } from '@services/plant.service';
import { PhotoService } from '@services/photo.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { Photo } from '@models/photo.model';

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
    TranslateModule,
    StepperNavigationComponent,
    FileUploaderComponent,
    FormPrivacyComponent,
  ],
  templateUrl: './photo-add.component.html',
})
export class PhotoAddComponent {
  @ViewChild(FormPrivacyComponent) privacyComponent!: FormPrivacyComponent;
  plantId?: number;
  pictures: File[] = [];

  constructor(
    private plantService: PlantService,
    private photoService: PhotoService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private errorHandler: ErrorHandlerService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.plantId = +this.route.snapshot.params['plantId'];

    if (this.plantId) {
      this.plantService.get(this.plantId).subscribe({
        error: () => {
          this.errorHandler.push(this.translate.instant('plant.invalid'));
          this.router.navigateByUrl('/');
        },
      });
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
        message: this.translate.instant('progress-bar.uploading'),
        progressBar: true,
        progressValue: 0,
        finalMessage: this.translate.instant('general.afterUpload'),
      },
    });
  }

  submit(): void {
    if (!this.plantId) return;

    if (!this.checkFormValidity()) {
      this.errorHandler.push(this.translate.instant('general.formErrors'));
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
            this.router.navigate(['plant', this.plantId], { replaceUrl: true });
            break;
          }
        }
      });
  }
}
