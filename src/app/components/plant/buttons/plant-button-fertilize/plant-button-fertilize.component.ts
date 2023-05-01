import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslateService } from '@ngx-translate/core';
import { PlantService } from '@services/plant.service';
import { ConfirmDialogComponent } from '@components/dialogs/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'plant-button-fertilize',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './plant-button-fertilize.component.html',
  styleUrls: ['./plant-button-fertilize.component.scss']
})
export class PlantButtonFertilizeComponent {
  @Input() id?: number;
  @Input() disabled: boolean = false;
  @Output() done = new EventEmitter();

  constructor(
    private plantService: PlantService,
    private dialog: MatDialog,
    private translate: TranslateService
  ) {}

  openFertDialog() {
    if (this.id) {
      this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: this.translate.instant('general.fertilizer'),
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
