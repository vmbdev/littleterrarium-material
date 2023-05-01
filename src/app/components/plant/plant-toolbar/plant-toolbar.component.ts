import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PlantButtonWaterComponent } from '../buttons/plant-button-water/plant-button-water.component';
import { PlantButtonFertilizeComponent } from '../buttons/plant-button-fertilize/plant-button-fertilize.component';

@Component({
  selector: 'plant-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    PlantButtonWaterComponent,
    PlantButtonFertilizeComponent
  ],
  templateUrl: './plant-toolbar.component.html',
  styleUrls: ['./plant-toolbar.component.scss']
})
export class PlantToolbarComponent {
  @Input() id?: number;
  @Output() edit = new EventEmitter();
  @Output() remove = new EventEmitter();

  constructor() {}
}
