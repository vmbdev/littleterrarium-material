import { Component, Inject, Optional, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA
} from '@angular/material/bottom-sheet';
import { finalize, Observable } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import {
  WaitDialogComponent
} from '@components/dialogs/wait-dialog/wait-dialog.component';
import {
  FileUploaderComponent
} from '@components/file-uploader/file-uploader.component';
import {
  PlantFormNameComponent
} from '@components/plant/forms/plant-form-name/plant-form-name.component';
import {
  PlantFormSpecieComponent
} from '@components/plant/forms/plant-form-specie/plant-form-specie.component';
import {
  PlantFormDescriptionComponent
} from '@components/plant/forms/plant-form-description/plant-form-description.component';
import {
  PlantFormConditionComponent
} from '@components/plant/forms/plant-form-condition/plant-form-condition.component';
import {
  PlantFormLocationComponent
} from '@components/plant/forms/plant-form-location/plant-form-location.component';
import { EditPageComponent } from '@components/edit-page/edit-page.component';
import {
  FormPrivacyComponent
} from '@components/form-privacy/form-privacy.component';
import { PlantGetConfig } from '@services/api.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { PlantService } from '@services/plant.service';
import { Plant } from '@models/plant.model';
import { Location } from '@models/location.model';

interface PlantEditConfig {
  id: number;
  config: PlantGetConfig;
}

@Component({
  selector: 'ltm-plant-edit',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    FileUploaderComponent,

    PlantFormNameComponent,
    PlantFormSpecieComponent,
    PlantFormDescriptionComponent,
    PlantFormConditionComponent,
    PlantFormLocationComponent,
    FormPrivacyComponent,
    EditPageComponent,
  ],
  templateUrl: './plant-edit.component.html',
})
export class PlantEditComponent {
  @ViewChild(PlantFormNameComponent)
  nameComponent!: PlantFormNameComponent;
  @ViewChild(PlantFormSpecieComponent)
  specieComponent!: PlantFormSpecieComponent;
  @ViewChild(FormPrivacyComponent)
  privacyComponent!: FormPrivacyComponent;
  @ViewChild(PlantFormDescriptionComponent)
  descriptionComponent!: PlantFormDescriptionComponent;
  @ViewChild(PlantFormConditionComponent)
  conditionComponent!: PlantFormConditionComponent;
  @ViewChild(PlantFormLocationComponent)
  locationComponent!: PlantFormLocationComponent;

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
  ) {}

  ngOnInit(): void {
    this.plant$ = this.plantService.get(
      this.editPlant.id,
      this.editPlant.config
    );
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
      this.locationComponent.form,
    ];
  }

  getPlantFromForm(): Plant {
    // calling here to avoid a race condition in OnInit
    // where plant$ isn't ready before ngViewAfterInit
    if (this.forms.length === 0) this.createFormList();

    return {
      ...Object.assign({}, ...this.forms.map((i) => i.value)),
      id: this.editPlant.id,
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

    this.plantService
      .update(plant)
      .pipe(
        finalize(() => {
          wd.close();
        })
      )
      .subscribe((updatedPlant: Plant) => {
        const currentPlant = this.plantService.current();

        if (this.editPlant && this.bottomSheetRef) {
          this.returnedPlant = { ...currentPlant, ...updatedPlant };
          this.bottomSheetRef.dismiss(this.returnedPlant);
        }
      });
  }
}
