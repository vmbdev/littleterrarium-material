import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslocoService } from '@ngneat/transloco';

import { ConfirmDialogComponent } from '@components/dialogs/confirm-dialog/confirm-dialog.component';
import { PlantService } from '@services/plant.service';

@Component({
  selector: 'ltm-plant-base-action',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './plant-base-action.component.html',
})
export class PlantBaseActionComponent {
  @Input({ required: true }) id?: number;
  @Output() done = new EventEmitter();

  constructor(
    private readonly plantService: PlantService,
    private readonly dialog: MatDialog,
    private readonly translate: TranslocoService,
  ) {}

  openWaterDialog() {
    if (this.id) {
      this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: this.translate.translate('general.watering'),
          question: [
            this.translate.translate('plant-widget-water.confirm'),
            this.translate.translate('plant-widget-water.warning'),
          ],
          accept: () => {
            this.plantService.water(this.id).subscribe(() => {
              this.done.emit();
            });
          },
        },
      });
    }
  }

  openFertDialog() {
    if (this.id) {
      this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: this.translate.translate('general.fertilize'),
          question: [
            this.translate.translate('plant-widget-fertilizer.confirm'),
          ],
          accept: () => {
            this.plantService.fertilize(this.id).subscribe(() => {
              this.done.emit();
            });
          },
        },
      });
    }
  }
}
