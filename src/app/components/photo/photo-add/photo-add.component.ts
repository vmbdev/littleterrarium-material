import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { StepperNavigationComponent } from '@components/stepper-navigation/stepper-navigation.component';
import { FileUploaderComponent } from '@components/file-uploader/file-uploader.component';
import { PhotoFormPrivacyComponent } from '@components/photo/photo-form-privacy/photo-form-privacy.component';
import { PlantService } from '@services/plant.service';
import { PhotoService } from '@services/photo.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorHandlerService } from '@services/error-handler.service';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { finalize } from 'rxjs';
import { HttpEventType } from '@angular/common/http';
import { Photo } from '@models/photo.model';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { WaitDialogComponent } from '@components/dialogs/wait-dialog/wait-dialog.component';

@Component({
  selector: 'photo-add',
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
    PhotoFormPrivacyComponent
  ],
  templateUrl: './photo-add.component.html',
  styleUrls: ['./photo-add.component.scss']
})
export class PhotoAddComponent {
  @ViewChild(PhotoFormPrivacyComponent) privacyComponent!: PhotoFormPrivacyComponent;
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
        }
      });
    }
  }

  fileChange(files: File[]) {
    this.pictures = files;
  }

  checkFormValidity(): boolean {
    const forms = [
      this.privacyComponent.form,
    ];

    return forms.every((form) => form.valid) && (this.pictures.length > 0);
  }

  getPhotoFromForm(): Photo {
    return {
      ...this.privacyComponent.form.value,
      pictureFiles: this.pictures,
      plantId: this.plantId
    } as Photo;
  }

  openUploadDialog(): MatDialogRef<WaitDialogComponent, any>  {
    return this.dialog.open(WaitDialogComponent, {
      disableClose: true,
      data: {
        message: this.translate.instant('progress-bar.uploading'),
        progressBar: true,
        progressValue: 0,
        finalMessage: this.translate.instant('general.afterUpload')
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

    this.photoService.create(newPhoto)
    .pipe(
      finalize(() => { ud.close() })
    ).subscribe((event) => {
      switch (event.type) {
        case HttpEventType.UploadProgress: {
          const eventTotal = event.total ? event.total : 0;
          ud.componentInstance.data.progressValue = Math.round(event.loaded / eventTotal * 100);
          break;
        }
        case HttpEventType.Response: {
          if (event.body?.msg === 'PHOTOS_CREATED') {
            this.router.navigate(['plant', this.plantId])
          }
          break;
        }

      }
    });
  }
}
