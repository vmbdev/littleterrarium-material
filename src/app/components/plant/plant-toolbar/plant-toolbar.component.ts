import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import {
  PlantButtonWaterComponent
} from '@components/plant/buttons/plant-button-water/plant-button-water.component';
import {
  PlantButtonFertilizeComponent
} from '@components/plant/buttons/plant-button-fertilize/plant-button-fertilize.component';

@Component({
  selector: 'ltm-plant-toolbar',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    PlantButtonWaterComponent,
    PlantButtonFertilizeComponent,
  ],
  templateUrl: './plant-toolbar.component.html',
  styleUrls: ['./plant-toolbar.component.scss'],
})
export class PlantToolbarComponent {
  @Input({ required: true }) id?: number;
  @Output() edit = new EventEmitter();
  @Output() remove = new EventEmitter();
}
