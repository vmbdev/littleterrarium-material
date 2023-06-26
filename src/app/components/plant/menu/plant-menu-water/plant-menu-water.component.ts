import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { PlantBaseActionComponent } from '@components/plant/plant-base-action/plant-base-action.component';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'plant-menu-water',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    TranslateModule
  ],
  templateUrl: './plant-menu-water.component.html',
  styleUrls: ['./plant-menu-water.component.scss']
})
export class PlantMenuWaterComponent extends PlantBaseActionComponent {

}
