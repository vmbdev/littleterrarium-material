import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { PlantWaterWidgetComponent } from '@components/plant/widgets/plant-water-widget/plant-water-widget.component';
import { PlantFertiliseWidgetComponent } from '@components/plant/widgets/plant-fertilise-widget/plant-fertilise-widget.component';
import { PlantSoilWidgetComponent } from '@components/plant/widgets/plant-soil-widget/plant-soil-widget.component';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'plant-expansion-info',
  standalone: true,
  templateUrl: './plant-expansion-info.component.html',
  styleUrls: ['./plant-expansion-info.component.scss'],
  imports: [
    CommonModule,
    MatExpansionModule,
    MatIconModule,
    PlantWaterWidgetComponent,
    PlantFertiliseWidgetComponent,
    PlantSoilWidgetComponent,
    TranslateModule
  ]
})
export class PlantExpansionInfoComponent {

}
