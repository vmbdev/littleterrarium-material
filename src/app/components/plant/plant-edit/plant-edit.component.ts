import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';
import { finalize, Observable, tap } from 'rxjs';
import { TranslocoService, TranslocoModule } from '@ngneat/transloco';

import { WaitDialogComponent } from '@components/dialogs/wait-dialog/wait-dialog.component';
import { FileUploaderComponent } from '@components/file-uploader/file-uploader.component';
import { PlantFormNameComponent } from '@components/plant/forms/plant-form-name/plant-form-name.component';
import { PlantFormSpecieComponent } from '@components/plant/forms/plant-form-specie/plant-form-specie.component';
import { PlantFormDescriptionComponent } from '@components/plant/forms/plant-form-description/plant-form-description.component';
import { PlantFormConditionComponent } from '@components/plant/forms/plant-form-condition/plant-form-condition.component';
import { PlantFormLocationComponent } from '@components/plant/forms/plant-form-location/plant-form-location.component';
import { EditPageComponent } from '@components/edit-page/edit-page.component';
import { FormPrivacyComponent } from '@components/form-privacy/form-privacy.component';
import { SettingsCardComponent } from '@components/settings-card/settings-card.component';
import { PlantGetConfig } from '@services/api/api.service';
import { ErrorHandlerService } from '@services/error-handler/error-handler.service';
import { PlantService } from '@services/plant/plant.service';
import { Plant } from '@models/plant.model';

interface PlantEditConfig {
  id: number;
  config: PlantGetConfig;
}

@Component({
  selector: 'ltm-plant-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslocoModule,
    FileUploaderComponent,
    PlantFormNameComponent,
    PlantFormSpecieComponent,
    PlantFormDescriptionComponent,
    PlantFormConditionComponent,
    PlantFormLocationComponent,
    FormPrivacyComponent,
    EditPageComponent,
    SettingsCardComponent,
  ],
  templateUrl: './plant-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlantEditComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialog = inject(MatDialog);
  private readonly translate = inject(TranslocoService);
  private readonly plantService = inject(PlantService);
  private readonly errorHandler = inject(ErrorHandlerService);
  private readonly bottomSheetRef = inject(MatBottomSheetRef, {
    optional: true,
  });
  private readonly editPlant: PlantEditConfig = inject(MAT_BOTTOM_SHEET_DATA, {
    optional: true,
  });

  protected plant$?: Observable<Plant>;

  protected readonly form = this.fb.group({
    customName: [''],
    description: [''],
    locationId: new FormControl<number | null>(null, Validators.required),
    specieId: new FormControl<number | null>(null),
    condition: [''],
    public: new FormControl<boolean>(true, Validators.required),
  });

  ngOnInit(): void {
    this.plant$ = this.plantService
      .get(this.editPlant.id, this.editPlant.config)
      .pipe(
        tap((plant: Plant) => {
          this.form.patchValue({
            customName: plant.customName,
            description: plant.description,
            locationId: plant.locationId,
            specieId: plant.specieId,
            condition: plant.condition,
            public: plant.public,
          });
        }),
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

  submit(): void {
    if (!this.form.valid || !this.editPlant.id) {
      this.errorHandler.push(this.translate.translate('general.formErrors'));
      return;
    }

    const plant: Plant = {
      id: this.editPlant.id,
      ...this.form.value
    } as Plant;
    const wd = this.openWaitDialog();

    this.plantService
      .update(plant)
      .pipe(
        finalize(() => {
          wd.close();
        }),
      )
      .subscribe((updatedPlant: Plant) => {
        const currentPlant = this.plantService.current();

        if (this.editPlant && this.bottomSheetRef) {
          const finalPlant = { ...currentPlant, ...updatedPlant };
          this.bottomSheetRef.dismiss(finalPlant);
        }
      });
  }
}
