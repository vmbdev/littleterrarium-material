import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PlantBaseActionComponent } from '@components/plant/plant-base-action/plant-base-action.component';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'plant-button-water',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './plant-button-water.component.html',
  styleUrls: ['./plant-button-water.component.scss']
})
export class PlantButtonWaterComponent extends PlantBaseActionComponent {
  @Input() disabled: boolean = false;
  
}
