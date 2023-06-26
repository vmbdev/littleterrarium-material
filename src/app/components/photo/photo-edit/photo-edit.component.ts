import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Component, Inject, Optional, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, finalize } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { PhotoFormDescriptionComponent } from '@components/photo/forms/photo-form-description/photo-form-description.component';
import { PhotoFormPrivacyComponent } from '@components/photo/forms/photo-form-privacy/photo-form-privacy.component';
import { PhotoFormDateComponent } from '@components/photo/forms/photo-form-date/photo-form-date.component';
import { WaitDialogComponent } from '@components/dialogs/wait-dialog/wait-dialog.component';
import { ErrorHandlerService } from '@services/error-handler.service';
import { PlantService } from '@services/plant.service';
import { PhotoService } from '@services/photo.service';
import { Photo } from '@models/photo.model';

interface PhotoEditConfig {
  id: number
}

@Component({
  selector: 'photo-edit',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,

    PhotoFormDescriptionComponent,
    PhotoFormPrivacyComponent,
    PhotoFormDateComponent
  ],
  templateUrl: './photo-edit.component.html',
  styleUrls: ['./photo-edit.component.scss']
})
export class PhotoEditComponent {
  @ViewChild(PhotoFormDescriptionComponent) descriptionComp!: PhotoFormDescriptionComponent;
  @ViewChild(PhotoFormPrivacyComponent) privacyComp!: PhotoFormPrivacyComponent;
  @ViewChild(PhotoFormDateComponent) dateComp!: PhotoFormDateComponent;

  photo$? = new BehaviorSubject<Photo | null>(null);
  forms: FormGroup[] = [];
  returnedPhoto?: Photo;

  constructor(
    private dialog: MatDialog,
    private translate: TranslateService,
    public plantService: PlantService,
    public photoService: PhotoService,
    private errorHandler: ErrorHandlerService,
    @Optional() private bottomSheetRef: MatBottomSheetRef,
    @Optional() @Inject(MAT_BOTTOM_SHEET_DATA) public editPhoto: PhotoEditConfig
  ) {}

  ngOnInit(): void {
    this.photoService.get(this.editPhoto.id, { navigation: true, cover: true }).subscribe();
  }

  openWaitDialog() {
    return this.dialog.open(WaitDialogComponent, {
      disableClose: true,
      data: {
        message: this.translate.instant('general.loading'),
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
      ...Object.assign({}, ...(this.forms.map(i => i.value))),
      id: this.editPhoto.id
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
      this.errorHandler.push(this.translate.instant('general.formErrors'));
      return;
    }
    
    const photo: Photo = this.getPhotoFromForm();
    const wd = this.openWaitDialog();

    this.photoService.update(photo).pipe(
      finalize(() => { wd.close() })
    ).subscribe((updatedPhoto: Photo) => {
      const currentPhoto = this.photoService.photo$.getValue();

      if (this.editPhoto && this.bottomSheetRef) {
        this.returnedPhoto = { ...currentPhoto, ...updatedPhoto };
        this.bottomSheetRef.dismiss(this.returnedPhoto);
      }
    })
  }
}
