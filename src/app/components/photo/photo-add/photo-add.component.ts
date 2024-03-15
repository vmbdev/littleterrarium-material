import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { LimitLargeScreenDirective } from '@directives/limit-large-screen/limit-large-screen.directive';

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
    ReactiveFormsModule,
    MatStepperModule,
    MatDialogModule,
    TranslocoModule,
    StepperNavigationComponent,
    FileUploaderComponent,
    FormPrivacyComponent,
    LimitLargeScreenDirective,
  ],
  templateUrl: './photo-add.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoAddComponent {
  private readonly fb = inject(FormBuilder);
  private readonly plantService = inject(PlantService);
  private readonly photoService = inject(PhotoService);
  private readonly translate = inject(TranslocoService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly errorHandler = inject(ErrorHandlerService);
  private readonly dialog = inject(MatDialog);

  protected readonly form = this.fb.group({
    public: new FormControl<boolean>(true),
    pictureFiles: new FormControl<File[]>([], Validators.required),
  });
  private plantId?: number;
  protected plant$?: Observable<Plant>;

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

  submit(): void {
    if (!this.plantId) return;

    if (!this.form.valid) {
      this.errorHandler.push(this.translate.translate('general.formErrors'));
      return;
    }

    const newPhoto = {
      ...this.form.value,
      plantId: this.plantId,
    } as Photo;
    const progressVal = signal(0);
    const ud = this.openUploadDialog(progressVal);

    this.photoService
      .create(newPhoto)
      .pipe(
        finalize(() => {
          ud.close();
        }),
      )
      .subscribe((event) => {
        if (event.type === HttpEventType.UploadProgress) {
          const eventTotal = event.total ? event.total : 0;
          progressVal.set(Math.round((event.loaded / eventTotal) * 100));
        } else if (event.type === HttpEventType.Response) {
          this.router.navigate(['plant', this.plantId], { replaceUrl: true });
        }
      });
  }
}
