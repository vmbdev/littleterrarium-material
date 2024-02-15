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
import {
  EMPTY,
  Observable,
  forkJoin,
  of,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import { TranslocoService, TranslocoModule } from '@ngneat/transloco';

import { PhotoFormDescriptionComponent } from '@components/photo/forms/photo-form-description/photo-form-description.component';
import { PhotoFormDateComponent } from '@components/photo/forms/photo-form-date/photo-form-date.component';
import { WaitDialogComponent } from '@components/dialogs/wait-dialog/wait-dialog.component';
import { EditPageComponent } from '@components/edit-page/edit-page.component';
import { FormPrivacyComponent } from '@components/form-privacy/form-privacy.component';
import { ToggleOptionComponent } from '@components/toggle-option/toggle-option.component';
import { ErrorHandlerService } from '@services/error-handler.service';
import { PlantService } from '@services/plant.service';
import { PhotoService } from '@services/photo.service';
import { Photo } from '@models/photo.model';
import { Plant } from '@models/plant.model';

interface PhotoEditConfig {
  id: number;
}

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
    ToggleOptionComponent,
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

  protected plantCoverId?: number;
  private plantId?: number;
  private setPhotoAsCover: boolean = false;

  photo$ = this.photoService.get(this.editPhoto.id);

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

  ngOnInit(): void {
    const obs$ = this.photoService.photo$;

    obs$
      .pipe(
        switchMap((photo: Photo | null) => {
          if (photo) return this.plantService.getCover(photo.plantId);

          return EMPTY;
        }),
        withLatestFrom(obs$),
      )
      .subscribe(([{ coverId }, photo]) => {
        if (photo) {
          this.plantCoverId = coverId;
          this.plantId = photo.plantId;
        }
      });
  }

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

  updateCoverPhoto(checked: boolean) {
    this.setPhotoAsCover = checked;
  }

  submit(): void {
    if (!this.checkFormValidity()) {
      this.errorHandler.push(this.translate.translate('general.formErrors'));
      return;
    }
    const photo: Photo = this.getPhotoFromForm();
    const wd = this.openWaitDialog();
    const updatePhoto$ = this.photoService.update(photo);
    let updatePlantCover$: Observable<any>;
    let plant: Plant | undefined = undefined;

    // if this photo will be the new cover,
    // or if the current photo will be removed from cover
    if (this.setPhotoAsCover) {
      plant = { id: this.plantId, coverId: this.editPhoto.id } as Plant;
    } else if (this.plantCoverId == this.editPhoto.id) {
      plant = { id: this.plantId, coverId: null } as Plant;
    }

    if (plant) updatePlantCover$ = this.plantService.update(plant);
    else updatePlantCover$ = of(null);

    forkJoin([updatePhoto$, updatePlantCover$]).subscribe(([updatedPhoto]) => {
      const currentPhoto = this.photoService.current();

      if (this.editPhoto && this.bottomSheetRef) {
        this.returnedPhoto = { ...currentPhoto, ...updatedPhoto };
        this.bottomSheetRef.dismiss(this.returnedPhoto);
      }

      wd.close();
    });
  }
}
