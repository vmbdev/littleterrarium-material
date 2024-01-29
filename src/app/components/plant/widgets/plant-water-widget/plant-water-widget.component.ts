import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  MatBottomSheet,
  MatBottomSheetModule
} from '@angular/material/bottom-sheet';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslocoService, TranslocoModule } from '@ngneat/transloco';

import {
  PlantEditWaterComponent
} from '@components/plant/plant-edit-water/plant-edit-water.component';
import {
  ConfirmDialogComponent
} from '@components/dialogs/confirm-dialog/confirm-dialog.component';
import { PlantService } from '@services/plant.service';
import { DaysAgoPipe } from '@pipes/days-ago/days-ago.pipe';

@Component({
  selector: 'ltm-plant-water-widget',
  standalone: true,
  templateUrl: './plant-water-widget.component.html',
  imports: [
    CommonModule,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    MatBottomSheetModule,
    MatDialogModule,
    TranslocoModule,
    DaysAgoPipe,
  ],
})
export class PlantWaterWidgetComponent {
  constructor(
    public readonly plantService: PlantService,
    private readonly bottomSheet: MatBottomSheet,
    private readonly dialog: MatDialog,
    private readonly translate: TranslocoService
  ) {}

  openEdit(): void {
    this.bottomSheet.open(PlantEditWaterComponent);
  }

  openWaterDialog() {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this.translate.translate('general.watering'),
        question: [
          this.translate.translate('plant-widget-water.confirm'),
          this.translate.translate('plant-widget-water.warning'),
        ],
        accept: () => this.plantService.water().subscribe(),
      },
    });
  }
}
