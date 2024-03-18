import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  computed,
  input,
  inject,
} from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@ngneat/transloco';

import { PlantWaterWidgetComponent } from '@components/plant/widgets/plant-water-widget/plant-water-widget.component';
import { PlantFertiliseWidgetComponent } from '@components/plant/widgets/plant-fertilise-widget/plant-fertilise-widget.component';
import { PlantSoilWidgetComponent } from '@components/plant/widgets/plant-soil-widget/plant-soil-widget.component';
import { FertInfo, Plant, PotInfo, WaterInfo } from '@models/plant.model';
import { PlantService } from '@services/plant.service';
import { LimitLargeScreenDirective } from '@directives/limit-large-screen/limit-large-screen.directive';

@Component({
  selector: 'ltm-plant-expansion-info',
  standalone: true,
  imports: [
    MatExpansionModule,
    MatIconModule,
    PlantWaterWidgetComponent,
    PlantFertiliseWidgetComponent,
    PlantSoilWidgetComponent,
    TranslocoModule,
    LimitLargeScreenDirective,
  ],
  templateUrl: './plant-expansion-info.component.html',
  styleUrl: './plant-expansion-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlantExpansionInfoComponent {
  protected readonly plantService = inject(PlantService);

  $owned = input<boolean>(true);
  $plant = input.required<Plant>();

  protected $waterData: Signal<WaterInfo> = computed(() => {
    const plant = this.$plant();
    return {
      waterLast: plant.waterLast,
      waterFreq: plant.waterFreq,
      waterNext: plant.waterNext,
    };
  });

  protected $fertData: Signal<FertInfo> = computed(() => {
    const plant = this.$plant();
    return {
      fertLast: plant.fertLast,
      fertFreq: plant.fertFreq,
      fertNext: plant.fertNext,
      fertType: plant.fertType,
    };
  });

  protected $potData: Signal<PotInfo> = computed(() => {
    const plant = this.$plant();
    return {
      soil: plant.soil,
      potType: plant.potType,
      potSize: plant.potSize,
    };
  });
}
