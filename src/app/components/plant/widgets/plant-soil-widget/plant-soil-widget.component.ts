import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import {
  MatBottomSheetModule,
  MatBottomSheet
} from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoService, TranslocoModule } from '@ngneat/transloco';

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
    TranslocoModule,
    UnitPipe,
  ],
  templateUrl: './plant-soil-widget.component.html',
})
export class PlantSoilWidgetComponent {
  constructor(
    public plantService: PlantService,
    private bottomSheet: MatBottomSheet,
    private translate: TranslocoService
  ) {}

  getPotName(): string {
    let potName;
    const potType = this.plantService.current()?.potType;

    if (potType) {
      if (potChoices.hasOwnProperty(potType)) {
        potName = potChoices[potType].name;
      } else potName = potType;
    } else potName = this.translate.translate('general.unknown:Unknown');

    return potName;
  }

  openEdit(): void {
    this.bottomSheet.open(PlantEditSoilComponent);
  }
}
