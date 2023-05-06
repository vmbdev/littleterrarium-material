import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PlantService } from '@services/plant.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent } from '@components/dialogs/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'plant-button-water',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './plant-button-water.component.html',
  styleUrls: ['./plant-button-water.component.scss']
})
export class PlantButtonWaterComponent {
  @Input({ required: true }) id?: number;
  @Input() disabled: boolean = false;
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

}
