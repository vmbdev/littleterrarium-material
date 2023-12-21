import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@ngneat/transloco';

import {
  PlantWaterWidgetComponent
} from '@components/plant/widgets/plant-water-widget/plant-water-widget.component';
import {
  PlantFertiliseWidgetComponent
} from '@components/plant/widgets/plant-fertilise-widget/plant-fertilise-widget.component';
import {
  PlantSoilWidgetComponent
} from '@components/plant/widgets/plant-soil-widget/plant-soil-widget.component';


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
  ],
  templateUrl: './plant-expansion-info.component.html',
})
export class PlantExpansionInfoComponent {}
