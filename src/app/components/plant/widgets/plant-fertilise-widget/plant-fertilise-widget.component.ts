import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import {
  MatBottomSheetModule,
  MatBottomSheet,
} from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslocoModule } from '@ngneat/transloco';

import { PlantEditFertilizerComponent } from '@components/plant/plant-edit-fertilizer/plant-edit-fertilizer.component';
import { DaysAgoPipe } from '@pipes/days-ago/days-ago.pipe';
import { FertInfo } from '@models/plant.model';
import { PlantService } from '@services/plant.service';

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
    TranslocoModule,
    DaysAgoPipe,
  ],
  templateUrl: './plant-fertilise-widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlantFertiliseWidgetComponent {
  public readonly id = input.required<number>();
  public readonly owned = input<boolean>(true);
  public readonly data = input.required<FertInfo>();

  private readonly bottomSheet = inject(MatBottomSheet);
  protected readonly plantService = inject(PlantService);

  openEdit(): void {
    this.bottomSheet.open(PlantEditFertilizerComponent);
  }
}
