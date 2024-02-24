import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  MatBottomSheet,
  MatBottomSheetModule
} from '@angular/material/bottom-sheet';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslocoModule } from '@ngneat/transloco';

import {
  PlantEditWaterComponent
} from '@components/plant/plant-edit-water/plant-edit-water.component';
import { PlantService } from '@services/plant.service';
import { DaysAgoPipe } from '@pipes/days-ago/days-ago.pipe';
import { WaterInfo } from '@models/plant.model';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlantWaterWidgetComponent {
  public readonly id = input.required<number>();
  public readonly owned = input<boolean>(true);
  public readonly data = input.required<WaterInfo>();
  private readonly bottomSheet = inject(MatBottomSheet);
  protected readonly plantService = inject(PlantService);

  openEdit(): void {
    this.bottomSheet.open(PlantEditWaterComponent);
  }
}
