import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  EMPTY,
  Observable,
  forkJoin,
  of,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { TranslocoService, TranslocoModule } from '@ngneat/transloco';

import { PhotoFormDescriptionComponent } from '@components/photo/forms/photo-form-description/photo-form-description.component';
import { PhotoFormDateComponent } from '@components/photo/forms/photo-form-date/photo-form-date.component';
import { WaitDialogComponent } from '@components/dialogs/wait-dialog/wait-dialog.component';
import { EditPageComponent } from '@components/edit-page/edit-page.component';
import { FormPrivacyComponent } from '@components/form-privacy/form-privacy.component';
import { ToggleOptionComponent } from '@components/toggle-option/toggle-option.component';
import { SettingsCardComponent } from '@components/settings-card/settings-card.component';
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
    ReactiveFormsModule,
    TranslocoModule,
    PhotoFormDescriptionComponent,
    PhotoFormDateComponent,
    FormPrivacyComponent,
    EditPageComponent,
    ToggleOptionComponent,
    SettingsCardComponent,
  ],
  templateUrl: './photo-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoEditComponent {
  private readonly dialog = inject(MatDialog);
  private readonly translate = inject(TranslocoService);
  private readonly fb = inject(FormBuilder);
  protected readonly plantService = inject(PlantService);
  protected readonly photoService = inject(PhotoService);
  private readonly errorHandler = inject(ErrorHandlerService);
  private readonly bottomSheetRef = inject(MatBottomSheetRef, {
    optional: true,
  });
  protected readonly editPhoto: PhotoEditConfig = inject(MAT_BOTTOM_SHEET_DATA, {
    optional: true,
  });

  protected form = this.fb.group({
    takenAt: new FormControl<Date | string | null>(null),
    description: [''],
    public: new FormControl<boolean>(true),
  });

  private returnedPhoto?: Photo;

  protected plantCoverId?: number;
  private plantId?: number;
  private setPhotoAsCover: boolean = false;

  protected photo$?: Observable<Photo | null>;

  ngOnInit(): void {
    this.photo$ = this.photoService.get(this.editPhoto.id).pipe(
      switchMap((photo: Photo | null) => {
        if (photo) return this.plantService.getCover(photo.plantId);

        return EMPTY;
      }),
      withLatestFrom(this.photoService.photo$),
      tap(([{ coverId }, photo]) => {
        if (photo) {
          this.form.patchValue({
            description: photo.description,
            takenAt: photo.takenAt,
            public: photo.public,
          });
          this.plantCoverId = coverId;
          this.plantId = photo.plantId;
        }
      }),
      switchMap(() => this.photoService.photo$),
    );
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

  updateCoverPhoto(checked: boolean) {
    this.setPhotoAsCover = checked;
  }

  submit(): void {
    if (!this.form.valid) {
      this.errorHandler.push(this.translate.translate('general.formErrors'));
      return;
    }

    const photo: Photo = {
      ...this.form.value,
      id: this.editPhoto.id,
    } as Photo;
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
