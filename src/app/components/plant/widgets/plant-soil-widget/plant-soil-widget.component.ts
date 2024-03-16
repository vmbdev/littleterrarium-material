import { ChangeDetectionStrategy, Component, Signal, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import {
  MatBottomSheetModule,
  MatBottomSheet,
} from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoModule } from '@ngneat/transloco';

import { PlantEditSoilComponent } from '@components/plant/plant-edit-soil/plant-edit-soil.component';
import { PlantService } from '@services/plant.service';
import { PotInfo } from '@models/plant.model';
import { UnitPipe } from '@pipes/unit/unit.pipe';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlantSoilWidgetComponent {
  protected readonly plantService = inject(PlantService);
  private readonly bottomSheet = inject(MatBottomSheet);

  owned = input<boolean>(true);
  data = input.required<PotInfo>();

  protected readonly $potName: Signal<string> = computed(() => {
    const potType = this.data().potType;

    if (potType) return this.plantService.getPotInfo(potType).name;
    else return 'general.unknown';
  });

  openEdit(): void {
    this.bottomSheet.open(PlantEditSoilComponent);
  }
}
