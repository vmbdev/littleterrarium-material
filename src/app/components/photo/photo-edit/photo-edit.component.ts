import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Component, Inject, Optional, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { finalize } from 'rxjs';
import { TranslocoService, TranslocoModule } from '@ngneat/transloco';

import { PhotoFormDescriptionComponent } from '@components/photo/forms/photo-form-description/photo-form-description.component';
import { PhotoFormDateComponent } from '@components/photo/forms/photo-form-date/photo-form-date.component';
import { WaitDialogComponent } from '@components/dialogs/wait-dialog/wait-dialog.component';
import { EditPageComponent } from '@components/edit-page/edit-page.component';
import { FormPrivacyComponent } from '@components/form-privacy/form-privacy.component';
import { ErrorHandlerService } from '@services/error-handler.service';
import { PlantService } from '@services/plant.service';
import { PhotoService } from '@services/photo.service';
import { Photo } from '@models/photo.model';

interface PhotoEditConfig {
  id: number;
}

// TODO: add cover edit here
@Component({
  selector: 'ltm-photo-edit',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    PhotoFormDescriptionComponent,
    PhotoFormDateComponent,
    FormPrivacyComponent,
    EditPageComponent,
  ],
  templateUrl: './photo-edit.component.html',
})
export class PhotoEditComponent {
  @ViewChild(PhotoFormDescriptionComponent)
  descriptionComp!: PhotoFormDescriptionComponent;
  @ViewChild(FormPrivacyComponent) privacyComp!: FormPrivacyComponent;
  @ViewChild(PhotoFormDateComponent) dateComp!: PhotoFormDateComponent;

  private forms: FormGroup[] = [];
  private returnedPhoto?: Photo;

  photo$ = this.photoService.get(this.editPhoto.id, {
    navigation: true,
    cover: true,
  });

  constructor(
    private readonly dialog: MatDialog,
    private readonly translate: TranslocoService,
    public readonly plantService: PlantService,
    public readonly photoService: PhotoService,
    private readonly errorHandler: ErrorHandlerService,
    @Optional() private readonly bottomSheetRef: MatBottomSheetRef,
    @Optional()
    @Inject(MAT_BOTTOM_SHEET_DATA)
    public readonly editPhoto: PhotoEditConfig,
  ) {}

  openWaitDialog() {
    return this.dialog.open(WaitDialogComponent, {
      disableClose: true,
      data: {
        message: this.translate.translate('general.loading'),
        progressBar: false,
      },
    });
  }

  createFormList(): void {
    this.forms = [
      this.descriptionComp.form,
      this.privacyComp.form,
      this.dateComp.form,
    ];
  }

  getPhotoFromForm(): Photo {
    // calling here to avoid a race condition in OnInit
    // where plant$ isn't ready before ngViewAfterInit
    if (this.forms.length === 0) this.createFormList();

    return {
      ...Object.assign({}, ...this.forms.map((i) => i.value)),
      id: this.editPhoto.id,
    } as Photo;
  }

  checkFormValidity(): boolean {
    // calling here to avoid a race condition in OnInit
    // where plant$ isn't ready before ngViewAfterInit
    if (this.forms.length === 0) this.createFormList();

    return this.forms.every((form) => form.valid);
  }

  submit(): void {
    if (!this.checkFormValidity()) {
      this.errorHandler.push(this.translate.translate('general.formErrors'));
      return;
    }

    const photo: Photo = this.getPhotoFromForm();
    const wd = this.openWaitDialog();

    this.photoService
      .update(photo)
      .pipe(
        finalize(() => {
          wd.close();
        }),
      )
      .subscribe((updatedPhoto: Photo) => {
        const currentPhoto = this.photoService.current();

        if (this.editPhoto && this.bottomSheetRef) {
          this.returnedPhoto = { ...currentPhoto, ...updatedPhoto };
          this.bottomSheetRef.dismiss(this.returnedPhoto);
        }
      });
  }
}
