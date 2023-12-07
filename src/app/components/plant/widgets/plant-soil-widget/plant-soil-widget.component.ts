import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import {
  MatBottomSheetModule,
  MatBottomSheet
} from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import {
  PlantEditSoilComponent
} from '@components/plant/plant-edit-soil/plant-edit-soil.component';
import { PlantService } from '@services/plant.service';
import { potChoices } from '@models/plant.model';
import { UnitPipe } from "@pipes/unit/unit.pipe";

@Component({
  selector: 'ltm-plant-soil-widget',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    MatBottomSheetModule,
    TranslateModule,
    UnitPipe,
  ],
  templateUrl: './plant-soil-widget.component.html',
})
export class PlantSoilWidgetComponent {
  constructor(
    public plantService: PlantService,
    private bottomSheet: MatBottomSheet,
    private translate: TranslateService
  ) {}

  getPotName(): string {
    let potName;
    const potType = this.plantService.current()?.potType;

    if (potType) {
      if (potChoices.hasOwnProperty(potType)) {
        potName = potChoices[potType].name;
      } else potName = potType;
    } else potName = this.translate.instant('general.unknown:Unknown');

    return potName;
  }

  openEdit(): void {
    this.bottomSheet.open(PlantEditSoilComponent);
  }
}
