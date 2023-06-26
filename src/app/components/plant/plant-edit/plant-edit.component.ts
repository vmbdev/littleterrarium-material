import { Component, Inject, Optional, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploaderComponent } from '@components/file-uploader/file-uploader.component';
import { MatButtonModule } from '@angular/material/button';
import { FormGroup } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { Plant } from '@models/plant.model';
import { Location } from '@models/location.model';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { finalize, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ErrorHandlerService } from '@services/error-handler.service';
import { PlantService } from '@services/plant.service';
import { WaitDialogComponent } from '@components/dialogs/wait-dialog/wait-dialog.component';
import { PlantGetConfig } from '@services/api.service';
import { PlantFormNameComponent } from '@components/plant/forms/plant-form-name/plant-form-name.component';
import { PlantFormPrivacyComponent } from '@components/plant/forms/plant-form-privacy/plant-form-privacy.component';
import { PlantFormSpecieComponent } from '@components/plant/forms/plant-form-specie/plant-form-specie.component';
import { PlantFormDescriptionComponent } from '@components/plant/forms/plant-form-description/plant-form-description.component';
import { PlantFormConditionComponent } from '@components/plant/forms/plant-form-condition/plant-form-condition.component';
import { PlantFormLocationComponent } from '@components/plant/forms/plant-form-location/plant-form-location.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

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
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    FileUploaderComponent,

    PlantFormNameComponent,
    PlantFormPrivacyComponent,
    PlantFormSpecieComponent,
    PlantFormDescriptionComponent,
    PlantFormConditionComponent,
    PlantFormLocationComponent
  ],
  templateUrl: './plant-edit.component.html',
  styleUrls: ['./plant-edit.component.scss']
})
export class PlantEditComponent {
  @ViewChild(PlantFormNameComponent) nameComponent!: PlantFormNameComponent;
  @ViewChild(PlantFormSpecieComponent) specieComponent!: PlantFormSpecieComponent;
  @ViewChild(PlantFormPrivacyComponent) privacyComponent!: PlantFormPrivacyComponent;
  @ViewChild(PlantFormDescriptionComponent) descriptionComponent!: PlantFormDescriptionComponent;
  @ViewChild(PlantFormConditionComponent) conditionComponent!: PlantFormConditionComponent;
  @ViewChild(PlantFormLocationComponent) locationComponent!: PlantFormLocationComponent;

  locations: Location[] = [];
  returnedPlant?: Plant;
  plant$?: Observable<Plant>;

  forms: FormGroup[] = [];

  constructor(
    private dialog: MatDialog,
    private translate: TranslateService,
    public plantService: PlantService,
    private errorHandler: ErrorHandlerService,
    @Optional() private bottomSheetRef: MatBottomSheetRef,
    @Optional() @Inject(MAT_BOTTOM_SHEET_DATA) public editPlant: PlantEditConfig
  ) { }

  ngOnInit(): void {
    this.plant$ = this.plantService.get(this.editPlant.id, this.editPlant.config);
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
      this.nameComponent.form,
      this.specieComponent.form,
      this.privacyComponent.form,
      this.descriptionComponent.form,
      this.conditionComponent.form,
      this.locationComponent.form
    ];
  }

  getPlantFromForm(): Plant {
    // calling here to avoid a race condition in OnInit
    // where plant$ isn't ready before ngViewAfterInit
    if (this.forms.length === 0) this.createFormList();

    return {
      ...Object.assign({}, ...(this.forms.map(i => i.value))),
      id: this.editPlant.id
    } as Plant;
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
    
    const plant: Plant = this.getPlantFromForm();
    const wd = this.openWaitDialog();

    this.plantService.update(plant).pipe(
      finalize(() => { wd.close() })
    ).subscribe((updatedPlant: Plant) => {
      const currentPlant = this.plantService.current();

      if (this.editPlant && this.bottomSheetRef) {
        this.returnedPlant = { ...currentPlant, ...updatedPlant };
        this.bottomSheetRef.dismiss(this.returnedPlant);
      }
    });

  }

}
