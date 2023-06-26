import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@components/dialogs/confirm-dialog/confirm-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { PlantService } from '@services/plant.service';

@Component({
  selector: 'plant-base-action',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule
  ],
  templateUrl: './plant-base-action.component.html'
})
export class PlantBaseActionComponent {
  @Input({ required: true }) id?: number;
  @Output() done = new EventEmitter();

  constructor(
    private plantService: PlantService,
    private dialog: MatDialog,
    private translate: TranslateService
  ) {}

  openWaterDialog() {
    if (this.id) {
      this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: this.translate.instant('general.watering'),
          question: [
            this.translate.instant('plant-widget-water.confirm'),
            this.translate.instant('plant-widget-water.warning')
          ],
          accept: () => this.plantService.water(this.id).subscribe(() => {
            this.done.emit()
          })
        },
      });
    }
  }

  openFertDialog() {
    if (this.id) {
      this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: this.translate.instant('general.fertilize'),
          question: [
            this.translate.instant('plant-widget-fertilizer.confirm')
          ],
          accept: () => this.plantService.fertilize(this.id).subscribe(() => {
            this.done.emit()
          })
        },
      });
    }
  }
}
