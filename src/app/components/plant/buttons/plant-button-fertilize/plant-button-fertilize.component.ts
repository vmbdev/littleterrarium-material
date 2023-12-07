import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

import {
  PlantBaseActionComponent
} from '@components/plant/plant-base-action/plant-base-action.component';

@Component({
  selector: 'ltm-plant-button-fertilize',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './plant-button-fertilize.component.html',
  styleUrls: ['./plant-button-fertilize.component.scss'],
})
export class PlantButtonFertilizeComponent extends PlantBaseActionComponent {
  @Input() disabled: boolean = false;
}
