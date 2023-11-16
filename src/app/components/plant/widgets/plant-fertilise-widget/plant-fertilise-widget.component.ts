import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import {
  MatBottomSheetModule,
  MatBottomSheet
} from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import {
  ConfirmDialogComponent
} from '@components/dialogs/confirm-dialog/confirm-dialog.component';
import {
  PlantEditFertilizerComponent
} from '@components/plant/plant-edit-fertilizer/plant-edit-fertilizer.component';
import { PlantService } from '@services/plant.service';
import { DaysAgoPipe } from '@pipes/days-ago/days-ago.pipe';

@Component({
  selector: 'ltm-plant-fertilise-widget',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    MatBottomSheetModule,
    MatDialogModule,
    TranslateModule,
    DaysAgoPipe,
  ],
  templateUrl: './plant-fertilise-widget.component.html'
})
export class PlantFertiliseWidgetComponent {
  constructor(
    public plantService: PlantService,
    private bottomSheet: MatBottomSheet,
    private dialog: MatDialog,
    private translate: TranslateService
  ) {}

  openEdit(): void {
    this.bottomSheet.open(PlantEditFertilizerComponent);
  }

  openFertDialog() {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this.translate.instant('general.fertilizer'),
        question: [
          this.translate.instant('plant-widget-fertilizer.confirm')
        ],
        accept: () => this.plantService.fertilize().subscribe()
      },
    });
  }
}
