import { Component, Inject, Optional, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploaderComponent } from '@components/file-uploader/file-uploader.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { PlantFormNameComponent } from '../plant-form-name/plant-form-name.component';
import { PlantFormPrivacyComponent } from '../plant-form-privacy/plant-form-privacy.component';
import { PlantFormSpecieComponent } from '../plant-form-specie/plant-form-specie.component';
import { Plant } from '@models/plant.model';
import { Location } from '@models/location.model';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { finalize } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ErrorHandlerService } from '@services/error-handler.service';
import { PlantService } from '@services/plant.service';
import { WaitDialogComponent } from '@components/dialogs/wait-dialog/wait-dialog.component';
import { PlantGetConfig } from '@services/api.service';

interface PlantEditConfig {
  id: number,
  config: PlantGetConfig
}

@Component({
  selector: 'plant-edit',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatTabsModule,
    MatButtonModule,
    FileUploaderComponent,

    PlantFormNameComponent,
    PlantFormPrivacyComponent,
    PlantFormSpecieComponent
  ],
  templateUrl: './plant-edit.component.html',
  styleUrls: ['./plant-edit.component.scss']
})
export class PlantEditComponent {
  @ViewChild(PlantFormNameComponent) nameComponent!: PlantFormNameComponent;
  @ViewChild(PlantFormSpecieComponent) specieComponent!: PlantFormSpecieComponent;
  @ViewChild(PlantFormPrivacyComponent) privacyComponent!: PlantFormPrivacyComponent;

  id?: number;
  locations: Location[] = [];
  removeSpecie: boolean = false;
  returnedPlant?: Plant;

  constructor(
    private dialog: MatDialog,
    private translate: TranslateService,
    public plantService: PlantService,
    private errorHandler: ErrorHandlerService,
    @Optional() private bottomSheetRef: MatBottomSheetRef,
    @Optional() @Inject(MAT_BOTTOM_SHEET_DATA) public editPlant: PlantEditConfig
  ) { }

  // FIXME: race condition ?
  ngAfterViewInit(): void {
    this.plantService.get(this.editPlant.id, this.editPlant.config).subscribe((plant: Plant) => {
      this.id = plant.id;

      this.nameComponent.form.patchValue({ customName: plant.customName });
      this.specieComponent.form.patchValue({ specieId: plant.specieId });
      // this.descriptionComponent.form.patchValue({ description: plant.description });
      // this.conditionComponent.form.patchValue({ condition: plant.condition });
      // this.locationComponent.form.patchValue({ locationId: plant.locationId });
      this.privacyComponent.form.patchValue({ public: plant.public });
    })
  }

  getPlantFromForm(): Plant {
    return {
      ...this.nameComponent.form.value,
      ...this.specieComponent.form.value,
      ...this.privacyComponent.form.value,
      // ...this.descriptionComponent.form.value,
      // ...this.conditionComponent.form.value,
      // ...this.locationComponent.form.value,
      id: this.id
    } as Plant;
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

  checkFormValidity(): boolean {
    const forms = [
      this.nameComponent.form,
      this.specieComponent.form,
      this.privacyComponent.form,
    ];

    return forms.every((form) => form.valid);
  }

  submit(): void {
    if (!this.checkFormValidity()) {
      this.errorHandler.push(this.translate.instant('general.formErrors'));
      return;
    }
    
    const plant: Plant = this.getPlantFromForm();    
    const wd = this.openWaitDialog();

    this.plantService.update(plant, { removeSpecie: this.removeSpecie }).pipe(
      finalize(() => {
        wd.close();

        if (this.editPlant && this.bottomSheetRef) {
          this.bottomSheetRef.dismiss(this.returnedPlant);
        }
      })
    ).subscribe((updatedPlant: Plant) => {
      const currentPlant = this.plantService.plant$.getValue();

      if (this.editPlant && this.bottomSheetRef) {
        this.returnedPlant = { ...currentPlant, ...updatedPlant };
      }
    });

  }

}
